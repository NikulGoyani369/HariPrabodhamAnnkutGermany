/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Serves the `api/` folder during `npm run dev`.
 *
 * On Vercel these run as edge functions; they are plain Web-standard
 * (Request) => Response handlers, so the dev server can call them directly and
 * the whole flow — form, database, confirmation email — works on one port
 * without the Vercel CLI. Dev only: `apply: 'serve'` keeps it out of builds.
 */
function apiDevServer(): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // Handlers read process.env; Vite only exposes VITE_* to the client, so
      // load the rest of .env (RESEND_API_KEY, RSVP_WEBHOOK_SECRET, …) here.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) return next()

        void (async () => {
          const route = url.split('?')[0].slice('/api/'.length)
          try {
            const mod = await server.ssrLoadModule(`/api/${route}.ts`)

            const headers = new Headers()
            for (const [key, value] of Object.entries(req.headers)) {
              if (typeof value === 'string') headers.set(key, value)
              else if (Array.isArray(value)) value.forEach((v) => headers.append(key, v))
            }

            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

            const response: Response = await mod.default(
              new Request(`http://localhost${url}`, {
                method: req.method,
                headers,
                body: hasBody && chunks.length ? Buffer.concat(chunks) : undefined,
              }),
            )

            res.statusCode = response.status
            response.headers.forEach((value, key) => res.setHeader(key, value))
            res.end(Buffer.from(await response.arrayBuffer()))
          } catch (error) {
            console.error(`[api] /${route} failed`, error)
            res.statusCode = 500
            res.end(`api dev error: ${String(error)}`)
          }
        })()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevServer()],
  server: {
    // Vite rejects unfamiliar Host headers, which would block an ngrok tunnel
    // before the request reached the api/ handlers. Dev server only.
    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.app',
      '.ngrok.io',
      '.trycloudflare.com',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui':      ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
})
