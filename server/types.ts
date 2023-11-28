export interface NpmPackage {
  name: string
  description: string
  version: string
  dependencies?: string[]
  devDependencies?: string[]
}

export interface UnJSPackage {
  title: string
  npm?: {
    name: string
    description: string
  }
}
