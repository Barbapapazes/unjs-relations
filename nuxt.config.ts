// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ui: {
    icons: ['simple-icons', 'ph'],
  },
  routeRules: {
    '/': {
      ssr: false,
    },
  },
  nitro: {
    prerender: {
      routes: ['/api/packages'],
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
