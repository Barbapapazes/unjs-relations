export interface Package {
  name: string
  title: string
  external: boolean
  description: string
  dependencies: string[]
  devDependencies: string[]
}
