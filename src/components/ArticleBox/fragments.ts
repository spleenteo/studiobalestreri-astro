import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/fragments';

/**
 * Data for the full article card (home, archive, premium list). `abstract` and
 * `body` are requested as HTML (`markdown: true`) so they can be rendered via
 * <RichText /> today and swapped to Structured Text later.
 */
export const ArticleBoxFragment = graphql(
  /* GraphQL */ `
    fragment ArticleBoxFragment on ArticleRecord {
      id
      title
      slug
      premium
      pubDate
      abstract(markdown: true)
      body(markdown: true)
      categories {
        name
      }
      featuredImage {
        responsiveImage(
          imgixParams: { w: 1000, h: 500, fit: crop }
          sizes: "(max-width: 770px) 100vw, 770px"
        ) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
