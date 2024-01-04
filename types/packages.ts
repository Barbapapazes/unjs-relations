export interface Package {
  name: string
  title: string
  external: boolean
  description: string
  dependencies: string[]
  devDependencies: string[]
}

export interface NpmPackage {
  name: string
  description: string
  version: string
  dependencies?: string[]
  devDependencies?: string[]
  maintainers: {
    name: string
    email: string
  }[]
}
