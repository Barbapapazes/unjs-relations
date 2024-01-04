export function getRoutePackages(queryName: 'packages[]' | 'npm-packages[]') {
  const route = useRoute()

  const query = route.query[queryName]

  const packages = ref<string[] | null>(parseQuery(query))

  watch(() => route.query, () => {
    packages.value = parseQuery(route.query[queryName])
  })

  /**
   * If there is no query, we set packages to null (initial state)
   * If the query is an empty string, we set packages to an empty array (handle by vue-router)
   * If the query is the string 'null', we set packages to an empty array (handle in-app)
   * Otherwise, we set packages using the query
   */
  function parseQuery(query: unknown | unknown[] | null) {
    if (!query)
      return null

    if (query === '')
      return [] as string[]

    if (query === 'null')
      return [] as string[]

    return toArray<string>(query)
  }

  return packages
}
