import { graphql } from '~/lib/datocms/graphql';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { ArticleBoxFragment } from '~/components/ArticleBox';
import { ArticleViewFragment } from '~/components/ArticleView';

export const ARTICLES_PER_PAGE = 10;

export const archiveQuery = graphql(
  /* GraphQL */ `
    query ArchiveQuery($first: IntType!, $skip: IntType!) {
      allArticles(orderBy: pubDate_DESC, first: $first, skip: $skip) {
        ...ArticleBoxFragment
      }
      _allArticlesMeta {
        count
      }
      premiumArticlesPage {
        slug
      }
    }
  `,
  [ArticleBoxFragment],
);

export async function fetchArchivePage(page: number, includeDrafts: boolean) {
  const skip = (page - 1) * ARTICLES_PER_PAGE;
  const { allArticles, _allArticlesMeta, premiumArticlesPage } = await executeQuery(archiveQuery, {
    variables: { first: ARTICLES_PER_PAGE, skip },
    includeDrafts,
  });

  return {
    articles: allArticles,
    total: _allArticlesMeta.count,
    totalPages: Math.max(1, Math.ceil(_allArticlesMeta.count / ARTICLES_PER_PAGE)),
    premiumSlug: premiumArticlesPage?.slug ?? 'premium',
  };
}

export const articleQuery = graphql(
  /* GraphQL */ `
    query ArticleQuery($slug: String!) {
      article(filter: { slug: { eq: $slug } }) {
        ...ArticleViewFragment
      }
      premiumArticlesPage {
        slug
      }
    }
  `,
  [ArticleViewFragment],
);

export async function fetchArticle(slug: string, includeDrafts: boolean) {
  const { article, premiumArticlesPage } = await executeQuery(articleQuery, {
    variables: { slug },
    includeDrafts,
  });

  return {
    article,
    premiumSlug: premiumArticlesPage?.slug ?? 'premium',
  };
}
