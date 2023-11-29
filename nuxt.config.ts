export default defineNuxtConfig({
  app: {
    head: {
      title: 'UnJS Relations',
      meta: [{
        name: 'description',
        content: 'Visualize relations between UnJS packages',
      }],
      link: [{
        rel: 'icon',
        href: '/favicon.svg',
      }],
    },
  },
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
