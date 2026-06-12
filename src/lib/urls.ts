/**
 * URL helpers — single source of truth for the site's route shapes.
 * Mirrors the old Middleman `article_path` helper, preserving the exact URLs.
 */

export function articlePath(
  article: { slug: string; premium?: boolean | null },
  premiumSlug: string,
): string {
  return article.premium ? `/${premiumSlug}/articles/${article.slug}` : `/articles/${article.slug}`;
}

export function categoryPath(slug: string): string {
  return `/categories/${slug}`;
}

export function pagePath(slug: string): string {
  return `/info/${slug}`;
}
