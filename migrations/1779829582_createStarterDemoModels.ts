import { Client } from 'datocms/lib/cma-client-node';

/**
 * Creates the demo schema expected by the (unmodified) DatoCMS Astro Starter
 * Kit code in this repo:
 *
 *   - blocks:  image_block, image_gallery_block, video_block
 *   - model:   page (title, slug, structured_text)
 *   - records: a "home" page (the index route redirects to /page/home) and an
 *              "about" page it links to, so links/inline records render.
 *
 * Idempotent: every step checks for an existing item type / field / record by
 * api_key or slug before creating, so it is safe to re-run after a partial
 * failure.
 */
export default async function (client: Client): Promise<void> {
  const existingTypes = await client.itemTypes.list();
  const byApiKey = new Map(existingTypes.map((it) => [it.api_key, it]));

  async function ensureItemType(apiKey: string, attrs: { name: string; modular_block?: boolean }) {
    const found = byApiKey.get(apiKey);
    if (found) return found;
    const created = await client.itemTypes.create({ api_key: apiKey, ...attrs });
    byApiKey.set(apiKey, created);
    return created;
  }

  async function ensureField(
    itemTypeId: string,
    apiKey: string,
    attrs: Parameters<typeof client.fields.create>[1],
  ) {
    const fields = await client.fields.list(itemTypeId);
    const found = fields.find((f) => f.api_key === apiKey);
    if (found) return found;
    return client.fields.create(itemTypeId, { api_key: apiKey, ...attrs });
  }

  // --- Blocks ---------------------------------------------------------------

  const imageBlock = await ensureItemType('image_block', {
    name: 'Image Block',
    modular_block: true,
  });
  await ensureField(imageBlock.id, 'asset', {
    label: 'Asset',
    field_type: 'file',
    validators: { required: {}, extension: { extensions: [], predefined_list: 'image' } },
    appearance: { addons: [], editor: 'file', parameters: {} },
  });

  const imageGalleryBlock = await ensureItemType('image_gallery_block', {
    name: 'Image Gallery Block',
    modular_block: true,
  });
  await ensureField(imageGalleryBlock.id, 'assets', {
    label: 'Assets',
    field_type: 'gallery',
    validators: { size: { min: 1 }, extension: { extensions: [], predefined_list: 'image' } },
    appearance: { addons: [], editor: 'gallery', parameters: {} },
  });

  const videoBlock = await ensureItemType('video_block', {
    name: 'Video Block',
    modular_block: true,
  });
  await ensureField(videoBlock.id, 'asset', {
    label: 'Asset',
    field_type: 'file',
    validators: { required: {}, extension: { extensions: [], predefined_list: 'video' } },
    appearance: { addons: [], editor: 'file', parameters: {} },
  });

  // --- Page model -----------------------------------------------------------

  const page = await ensureItemType('page', { name: 'Page' });

  const titleField = await ensureField(page.id, 'title', {
    label: 'Title',
    field_type: 'string',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: true, placeholder: null },
    },
  });

  await ensureField(page.id, 'slug', {
    label: 'Slug',
    field_type: 'slug',
    validators: {
      required: {},
      unique: {},
      slug_format: { predefined_pattern: 'webpage_slug' },
      slug_title_field: { title_field_id: titleField.id },
    },
    appearance: { addons: [], editor: 'slug', parameters: { url_prefix: null, placeholder: null } },
  });

  await ensureField(page.id, 'structured_text', {
    label: 'Body',
    field_type: 'structured_text',
    validators: {
      structured_text_blocks: {
        item_types: [imageBlock.id, imageGalleryBlock.id, videoBlock.id],
      },
      structured_text_links: { item_types: [page.id] },
    },
    appearance: {
      addons: [],
      editor: 'structured_text',
      parameters: {
        marks: ['strong', 'code', 'emphasis', 'underline', 'strikethrough', 'highlight'],
        nodes: ['blockquote', 'code', 'heading', 'link', 'list', 'thematicBreak'],
        heading_levels: [2, 3, 4, 5, 6],
        blocks_start_collapsed: false,
        show_links_meta_editor: false,
        show_links_target_blank: false,
      },
    },
  });

  // --- Sample records -------------------------------------------------------

  async function ensurePage(slug: string, build: () => Record<string, unknown>) {
    const existing = await client.items.list({
      filter: { type: 'page', fields: { slug: { eq: slug } } },
    });
    const record =
      existing[0] ??
      (await client.items.create({
        item_type: { type: 'item_type', id: page.id },
        ...build(),
      }));
    try {
      await client.items.publish(record.id);
    } catch {
      // Already published / nothing to publish — ignore.
    }
    return record;
  }

  const about = await ensurePage('about', () => ({
    title: 'About',
    slug: 'about',
    structured_text: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'span',
                value: 'This is the about page, rendered from DatoCMS Structured Text.',
              },
            ],
          },
        ],
      },
    },
  }));

  await ensurePage('home', () => ({
    title: 'Home',
    slug: 'home',
    structured_text: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          { type: 'heading', level: 2, children: [{ type: 'span', value: 'Welcome' }] },
          {
            type: 'paragraph',
            children: [
              { type: 'span', value: 'This homepage comes from DatoCMS. Visit the ' },
              {
                type: 'itemLink',
                item: about.id,
                meta: [],
                children: [{ type: 'span', value: 'about page' }],
              },
              { type: 'span', value: '.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { type: 'span', value: 'Inline reference: ' },
              { type: 'inlineItem', item: about.id },
            ],
          },
        ],
      },
    },
  }));
}
