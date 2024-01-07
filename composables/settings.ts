export function getSettings() {
  const route = useRoute()

  const defaultSettings = {
    showDependencies: true,
    showDevDependencies: false,
    showChildren: false,
  }

  const showDependencies = computed(() => {
    if (route.query.showDependencies === undefined)
      return defaultSettings.showDependencies

    return route.query.showDependencies === 'true'
  })

  const showDevDependencies = computed(() => {
    if (route.query.showDevDependencies === undefined)
      return defaultSettings.showDevDependencies

    return route.query.showDevDependencies === 'true'
  })

  const showChildren = computed(() => {
    if (route.query.showChildren === undefined)
      return defaultSettings.showChildren

    return route.query.showChildren === 'true'
  })

  return {
    showDependencies,
    showDevDependencies,
    showChildren,
  }
}
