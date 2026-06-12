import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/fragments';

/** Image block inside a Page's Structured Text: a single responsive image. */
export const ImageBlockFragment = graphql(
  /* GraphQL */ `
    fragment ImageBlockFragment on ImageBlockRecord {
      image {
        responsiveImage(imgixParams: { auto: format, w: 900, fit: max }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
