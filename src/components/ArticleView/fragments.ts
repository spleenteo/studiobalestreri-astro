import { graphql } from '~/lib/datocms/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/fragments';

/**
 * Full article detail. `body` and block `text` are HTML (`markdown: true`);
 * `videoUrl` is the external-video field. Includes `_seoMetaTags` so the route
 * can forward them to the Layout.
 */
export const ArticleViewFragment = graphql(
  /* GraphQL */ `
    fragment ArticleViewFragment on ArticleRecord {
      id
      title
      slug
      premium
      _firstPublishedAt
      _seoMetaTags {
        ...TagFragment
      }
      abstract(markdown: true)
      body(markdown: true)
      categories {
        name
        slug
      }
      featuredImage {
        responsiveImage(
          imgixParams: { w: 1200, fit: max }
          sizes: "(max-width: 770px) 100vw, 770px"
        ) {
          ...ResponsiveImageFragment
        }
      }
      documents {
        id
        title
        doc {
          url
        }
      }
      blocks {
        __typename
        ... on TextBlockRecord {
          id
          text(markdown: true)
        }
        ... on VideoBlockRecord {
          id
          videoUrl {
            url
            provider
            providerUid
            title
            width
            height
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment],
);
