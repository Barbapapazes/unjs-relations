// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ui: {
    icons: ['simple-icons', 'ph'],
  },
  nitro: {
    prerender: {
      // Cannot prerender / because of an error with the useFetch composable
      routes: ['/api/packages.json'],
    },
    routeRules: {
      '/api/packages.json': {
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
  devtools: { enabled: true },
})
