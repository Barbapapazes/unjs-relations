// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  nitro: {
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
  devtools: { enabled: true },
})
