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
    '/api/packages.json': {
      cache: {
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/api/packages.json'],
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
