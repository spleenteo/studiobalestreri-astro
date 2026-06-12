import { graphql } from '~/lib/datocms/graphql';

/** Video block inside a Page's Structured Text: an external (YouTube) video. */
export const VideoBlockFragment = graphql(/* GraphQL */ `
  fragment VideoBlockFragment on VideoBlockRecord {
    videoUrl {
      url
      provider
      providerUid
      title
      width
      height
    }
  }
`);
