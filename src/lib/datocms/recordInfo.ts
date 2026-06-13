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
import { type AnyModel, Article, ArticleCategory, Home, Page } from './cma-types';

export async function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case Article.ID: {
      const slug = await recordToSlug(item, locale);
      return slug ? `/articles/${slug}` : null;
    }
    case ArticleCategory.ID: {
      const slug = await recordToSlug(item, locale);
      return slug ? `/categories/${slug}` : null;
    }
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
    case Page.ID:
      return item.attributes.slug;
    default:
      return null;
  }
}
