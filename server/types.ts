export interface NpmPackage {
  name: string
  description: string
  version: string
  dependencies?: string[]
  devDependencies?: string[]
}
