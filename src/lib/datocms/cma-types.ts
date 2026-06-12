import type { ItemTypeDefinition } from '@datocms/cma-client';

type EnvironmentSettings = {
  locales: 'it';
};

export type Article = ItemTypeDefinition<
  EnvironmentSettings,
  '626',
  {
    categories: {
      type: 'links';
    };
    slug: {
      type: 'slug';
    };
    title: {
      type: 'string';
    };
    abstract: {
      type: 'text';
    };
    pub_date: {
      type: 'date';
    };
    seo: {
      type: 'seo';
    };
    body: {
      type: 'text';
    };
    premium: {
      type: 'boolean';
    };
    blocks: {
      type: 'rich_text';
      blocks: TextBlock | VideoBlock;
    };
    documents: {
      type: 'links';
    };
    featured_image: {
      type: 'file';
    };
  }
>;
export const Article = {
  ID: '626',
  REF: { type: 'item_type', id: '626' },
} as const;

export type Home = ItemTypeDefinition<
  EnvironmentSettings,
  '627',
  {
    title: {
      type: 'string';
    };
    claim: {
      type: 'text';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const Home = {
  ID: '627',
  REF: { type: 'item_type', id: '627' },
} as const;

export type ArticleCategory = ItemTypeDefinition<
  EnvironmentSettings,
  '628',
  {
    name: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    label: {
      type: 'string';
    };
    seo: {
      type: 'seo';
    };
    description: {
      type: 'text';
    };
  }
>;
export const ArticleCategory = {
  ID: '628',
  REF: { type: 'item_type', id: '628' },
} as const;

export type CustomerService = ItemTypeDefinition<
  EnvironmentSettings,
  '629',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const CustomerService = {
  ID: '629',
  REF: { type: 'item_type', id: '629' },
} as const;

export type Publications = ItemTypeDefinition<
  EnvironmentSettings,
  '630',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const Publications = {
  ID: '630',
  REF: { type: 'item_type', id: '630' },
} as const;

export type Why = ItemTypeDefinition<
  EnvironmentSettings,
  '631',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const Why = {
  ID: '631',
  REF: { type: 'item_type', id: '631' },
} as const;

export type Cv = ItemTypeDefinition<
  EnvironmentSettings,
  '632',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const Cv = {
  ID: '632',
  REF: { type: 'item_type', id: '632' },
} as const;

export type Contacts = ItemTypeDefinition<
  EnvironmentSettings,
  '633',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'text';
    };
    map: {
      type: 'lat_lon';
    };
    seo: {
      type: 'seo';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export const Contacts = {
  ID: '633',
  REF: { type: 'item_type', id: '633' },
} as const;

export type Link = ItemTypeDefinition<
  EnvironmentSettings,
  '26573',
  {
    name: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Link = {
  ID: '26573',
  REF: { type: 'item_type', id: '26573' },
} as const;

export type Document = ItemTypeDefinition<
  EnvironmentSettings,
  '26588',
  {
    title: {
      type: 'string';
    };
    doc: {
      type: 'file';
    };
  }
>;
export const Document = {
  ID: '26588',
  REF: { type: 'item_type', id: '26588' },
} as const;

export type PremiumArticlesPage = ItemTypeDefinition<
  EnvironmentSettings,
  '53322',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'text';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export const PremiumArticlesPage = {
  ID: '53322',
  REF: { type: 'item_type', id: '53322' },
} as const;

export type TextBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '53505',
  {
    text: {
      type: 'text';
    };
  }
>;
export const TextBlock = {
  ID: '53505',
  REF: { type: 'item_type', id: '53505' },
} as const;

export type VideoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  '53506',
  {
    video_url: {
      type: 'video';
    };
  }
>;
export const VideoBlock = {
  ID: '53506',
  REF: { type: 'item_type', id: '53506' },
} as const;

export type User = ItemTypeDefinition<
  EnvironmentSettings,
  '54002',
  {
    full_name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    organization: {
      type: 'string';
    };
    premium_user: {
      type: 'boolean';
    };
    newsletter: {
      type: 'boolean';
    };
    button: {
      type: 'json';
    };
  }
>;
export const User = {
  ID: '54002',
  REF: { type: 'item_type', id: '54002' },
} as const;

export type SchemaMigration = ItemTypeDefinition<
  EnvironmentSettings,
  'FT4_HUNPR62V7tZMdxulUA',
  {
    name: {
      type: 'string';
    };
  }
>;
export const SchemaMigration = {
  ID: 'FT4_HUNPR62V7tZMdxulUA',
  REF: { type: 'item_type', id: 'FT4_HUNPR62V7tZMdxulUA' },
} as const;

export type DocumentBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'LPrYNDqfTIOrLWW7EvTqiA',
  {
    pdf_file: {
      type: 'file';
    };
    description: {
      type: 'string';
    };
  }
>;
export const DocumentBlock = {
  ID: 'LPrYNDqfTIOrLWW7EvTqiA',
  REF: { type: 'item_type', id: 'LPrYNDqfTIOrLWW7EvTqiA' },
} as const;

export type ImageBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'V4cRheN2Qb-50jtMu767Ng',
  {
    image: {
      type: 'file';
    };
  }
>;
export const ImageBlock = {
  ID: 'V4cRheN2Qb-50jtMu767Ng',
  REF: { type: 'item_type', id: 'V4cRheN2Qb-50jtMu767Ng' },
} as const;

export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  'fWdSlPs-SL6NV-FB6p28iA',
  {
    title: {
      type: 'string';
    };
    body: {
      type: 'structured_text';
      blocks: VideoBlock | DocumentBlock | ImageBlock;
    };
    slug: {
      type: 'slug';
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Page = {
  ID: 'fWdSlPs-SL6NV-FB6p28iA',
  REF: { type: 'item_type', id: 'fWdSlPs-SL6NV-FB6p28iA' },
} as const;

export type AnyBlock = TextBlock | VideoBlock | DocumentBlock | ImageBlock;
export type AnyModel =
  | Article
  | Home
  | ArticleCategory
  | CustomerService
  | Publications
  | Why
  | Cv
  | Contacts
  | Link
  | Document
  | PremiumArticlesPage
  | User
  | SchemaMigration
  | Page;
export type AnyBlockOrModel = AnyBlock | AnyModel;
