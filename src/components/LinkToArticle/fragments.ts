import { graphql } from '~/lib/datocms/graphql';

/** Inline Structured Text link pointing to an Article record. */
export const ArticleLinkFragment = graphql(/* GraphQL */ `
  fragment ArticleLinkFragment on ArticleRecord {
    title
    slug
  }
`);
