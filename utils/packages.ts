import type { NpmPackage, Package } from '../types/packages'

export function toPackage(npmPackage: NpmPackage, unjsPackages: Package[]): Package {
  const unjsPackagesName = unjsPackages.map(pkg => pkg.name)

  return {
    name: npmPackage.name,
    title: npmPackage.name,
    external: !unjsPackagesName.includes(npmPackage.name),
    description: npmPackage.description,
    dependencies: Object.keys(npmPackage.dependencies || {}).filter(dep => unjsPackagesName.includes(dep)),
    devDependencies: Object.keys(npmPackage.devDependencies || {}).filter(dep => unjsPackagesName.includes(dep)),
  }
}
