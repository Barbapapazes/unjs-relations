export interface UnjsPackage {
  title: string
  description: string
  path: string
  url: string
  npm?: {
    name: string
  }
}

export interface NpmPackage {
  name: string
  description: string
  version: string
  dependencies?: string[]
  devDependencies?: string[]
}

// https://github.com/unjs/ungh/tree/main#reposownername
export interface GitHubRepo {
  'id': number
  'name': string
  'repo': string
  'description': string
  'createdAt': string
  'updatedAt': string
  'pushedAt': string
  'stars': number
  'watchers': number
  'forks': number
}

export interface GitHubFile {
  meta: {
    url: string
  }
  file: {
    contents: string
  }
}
