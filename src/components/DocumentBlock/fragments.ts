import { graphql } from '~/lib/datocms/graphql';

/**
 * Document block inside a Page's Structured Text: a downloadable PDF. The
 * caption (`description`) is the visible title; the raw file name is not shown.
 */
export const DocumentBlockFragment = graphql(/* GraphQL */ `
  fragment DocumentBlockFragment on DocumentBlockRecord {
    description
    pdfFile {
      url
    }
  }
`);
