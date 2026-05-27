---
shaping: true
---

# Riproduzione frontend studiobalestreri — Shaping

Stato: **shape selezionata (A)**, decisioni di componente risolte via grilling. Pronto per
breadboard/slicing.

---

## Requirements (R)

| ID  | Requirement                                                                                                                                                                                                                                                                  | Status    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| R0  | Riprodurre il frontend studiobalestreri su Astro SSR, connesso allo schema reale in `astro-26`, visivamente fedele al vecchio sito Middleman come base                                                                                                                       | Core goal |
| R1  | Preservare la struttura URL esatta: `/`, `/articles` (+ paginazione), `/articles/{slug}`, `/categories/{slug}`, articoli premium con prefisso `/{premium}/articles/{slug}`, pagine `/cv` `/contacts` `/why` `/publications` `/customer_service`, feed RSS                    | Must-have |
| R2  | Riprodurre layout e chrome: header (logo + menu desktop), sidebar sinistra fissa (categorie + link utili, off-canvas con hamburger su mobile), footer (newsletter + privacy + credits), watermark logo                                                                       | Must-have |
| R3  | Riprodurre l'identità visiva come base ma ammodernata (palette nero/beige/verde, Playfair Display + Lora; libertà su spaziature, scala tipografica, a11y). CSS pulito, niente framework bemo                                                                                 | Must-have |
| R4  | Rendere i campi contenuto attuali come HTML ora (`markdown: true`), con componenti strutturati così che la futura migrazione a Structured Text sia uno swap localizzato                                                                                                      | Must-have |
| R5  | Articoli resi per intero: meta (categorie, data, label premium), titolo, featured image, body, blocchi (`text_block` HTML, `video_block` embed external-video), documenti scaricabili, condivisione con link semplici                                                        | Must-have |
| R6  | Articoli premium aperti a tutti ora (nessun gate), ma prefisso URL + etichetta preservati, modello `user` conservato, e cucitura server-side marcata per riattivare il gate in futuro (auth-astro/Supabase, mai Netlify Identity)                                            | Must-have |
| R7  | Integrazioni riportate: newsletter Mailchimp (footer), link privacy/cookie iubenda, feed RSS, condivisione social con link semplici (no AddThis), meta verifica Google                                                                                                       | Must-have |
| R8  | Pivot pulito: rimuovere lo scaffolding demo (modello `page`, blocchi image/gallery, record demo, rotta `/page`) e il campo `asset` errato sul `video_block` reale; tenere l'infra starter (executeQuery, `<Text>`, ResponsiveImage, draft mode, SEO, content-link, gql.tada) | Must-have |

---

## Mappa rotta → modello → template (vecchio → nuovo)

| URL                                              | Modello DatoCMS                                 | Contenuti chiave                                             | Template vecchio             |
| ------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| `/`                                              | `home` (singleton)                              | `claim`, + ultimi 15 articoli + "Vedi tutti"                 | `index.html.slim`            |
| `/articles`, `/articles/:n`                      | `allArticles` (paginato 10/pag, `pubDate` desc) | lista `article-box`                                          | `templates/articles`         |
| `/articles/{slug}`                               | `article` (non premium)                         | meta, titolo, featured, `body`, `blocks`, `documents`, share | `templates/article`          |
| `/{premium}/articles/{slug}`                     | `article` (premium)                             | come sopra, contenuto **aperto** + label Premium             | `templates/article`          |
| `/{premium}`                                     | `premium_articles_page`                         | `title`, `description`, lista articoli premium               | `templates/premium_articles` |
| `/categories/{slug}`                             | `article_category`                              | `name`, `description`, articoli della categoria              | `templates/category`         |
| `/cv` `/why` `/publications` `/customer_service` | singleton omonimi                               | `title`, `body` (HTML)                                       | `templates/page`             |
| `/contacts`                                      | `contacts`                                      | `title`, `body`, `map` (LatLon, opzionale)                   | `templates/page`             |
| `/articles/feed.rss`                             | `allArticles`                                   | feed                                                         | `articles/feed.rss.builder`  |

`article_path`: premium → `/{premium_articles_page.slug}/articles/{slug}`, altrimenti
`/articles/{slug}`. Sidebar categorie include "Tutti" → `/articles`, le categorie, e
"Premium" → `/{premium}`.

---

## CURRENT — starter demo

