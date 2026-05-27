import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/fragments';

/** Compact article highlight (date + title + round thumbnail) — used on category pages. */
export const ArticlePreviewFragment = graphql(
  /* GraphQL */ `
    fragment ArticlePreviewFragment on ArticleRecord {
      id
      title
      slug
      premium
      pubDate
      featuredImage {
        responsiveImage(imgixParams: { w: 100, h: 100, fit: crop }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
