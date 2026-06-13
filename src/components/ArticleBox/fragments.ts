import { graphql } from '~/lib/datocms/graphql';

/**
 * Data for the full article card (home, archive, premium list). `abstract` and
 * `body` are requested as HTML (`markdown: true`) so they can be rendered via
 * <RichText /> / used for the excerpt.
 */
export const ArticleBoxFragment = graphql(/* GraphQL */ `
  fragment ArticleBoxFragment on ArticleRecord {
    id
    title
    slug
    premium
    _firstPublishedAt
    abstract(markdown: true)
    body(markdown: true)
    categories {
      name
    }
  }
`);
