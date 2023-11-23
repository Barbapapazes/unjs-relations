import type { GitHubFiles, GitHubRepo } from '~/server/types'

const internalRepos = new Set(['examples'])

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  const unjsRepos = await fetchUnjsRepos().then(repos => repos.map(repo => repo.name))

  const repos = await $fetch<{ repos: GitHubRepo[] }>(`https://ungh.cc/orgs/${name}/repos`).then(({ repos }) => repos.filter(repo => !internalRepos.has(repo.name)))

  const filesPerPackages = await Promise.allSettled(repos.map(repo => $fetch<GitHubFiles>(`https://ungh.cc/repos/${name}/${repo.name}/files/main`))).then((results) => {
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          name: repos[index].name,
          files: result.value.files.map(file => file.path),
        }
      }
      else {
        return null
      }
    }).filter(Boolean)
  })

  const packageJsonFiles = filesPerPackages.map((pkg) => {
    if (!pkg)
      return null

    const packageJsonFiles = pkg.files.filter(file => file.endsWith('package.json') && !file.includes('playground') && !file.includes('test') && !file.includes('example') && !file.includes('docs') && !file.includes('templates'))

    if (packageJsonFiles.length) {
      return {
        name: pkg.name,
        files: packageJsonFiles,
      }
    }

    return null
  }).filter(Boolean)

  const packageJsonContents = await Promise.all(packageJsonFiles.map(async (pkg) => {
    if (!pkg)
      return null

    const contents = await Promise.all(pkg.files.map(async (file) => {
      const contents = await $fetch<{ file: { contents: string } }>(`https://ungh.cc/repos/${name}/${pkg.name}/files/main/${file}`).then(({ file }) => JSON.parse(file.contents))

      if (contents.private)
        return null

      return {
        name: contents.name,
        description: contents.description,
        dependencies: Object.keys(contents.dependencies || {}).filter(dependency => unjsRepos.includes(dependency)),
        devDependencies: Object.keys(contents.devDependencies || {}).filter(dependency => unjsRepos.includes(dependency)),
      }
    }))

    return contents.filter(Boolean)
  }))

  return packageJsonContents
})
