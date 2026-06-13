/*
 * Maps a DatoCMS record to its URL on this website (and its slug). Used by the
 * "Web Previews" and "SEO/Readability Analysis" plugin endpoints:
 *
 * - src/pages/api/preview-links/index.ts
 * - src/pages/api/seo-analysis/index.ts
 *
 * Switching on `item.__itemTypeId` against the generated `.ID` constants lets
 * TypeScript narrow `item.attributes` to the right model.
 */
import type { RawApiTypes } from '@datocms/cma-client';
import {
  type AnyModel,
  Article,
  ArticleCategory,
  Home,
  Page,
  PremiumArticlesPage,
} from './cma-types';
import { graphql } from './graphql';
import { executeQuery } from './executeQuery';

const premiumSlugQuery = graphql(/* GraphQL */ `
  query PremiumSlugQuery {
    premiumArticlesPage {
      slug
    }
  }
`);

let premiumSlugCache: string | null = null;

async function getPremiumSlug(): Promise<string> {
  if (premiumSlugCache) return premiumSlugCache;
  const { premiumArticlesPage } = await executeQuery(premiumSlugQuery);
  premiumSlugCache = premiumArticlesPage?.slug ?? 'premium';
  return premiumSlugCache;
}

export async function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case Article.ID: {
      const slug = await recordToSlug(item, locale);
      if (!slug) return null;
      if (item.attributes.premium) {
        return `/${await getPremiumSlug()}/articles/${slug}`;
      }
      return `/articles/${slug}`;
    }
    case ArticleCategory.ID: {
      const slug = await recordToSlug(item, locale);
      return slug ? `/categories/${slug}` : null;
    }
    case PremiumArticlesPage.ID:
      return item.attributes.slug ? `/${item.attributes.slug}` : null;
    case Page.ID: {
      const slug = await recordToSlug(item, locale);
      return slug ? `/info/${slug}` : null;
    }
    case Home.ID:
      return '/';
    default:
      return null;
  }
}

export async function recordToSlug(
  item: RawApiTypes.Item<AnyModel>,
  _locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case Article.ID:
      return item.attributes.slug;
    case ArticleCategory.ID:
      return item.attributes.slug;
    case PremiumArticlesPage.ID:
      return item.attributes.slug;
    case Page.ID:
      return item.attributes.slug;
    default:
      return null;
  }
}
