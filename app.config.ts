export default defineAppConfig({
  ui: {
    primary: 'yellow',
    gray: 'cool',
    button: {
      base: 'transition ease-in',
      color: {
        gray: {
          solid: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50',
        },
      },
    },
    input: {
      base: 'transition ease-in',
      color: {
        gray: {
          outline: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50',
        },
      },
      variant: {
        outline: 'shadow-none',
      },
    },
    select: {
      base: 'transition ease-in',
      color: {
        gray: { outline: 'shadow-none bg-gray-300/20 hover:bg-gray-300/40 dark:bg-gray-700/40 dark:hover:bg-gray-700/50' },
      },
    },
    card: {
      base: 'transition ease-in duration-150',
    },
  },
})
