import { graphql } from '~/lib/datocms/graphql';

/** Text block inside Structured Text: a rich-text (markdown) passage. */
export const TextBlockFragment = graphql(/* GraphQL */ `
  fragment TextBlockFragment on TextBlockRecord {
    text(markdown: true)
  }
`);