Il repo `sb-astro` oggi rende un modello demo `page` su `/page/{slug}` (record `home`/`about`
creati per far girare lo starter). Non riproduce il sito reale; lo scaffolding demo (incluso
il campo `asset` aggiunto per errore al `video_block` reale) va rimosso (R8).

---

## A: Frontend reale sull'infra SSR dello starter, una rotta per modello

Riuso l'infrastruttura starter (fetch tipizzato, draft mode, SEO, content-link, immagini) e
costruisco le rotte/i componenti del sito reale contro i modelli esistenti. Ogni parte è una
slice verticale che termina in UI dimostrabile.

| Part    | Mechanism                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Flag |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--: |
| **A1**  | **Cleanup & fix schema** ✅ FATTO — via migrazione CLI in `astro-26`: rimossi modello `page` (+ record home/about), `image_block`, `image_gallery_block`, e il campo `asset` dal `video_block` reale. Rimossi dal codice `src/pages/page/[slug].astro`, i componenti blocco/inline/link demo, `gqlUrlBuilder`, e `VideoPlayer` (Mux-specifico, ora senza tipo `VideoFileField` nello schema; l'embed external-video va in A8). `recordInfo` azzerato (ricablato in A5/A8). Rigenerati schema + tipi. |      |
| **A2**  | **Layout & stili globali** ✅ FATTO — `Layout.astro` riscritto: `Header` (logo + menu desktop), `Sidebar` (categorie + `link` da DatoCMS, off-canvas su mobile), `Footer` (newsletter/privacy/credits), watermark logo. `src/styles/global.css` da zero (token palette, font Google Playfair+Lora+Open Sans, scala fluida, a11y). Ammodernato: layout a griglia (sidebar 240px sticky + colonna 770px) ≥1024px invece dell'overlap; alias `~/styles/*` aggiunto al tsconfig.                         |      |
| **A3**  | **Rendering contenuti condiviso** ✅ FATTO — `<RichText>` stampa i campi `markdown:true` via `set:html` con `.formatted-content`; unico punto di futuro swap a StructuredText. Helper `lib/urls.ts` + `lib/text.ts` (excerpt).                                                                                                                                                                                                                                                                       |      |
| **A4**  | **Home `/`** ✅ FATTO — `home.claim` + ultimi 15 `article` resi come `ArticleBox` + "Vedi tutti". Verificata HTTP 200 con contenuti reali; immagine featured resa condizionalmente (gli ultimi 15 non ne hanno).                                                                                                                                                                                                                                                                                     |      |
| **A5**  | **Pagine statiche** — rotte fisse `/cv` `/why` `/publications` `/customer_service` `/contacts`, ognuna interroga il proprio singleton e rende `title` + `body` (+ `map` opzionale per contacts).                                                                                                                                                                                                                                                                                                     |      |
| **A6**  | **Lista articoli + paginazione** — `/articles` e `/articles/[page]`: query con `first`/`skip` (10/pag), pager numerato (Precedente/Prossima), incipit archivio.                                                                                                                                                                                                                                                                                                                                      |      |
| **A7**  | **Categorie `/categories/{slug}`** — `article_category` + articoli filtrati per categoria, resi come `article-preview` (`hl`).                                                                                                                                                                                                                                                                                                                                                                       |      |
| **A8**  | **Dettaglio articolo** — `/articles/[slug]` e `/{premium}/articles/[slug]`: meta, titolo, featured image, `body` (RichText), `blocks` (`text_block`→RichText, `video_block`→embed external video da `videoUrl`), `documents` (download), share link. **Cucitura premium**: blocco commentato `// PREMIUM GATE` dove in futuro un check sessione deciderà se rendere il body o abstract+CTA. Per ora rende sempre tutto.                                                                              |      |
| **A9**  | **Lista premium `/{premium}`** — `premium_articles_page` (title/description) + articoli premium resi come `article-box`.                                                                                                                                                                                                                                                                                                                                                                             |      |
| **A10** | **Feed, SEO & integrazioni** — feed RSS `/articles/feed.rss` (`@astrojs/rss`), SEO meta da DatoCMS (`_seoMetaTags`, già nello starter), footer Mailchimp + iubenda, share link, meta verifica Google, sitemap.                                                                                                                                                                                                                                                                                       |      |

### Stato implementazione

**Tutte le parti A1–A10 ✅ FATTE e verificate** (astro check 0 errori, build OK, smoke test rotte 200/301/404, contenuti reali da `astro-26`).

- A1 cleanup+fix schema · A2 chrome+`global.css` · A3 `<RichText>`+helper · A4 home
- A5 pagine `/cv` `/why` `/publications` `/customer_service` `/contacts` (con mappa)
- A6 archivio `/articles` + `/articles/N` (pager con finestra) · A7 `/categories/{slug}`
- A8 dettaglio `/articles/{slug}` e `/{premium}/articles/{slug}` (redirect 301 canonici premium↔non-premium; cucitura `PREMIUM GATE` in `ArticleView`)
- A9 lista premium `/{premium}` · A10 feed `/articles/feed.rss`, `/sitemap.xml` (468 URL, paginato per il limite CDA di 100), `recordInfo` ricablato sui modelli reali per i plugin

Scelte default prese in autonomia (utente assente): Mailchimp/iubenda = valori del vecchio sito (**da riconfermare**); `/contacts` con mappa Google embed (no API key) dal campo `map`. Real-time `QueryListener` attivo su home + pagine statiche; non su archivio/dettaglio (query incapsulate nei lib) — draft mode funziona comunque.

### Decisioni di componente (risolte nel grilling)

| Componente        | Opzioni                                              | Scelta                                                   |
| ----------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| Stili (A2)        | porting bemo / **riscrittura pulita** / redesign     | **Riscrittura pulita**, look come base + ammodernamento  |
| URL (A4–A9)       | **preserva esatti** / nuovi+redirect                 | **Preserva esatti**                                      |
| Premium (A8/A9)   | **apri+cucitura** / gate ora / nascondi              | **Apri tutto + cucitura server-side**; `user` conservato |
| Contenuti (A3)    | **HTML `markdown:true` ora** / StructuredText subito | **HTML ora**, swap localizzato dopo                      |
| Condivisione (A8) | AddThis / **link semplici** / niente                 | **Link semplici** (LinkedIn, X, email)                   |
| Hosting           | Vercel / Netlify / **dopo**                          | **Deciso dopo**; dev con adapter node                    |

---

## Fit Check — R × A

| Req | Requirement                                                                       | Status    | A   |
| --- | --------------------------------------------------------------------------------- | --------- | --- |
| R0  | Riprodurre il frontend su Astro SSR connesso allo schema reale, fedele come base  | Core goal | ✅  |
| R1  | Preservare la struttura URL esatta                                                | Must-have | ✅  |
| R2  | Riprodurre layout e chrome (header/sidebar/footer/watermark)                      | Must-have | ✅  |
| R3  | Identità visiva come base + ammodernata, CSS pulito senza bemo                    | Must-have | ✅  |
| R4  | Rendere i campi come HTML ora, swap a Structured Text localizzato dopo            | Must-have | ✅  |
| R5  | Articoli resi per intero (meta, featured, body, blocchi, documenti, share)        | Must-have | ✅  |
| R6  | Premium aperto ora, URL/label preservati, `user` conservato, cucitura server-side | Must-have | ✅  |
| R7  | Integrazioni riportate (Mailchimp, iubenda, RSS, share semplice, verifica Google) | Must-have | ✅  |
| R8  | Pivot pulito: rimuovere demo + fix `video_block`, tenere infra starter            | Must-have | ✅  |

**Notes:**

- A copre tutte le R: A1→R8, A2→R2/R3, A3→R4, A4–A9→R0/R1/R5/R6, A10→R7.
- Nessun ⚠️: i meccanismi (paginazione SSR via `first`/`skip`, embed `VideoField`, feed con
  `@astrojs/rss`, `markdown:true`→HTML) sono noti dall'infra esistente o standard Astro.

---

## Aperti / da confermare in implementazione

- Lista/conferma Mailchimp (id lista del vecchio footer) ancora valida.
- Account iubenda (policy id) ancora corretto.
- `contacts.map` (LatLon): renderizzare una mappa o solo `body`? (vecchio sito: solo body).
- Quanto spingere l'ammodernamento visivo (lo proporrò su una prima preview di A2).

---

## Prossimo passo

Slicing: A1–A10 sono già slice verticali. Ordine proposto di build (Fase 1 → 2):
**A1 → A2 → A3 → A5 → A4 → A6 → A7 → A8 → A9 → A10**
(prima cleanup + chrome + rendering condiviso, poi una pagina statica come prima UI reale,
poi home, liste, categorie, dettaglio, premium, feed/integrazioni).
