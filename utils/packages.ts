import type { InternalPackage, InternalPackageSource, PackageJson } from '../types/packages'

export function toInternalPackage(packageJson: PackageJson, source: InternalPackageSource, unjsPackages: InternalPackage[]): InternalPackage {
  const unjsPackageNames = unjsPackages.map(pkg => pkg.name)

  return {
    name: packageJson.name,
    title: packageJson.name,
    description: packageJson.description,
    dependencies: Object.keys(packageJson.dependencies || {}).filter(dep => unjsPackageNames.includes(dep)),
    devDependencies: Object.keys(packageJson.devDependencies || {}).filter(dep => unjsPackageNames.includes(dep)),
    source,
  }
}
