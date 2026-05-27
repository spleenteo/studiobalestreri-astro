import { Client } from 'datocms/lib/cma-client-node';

/**
 * Reverts the starter demo scaffolding created in
 * `1779829582_createStarterDemoModels.ts`, now that we're reproducing the real
 * studiobalestreri site against the existing models.
 *
 *   - deletes the demo `page` model (and its home/about records)
 *   - deletes the demo `image_block` and `image_gallery_block` blocks
 *   - removes the `asset` field that was erroneously added to the REAL
 *     `video_block` (it was required, which invalidated existing article video
 *     blocks); `video_block` itself and its `videoUrl` field are left intact.
 *
 * Idempotent: only acts on things that still exist.
 */
export default async function (client: Client): Promise<void> {
  const itemTypes = await client.itemTypes.list();
  const byApiKey = new Map(itemTypes.map((it) => [it.api_key, it]));

  // Delete the demo `page` model first (its structured_text validator references
  // the demo blocks), then the demo blocks.
  for (const apiKey of ['page', 'image_block', 'image_gallery_block']) {
    const itemType = byApiKey.get(apiKey);
    if (itemType) {
      await client.itemTypes.destroy(itemType.id);
    }
  }

  // Remove the erroneous `asset` field from the real `video_block`.
  const videoBlock = byApiKey.get('video_block');
  if (videoBlock) {
    const fields = await client.fields.list(videoBlock.id);
    const assetField = fields.find((f) => f.api_key === 'asset');
    if (assetField) {
      await client.fields.destroy(assetField.id);
    }
  }
}
