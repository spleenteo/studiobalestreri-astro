import { graphql } from '~/lib/datocms/graphql';

/** Inline Structured Text link pointing to another Page record. */
export const PageLinkFragment = graphql(/* GraphQL */ `
  fragment PageLinkFragment on PageRecord {
    title
    slug
  }
`);
