import { graphql } from '~/lib/datocms/graphql';

/**
 * Data for the full article card (home, archive, premium list). The card shows
 * `abstract` (HTML, `markdown: true`) when present, otherwise a plain-text
 * excerpt derived from the `content` Structured Text.
 */
export const ArticleBoxFragment = graphql(/* GraphQL */ `
  fragment ArticleBoxFragment on ArticleRecord {
    id
    title
    slug
    premium
    _firstPublishedAt
    abstract(markdown: true)
    content {
      value
    }
    categories {
      name
    }
  }
`);
