export default defineAppConfig({
  ui: {
    primary: 'yellow',
    gray: 'cool',
    button: {
      base: 'transition ease-in',
      color: {
        white: {
          solid: 'shadow-none',
        },
      },
      variant: {
        solid: 'shadow-none text-gray-900',
      },
    },
    input: {
      variant: {
        outline: 'shadow-none',
      },
    },
    select: {
      color: {
        white: {
          outline: 'shadow-none',
        },
      },
    },
  },
})
