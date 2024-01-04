import myzod from 'myzod'
import type { NpmPackage, Package } from '~/types/packages'

export async function fetchUnJSPackages() {
  const data = await $fetch('/api/packages.json')

  const validatedData = myzod.array(myzod.object({
    name: myzod.string(),
    title: myzod.string(),
    external: myzod.boolean(),
    description: myzod.string().or(myzod.undefined()),
    dependencies: myzod.array(myzod.string()),
    devDependencies: myzod.array(myzod.string()),
  })).parse(data)

  // TODO: we could infer Package from the validation schema
  return validatedData as Package[]
}

export async function fetchNpmPackage(name: string) {
  const data = await $fetch(`https://unnpm.pages.dev/packages/${name}`)

  const validatedData = myzod.object({
    package: myzod.object({
      name: myzod.string(),
      version: myzod.string(),
      description: myzod.string().or(myzod.undefined()),
      dependencies: myzod.record(myzod.string()),
      devDependencies: myzod.record(myzod.string()),
      maintainers: myzod.array(myzod.object({
        name: myzod.string(),
        email: myzod.string(),
      })),
    }),
  }).parse(data)

  return validatedData as { package: NpmPackage }
}

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
