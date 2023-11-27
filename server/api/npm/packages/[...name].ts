import type { UnjsPackage } from '~/server/types'
import type { NpmPackage, Package } from '~/types/packages'

export default defineEventHandler(async (event): Promise<Package> => {
  setResponseHeader(event, 'Content-Type', 'application/json')

  const name = getRouterParam(event, 'name')

  const packages = await $fetch<UnjsPackage[]>('https://unjs.io/api/content/packages.json')
  const packageNames = packages.map(pkg => pkg.npm?.name)

  const { package: npmPackage } = await $fetch<{ package: NpmPackage }>(`https://unnpm.pages.dev/packages/${name}`)

  return {
    name: npmPackage.name,
    title: npmPackage.name,
    external: !packages.find(p => p.npm?.name === npmPackage.name),
    description: npmPackage.description,
    dependencies: Object.keys(npmPackage.dependencies || {}).filter(dep => packageNames.includes(dep)),
    devDependencies: Object.keys(npmPackage.devDependencies || {}).filter(dep => packageNames.includes(dep)),
  }
})
