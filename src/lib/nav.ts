import { pagePath } from '~/lib/urls';

/** A single main-navigation entry, shared by Header (desktop) and Sidebar (mobile). */
export type MenuItem = { label: string; href: string };

/**
 * The main menu is driven by the DatoCMS `page` records: their titles become
 * the navigation entries, in `position` order, each linking to `/info/{slug}`.
 * "Home" is kept as the first entry (the logo also links there).
 */
export function buildMainMenu(pages: ReadonlyArray<{ title: string; slug: string }>): MenuItem[] {
  return [
    { label: 'Home', href: '/' },
    ...pages.map((page) => ({ label: page.title, href: pagePath(page.slug) })),
  ];
}
