export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/google-fonts', '@nuxtjs/fontaine', '@pinia/nuxt'],

  ui: {
    icons: ['simple-icons', 'heroicons'],
  },

  routeRules: {
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
