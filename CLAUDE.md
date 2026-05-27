# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Astro SSR site backed by DatoCMS, built on the official DatoCMS Astro Starter Kit. Content is fetched from the DatoCMS Content Delivery API (CDA) via fully-typed GraphQL queries (gql.tada). Supports Draft Mode, real-time preview, and click-to-edit Visual Editing overlays.

## Commands

- `npm run dev` — dev server at http://localhost:4321
- `npm run build` — runs `astro check` (typecheck) then `astro build`
- `npm run lint` — `prettier --check .`
- `npm run format` — `prettier . --write` (also runs automatically on pre-commit via simple-git-hooks)
- `npm run generate-schema` — regenerate `schema.graphql` + gql.tada output from the live CDA. **Run after any DatoCMS schema change.** Needs `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN` in `.env`.
- `npm run generate-cma-types` — regenerate `src/lib/datocms/cma-types.ts` from the CMA schema. **Run after any DatoCMS schema change.** Needs `DATOCMS_CMA_TOKEN`.

There is no test suite. Node >= 22.12 is required.

## Environment

Copy `.env.example` to `.env`. Env vars are declared and validated in `astro.config.mjs` (`env.schema`), so a missing/invalid var fails the build. Access them via `astro:env/server` / `astro:env/client`, never `process.env`. Three distinct DatoCMS tokens: published CDA, draft CDA, and CMA (read).

## Deployment

`astro.config.mjs` uses `output: 'server'` with the **node** adapter (standalone) for local dev. The platform adapter is swapped in at build time: `vercel.json` and `netlify.toml` run `npx astro add vercel|netlify --yes` before building. Don't hardcode the node adapter assumption when changing deploy config.

## Architecture

### Typed GraphQL with fragment colocation

All CDA queries go through `graphql()` from `src/lib/datocms/graphql.ts` (gql.tada, with DatoCMS custom scalars mapped). The core pattern:

- Each rendering component lives in its own folder: `Component.astro` + `index.ts` (re-export) + `fragments.ts` (the GraphQL fragment it needs).
- A page/route **composes** its query from these fragments. In `graphql(query, [...fragments])` the fragment array must mirror the `...FooFragment` spreads in the query string — adding a fragment to the query means adding it to both the imports and the array. See `src/pages/page/[slug].astro` for the canonical example.
- Components receive masked fragment data typed as `FragmentOf<typeof FooFragment>` and call `readFragment(FooFragment, prop)` to unmask it.

### Published vs. draft fetching

`src/lib/datocms/executeQuery.ts` is the single entry point for CDA reads. Pass `includeDrafts` (derived from `isDraftModeEnabled(Astro.cookies)`) and it picks the draft vs. published token automatically. It also enables `contentLink: 'v1'` stega encoding **only** for draft content — this is what powers the click-to-edit overlays, and it is intentionally off in production.

### Draft Mode

`src/lib/draftMode.ts` manages a JWT-signed cookie (`DRAFT_MODE_COOKIE_NAME`, signed with `SIGNED_COOKIE_JWT_SECRET`). Routes read it via `isDraftModeEnabled`. The cookie is `SameSite=None; Secure; partitioned` so it works inside the DatoCMS iframe. Toggle endpoints: `src/pages/api/draft-mode/{enable,disable}`.

### Structured Text

Always render Structured Text through `~/components/Text` (the `<Text />` wrapper), never `@datocms/astro`'s `<StructuredText />` directly. The wrapper bakes in the `data-datocms-content-link-group` attribute (required for Visual Editing) and default node overrides (headings get anchor links). Per-field concerns — `blockComponents`, `inlineRecordComponents`, `linkToRecordComponents` — are passed by the caller and map `__typename` → component (see `[slug].astro`).

### Registering a new model

When you add a model in DatoCMS and want it routable, there are two separate dispatchers to extend (and don't forget to regenerate types first):

- `src/lib/datocms/recordInfo.ts` — CMA-side. `recordToWebsiteRoute` / `recordToSlug` switch on `item.__itemTypeId` using generated `.ID` constants. Used by the Web Previews and SEO Analysis plugin endpoints.
- `src/lib/datocms/gqlUrlBuilder/index.ts` — CDA/GraphQL-side. `buildUrlFromGql` switches on `__typename`; add a `./<model>.ts` exporting `<Model>UrlFragment` + `buildUrlFor<Model>()`. Used by generic link-rendering code.

### Plugin integration endpoints

API routes under `src/pages/api/` implement the webhooks for two DatoCMS plugins and are all guarded by `SECRET_API_TOKEN` (passed as a `?token=` query param):

- `preview-links/` — Web Previews plugin: returns draft/published preview URLs for a record.
- `seo-analysis/` — SEO/Readability plugin: fetches the rendered page (in draft mode via `draftModeHeaders()`), strips it with node-html-parser, returns title/description/content.
- `post-deploy/` — one-shot setup, called once after first deploy; installs and configures the Web Previews + SEO plugins and the private plugin. Safe to delete.

`src/pages/api/utils.ts` holds shared response helpers (`withCORS`, `json`, `successfulResponse`, `invalidRequestResponse`, `handleUnexpectedError`) and `isRelativeUrl` (used to block open-redirect attacks in the draft-mode enable endpoint).

### Private plugin

`src/pages/private-datocms-plugin/` is an Astro page that boots a React app (`datocms-plugin-sdk` + `datocms-react-ui`) inside the DatoCMS iframe. It is a bare HTML shell with no site layout/CSS — the plugin SDK's `<Canvas>` owns styling.

## Conventions

- Import aliases: `~/components/*`, `~/layouts/*`, `~/lib/*`, `~/pages/*` (see `tsconfig.json`).
- Prettier: single quotes, trailing commas, width 100. `schema.graphql` and `graphql-env.d.ts` are generated artifacts and are gitignored from formatting.
- The top/bottom of `README.md` between the `datocms-autoinclude-*` markers is auto-generated — don't hand-edit those sections.
