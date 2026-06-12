import { graphql } from '~/lib/datocms/graphql';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { VideoBlockFragment } from '~/components/VideoBlock';
import { DocumentBlockFragment } from '~/components/DocumentBlock';
import { ImageBlockFragment } from '~/components/ImageBlock';
import { ArticleLinkFragment } from '~/components/LinkToArticle';
import { PageLinkFragment } from '~/components/LinkToPage';

/**
 * A single Page (the `/info/{slug}` route). The Structured Text `body` carries
 * inline links to Article/Page records and embedded Video/Document/Image
 * blocks; each `blocks`/`links` entry includes `__typename` + `id` so
 * `<StructuredText />` can match it to the right component.
 */
export const pageQuery = graphql(
  /* GraphQL */ `
    query PageQuery($slug: String!) {
      page(filter: { slug: { eq: $slug } }) {
        id
        title
        _seoMetaTags {
          ...TagFragment
        }
        body {
          value
          blocks {
            __typename
            ... on RecordInterface {
              id
            }
            ...VideoBlockFragment
            ...DocumentBlockFragment
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
    }
  `,
  [
    TagFragment,
    VideoBlockFragment,
    DocumentBlockFragment,
    ImageBlockFragment,
    ArticleLinkFragment,
    PageLinkFragment,
  ],
);

export async function fetchPage(slug: string, includeDrafts: boolean) {
  const { page } = await executeQuery(pageQuery, {
    variables: { slug },
    includeDrafts,
  });

  return { page };
}
