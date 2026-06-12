import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    checkOrigin: false,
  },
  env: {
    schema: {
      DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_DRAFT_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_CMA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_BASE_EDITING_URL: envField.string({
        context: 'server',
        access: 'public',
      }),
      DATOCMS_ENVIRONMENT: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      SECRET_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SIGNED_COOKIE_JWT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DRAFT_MODE_COOKIE_NAME: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
    validateSecrets: true,
  },
  integrations: [react()],
  vite: {
    /*
     * Disable Vite's built-in dev CORS so it stops short-circuiting the OPTIONS
     * preflight (it answers 204 without the PNA/origin headers). With it off, the
     * preflight reaches the middleware below. Dev-only — no effect on the build.
     */
    server: { cors: false },
    plugins: [
      /*
       * Dev-only: the Web Previews plugin (running on https://plugins-cdn.datocms.com)
       * fetches our local endpoints over the `loopback` address space. Chrome's
       * Private Network Access blocks that unless the CORS *preflight* echoes
       * `Access-Control-Allow-Private-Network: true` with a matching origin. In dev
       * the OPTIONS preflight is answered by Vite before our Astro route runs, so we
       * intercept it here. Not used in the production build (apply: 'serve').
       */
      {
        name: 'datocms-local-preview-preflight',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.method === 'OPTIONS' && req.url?.startsWith('/api/')) {
              res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
              res.setHeader('Vary', 'Origin');
              res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
              res.setHeader('Access-Control-Allow-Private-Network', 'true');
              res.statusCode = 204;
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
  },
});
