import myzod from 'myzod'
import type { PackageJson } from '~/types/packages'

export async function fetchGitHubRepos(organization: string) {
  const data = await $fetch(`https://ungh.cc/orgs/${organization}/repos`)

  const validatedData = myzod.object({
    repos: myzod.array(myzod.object({
      id: myzod.number(),
      name: myzod.string(),
      repo: myzod.string(),
      description: myzod.string().or(myzod.null()),
      createdAt: myzod.string(),
      updatedAt: myzod.string(),
      pushedAt: myzod.string(),
      stars: myzod.number(),
      watchers: myzod.number(),
      forks: myzod.number(),
      defaultBranch: myzod.string(),
    })),
  }).parse(data)

  return validatedData
}

export async function fetchGitHubRepo(name: string) {
  const data = await $fetch(`https://ungh.cc/repos/${name}`)

  const validatedData = myzod.object({
    repo: myzod.object({
      id: myzod.number(),
      name: myzod.string(),
      repo: myzod.string(),
      description: myzod.string(),
      createdAt: myzod.string(),
      updatedAt: myzod.string(),
      pushedAt: myzod.string(),
      stars: myzod.number(),
      watchers: myzod.number(),
      forks: myzod.number(),
      defaultBranch: myzod.string(),
    }),
  }).parse(data)

  return validatedData
}

export async function fetchGitHubFiles(name: string, branch: string) {
  const data = await $fetch(`https://ungh.cc/repos/${name}/files/${branch}`)

  const validatedData = myzod.object({
    meta: myzod.object({
      sha: myzod.string(),
    }),
    files: myzod.array(myzod.object({
      path: myzod.string(),
      mode: myzod.string(),
      sha: myzod.string(),
      size: myzod.number(),
    })),
  }).parse(data)

  return validatedData
}

export async function fetchGitHubFile(name: string, branch: string, path: string) {
  const data = await $fetch(`https://ungh.cc/repos/${name}/files/${branch}/${path}`)

  const validatedData = myzod.object({
    meta: myzod.object({
      url: myzod.string(),
    }),
    file: myzod.object({
      contents: myzod.string(),
    }),
  }).parse(data)

  return validatedData
}

export async function fetchPackagesFromGitHubRepo(repo: string, defaultBranch: string) {
  const { files } = await fetchGitHubFiles(repo, defaultBranch)

  const unwantedPaths = [
    'playground',
    'examples',
  ]
  const packageJsonPaths = files.filter(file => file.path.includes('package.json') && !unwantedPaths.some(path => file.path.includes(path)))

  const packageJsonContents = await Promise.all(
    packageJsonPaths.map(async (path) => {
      const { file: { contents } } = await fetchGitHubFile(repo, defaultBranch, path.path)

      return JSON.parse(contents) as PackageJson
    }),
  ).then(contents => contents.filter(content => !content.private && content.name))

  return packageJsonContents
}
