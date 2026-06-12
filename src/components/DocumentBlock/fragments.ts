import { graphql } from '~/lib/datocms/graphql';

/**
 * Document block inside a Page's Structured Text: a downloadable PDF with an
 * optional human-readable description.
 */
export const DocumentBlockFragment = graphql(/* GraphQL */ `
  fragment DocumentBlockFragment on DocumentBlockRecord {
    description
    pdfFile {
      url
      title
      filename
    }
  }
`);
