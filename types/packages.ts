export interface NpmPackage {
  name: string
  description: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  authors?: {
    name: string
    email: string
  }[]
}

export interface Package {
  name: string
  title: string
  external: boolean
  description: string
  dependencies: string[]
  devDependencies: string[]
}
