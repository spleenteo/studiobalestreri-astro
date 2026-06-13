import { graphql } from '~/lib/datocms/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { TextBlockFragment } from '~/components/TextBlock';
import { VideoBlockFragment } from '~/components/VideoBlock';
import { ImageBlockFragment } from '~/components/ImageBlock';
import { ArticleLinkFragment } from '~/components/LinkToArticle';
import { PageLinkFragment } from '~/components/LinkToPage';

/**
 * Full article detail. The body lives in the `content` Structured Text field
 * (embedded Text/Video/Image blocks + inline links to Article/Page records).
 * `abstract` is HTML (`markdown: true`); includes `_seoMetaTags` so the route
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
      categories {
        name
        slug
      }
      documents {
        id
        title
        doc {
          url
        }
      }
      content {
        value
        blocks {
          __typename
          ... on RecordInterface {
            id
          }
          ...TextBlockFragment
          ...VideoBlockFragment
          ...ImageBlockFragment
        }
        links {
          __typename
          ... on RecordInterface {
            id
          }
          ...ArticleLinkFragment
          ...PageLinkFragment
        }
      }
    }
  `,
  [
    TagFragment,
    TextBlockFragment,
    VideoBlockFragment,
    ImageBlockFragment,
    ArticleLinkFragment,
    PageLinkFragment,
  ],
);
