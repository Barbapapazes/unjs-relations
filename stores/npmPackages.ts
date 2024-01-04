import type { NpmPackage, Package } from '~/types/packages'
import { fetchNpmPackage } from '~/composables/packages'

export const useNpmPackagesStore = defineStore('npmPackages', () => {
  const packages = ref<Package[]>([])

  const toast = useToast()

  async function fetch(name: string, unjsPackages: Package[], options?: { mode: 'new' }) {
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

    const { data, error } = await useAsyncData<{ package: NpmPackage }>(`npm:${name}`, () => fetchNpmPackage(name))

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

    const package_ = toPackage(data.value.package, unjsPackages)
    packages.value.push(package_)

    toast.add({
      title: `'${name}' successfully added`,
      color: 'green',
      timeout: 3000,
    })

    return package_
  }

  function remove(name: string) {
    const index = packages.value.findIndex(pkg => pkg.name === name)

    if (index === -1)
      return

    packages.value.splice(index, 1)

    toast.add({
      title: `'${name}' removed`,
      color: 'red',
      timeout: 3000,
    })
  }

  return {
    packages,
    fetch,
    remove,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNpmPackagesStore, import.meta.hot))
