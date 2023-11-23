import type { GitHubFile, GitHubRepo } from '../types'

export default defineEventHandler(async (event) => {
  const repos = await $fetch<{ repos: GitHubRepo[] }>('https://ungh.cc/orgs/unjs/repos').then(({ repos }) => repos.filter(repo => !internalRepos.has(repo.name)))

  const reposNames = repos.map(repo => repo.name)

  const unjsDepsPerRepo = await Promise.all(repos.map(repo => $fetch<GitHubFile>(`https://ungh.cc/repos/unjs/${repo.name}/files/main/package.json`).then((file) => {
    const pkg = JSON.parse(file.file.contents)

    return {
      name: repo.name,
      description: repo.description,
      dependencies: Object.keys(pkg.dependencies || {}).filter(dependency => reposNames.includes(dependency)),
      devDependencies: Object.keys(pkg.devDependencies || {}).filter(dependency => reposNames.includes(dependency)),
    }
  })))

  setResponseHeader(event, 'Content-Type', 'application/json')
  return unjsDepsPerRepo.sort((a, b) => b.name.localeCompare(a.name))
})
