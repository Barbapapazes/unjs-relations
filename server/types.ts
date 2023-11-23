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
  // waiting for https://github.com/unjs/ungh/pull/70
  // defaultBranch: string
}

export interface GitHubFile {
  meta: {
    url: string
  }
  file: {
    contents: string
  }
}

export interface GitHubFiles {
  meta: {
    sha: string
  }
  files: {
    path: string
    mode: string
    sha: string
    size: number
  }[]
}
