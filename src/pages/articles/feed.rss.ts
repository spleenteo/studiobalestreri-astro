import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { graphql } from '~/lib/datocms/graphql';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { articlePath } from '~/lib/urls';

const feedQuery = graphql(/* GraphQL */ `
  query FeedQuery {
    allArticles(orderBy: _firstPublishedAt_DESC, first: 50) {
      title
      slug
      _firstPublishedAt
      abstract
    }
  }
`);

export const GET: APIRoute = async (context) => {
  const { allArticles } = await executeQuery(feedQuery);
  const site = context.site?.toString() ?? new URL(context.request.url).origin;

  return rss({
    title: 'Studio Balestreri',
    description: 'Articoli e pubblicazioni dello Studio Balestreri',
    site,
    items: allArticles.map((article) => ({
      title: article.title,
      link: articlePath(article),
      pubDate: new Date(article._firstPublishedAt),
      description: article.abstract ?? undefined,
    })),
  });
};
