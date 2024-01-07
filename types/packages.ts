export type InternalPackageSource = 'npm' | 'github' | 'unjs'

export interface InternalPackage {
  name: string
  title: string
  description?: string
  dependencies: string[]
  devDependencies: string[]
  source: InternalPackageSource
}

export interface PackageJson {
  name: string
  version: string
  description?: string
  private?: boolean
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  maintainers: {
    name: string
    email: string
  }[]
}
