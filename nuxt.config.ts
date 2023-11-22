// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  ui: {
    icons: ['simple-icons', 'ph'],
  },
  nitro: {
    static: true,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/api/packages'],
    },
    routeRules: {
      '/api/packages': {
        cache: {
          maxAge: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        'vis-network',
        'vis-data',
      ],
    },
  },
  tailwindcss: {
    exposeConfig: true,
  },
  colorMode: {
    preference: 'light',
  },
  devtools: { enabled: false },
})
