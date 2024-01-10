import type { UnJSPackage } from '../types'
import type { InternalPackage, PackageJson } from '~/types/packages'

export default defineEventHandler(async () => {
  const unjsProjects = await $fetch<UnJSPackage[]>('https://unjs.io/api/content/packages.json')

  const packages = unjsProjects.filter(project => project.npm).sort((a, b) => b.title.localeCompare(a.title))
  const packageNames = packages.map(pkg => pkg.npm?.name)

  const npmPackages = await Promise.all(packages.map(pkg => $fetch<{ package: PackageJson }>(`https://unnpm.pages.dev/packages/${pkg.npm?.name}`)))

  // TODO: add validation (inside the fetch function)

  return npmPackages.map(({ package: pkg }) => {
    return {
      name: pkg.name,
      title: packages.find(p => p.npm?.name === pkg.name)?.title ?? pkg.name,
      description: pkg.description,
      dependencies: Object.keys(pkg.dependencies || {}).filter(dep => packageNames.includes(dep)),
      devDependencies: Object.keys(pkg.devDependencies || {}).filter(dep => packageNames.includes(dep)),
      source: 'unjs',
    } satisfies InternalPackage
  })
})
