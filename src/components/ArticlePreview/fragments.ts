import { graphql } from '~/lib/datocms/graphql';

/** Compact article highlight (date + title) — used on category pages. */
export const ArticlePreviewFragment = graphql(/* GraphQL */ `
  fragment ArticlePreviewFragment on ArticleRecord {
    id
    title
    slug
    premium
    _firstPublishedAt
  }
`);
