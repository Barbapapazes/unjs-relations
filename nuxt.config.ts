export default defineNuxtConfig({
  app: {
    head: {
      title: 'UnJS Relations',
      meta: [{
        name: 'description',
        content: 'Visualize relations between UnJS packages and the ecosystem.',
      }],
      link: [{
        rel: 'icon',
        href: '/favicon.svg',
      }],
    },
  },

  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/google-fonts', '@nuxtjs/fontaine'],

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

  fontMetrics: {
    fonts: ['Nunito'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Nunito: [300, 400, 500, 600, 700, 800],
    },
  },

  colorMode: {
    preference: 'light',
  },

  devtools: { enabled: true },
})
