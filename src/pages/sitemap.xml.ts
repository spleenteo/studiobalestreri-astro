import type { APIRoute } from 'astro';
import { graphql } from '~/lib/datocms/graphql';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { articlePath, categoryPath, pagePath } from '~/lib/urls';

const pageQuery = graphql(/* GraphQL */ `
  query SitemapArticlesQuery($skip: IntType!) {
    allArticles(orderBy: _firstPublishedAt_DESC, first: 100, skip: $skip) {
      slug
      premium
    }
  }
`);

const metaQuery = graphql(/* GraphQL */ `
  query SitemapMetaQuery {
    allArticleCategories {
      slug
    }
    allPages(orderBy: position_ASC) {
      slug
    }
  }
`);

export const GET: APIRoute = async (context) => {
  const { allArticleCategories, allPages } = await executeQuery(metaQuery);

  // DatoCMS caps `first` at 100, so page through all articles.
  const articles: Array<{ slug: string; premium: boolean | null }> = [];
  for (let skip = 0; ; skip += 100) {
    const { allArticles } = await executeQuery(pageQuery, { variables: { skip } });
    articles.push(...allArticles);
    if (allArticles.length < 100) break;
  }

  const origin = (context.site?.toString() ?? new URL(context.request.url).origin).replace(
    /\/$/,
    '',
  );

  const paths = [
    '/',
    '/articles',
    ...allPages.map((page) => pagePath(page.slug)),
    ...allArticleCategories.map((category) => categoryPath(category.slug)),
    ...articles.map((article) => articlePath(article)),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
