import type { InternalPackage, PackageJson } from '~/types/packages'

export const useGitHubPackagesStore = defineStore('githubPackages', () => {
  const unwantedPaths = [
    'playground',
    'examples',
  ]

  const packages = ref<InternalPackage[]>([])

  const toast = useToast()

  async function fetch(name: string, unjsPackages: InternalPackage[], options?: { mode: 'new' }) {
    const cachedPackage = packages.value.find(pkg => pkg.name === name)

    if (cachedPackage) {
      if (options?.mode === 'new') {
        toast.add({
          title: `'${name}' already added`,
          color: 'orange',
          timeout: 3000,
        })
      }

      return cachedPackage
    }

    const { data, error } = await useAsyncData(`github:${name}`, async () => {
      const { files } = await fetchGitHubFiles(name)

      const pkg = files.filter(file => file.path.includes('package.json') && !unwantedPaths.some(path => file.path.includes(path)))

      const contents = await Promise.all(pkg.map(async (file) => {
        const { file: { contents } } = await fetchGitHubFile(name, file.path)

        return JSON.parse(contents) as PackageJson & { private: boolean }
      }))

      // Filter out private packages
      return contents.filter(content => !content.private && content.name)
    })

    if (error.value) {
      if (error.value?.statusCode === 404) {
        toast.add({
          title: `'${name}' not found`,
          color: 'red',
          timeout: 3000,
        })
      }
      else {
        toast.add({
          title: 'Error',
          description: error.value?.message,
          color: 'red',
          timeout: 3000,
        })
      }
    }

    if (!data.value)
      return null

    const _packages = []
    for (const pkg of data.value) {
      const newPackage = toInternalPackage(pkg, 'github', unjsPackages)
      _packages.push(newPackage)
      // TODO: envoyer dans le store npm
      packages.value.push(newPackage)
      toast.add({
        title: `'${newPackage.name}' successfully added`,
        color: 'green',
        timeout: 3000,
      })
    }

    return _packages
  }

  function remove(name: string) {
    const index = packages.value.findIndex(pkg => pkg.name === name)

    if (index === -1)
      return

    packages.value.splice(index, 1)
  }

  return {
    packages,
    fetch,
    remove,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGitHubPackagesStore, import.meta.hot))
