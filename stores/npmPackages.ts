import { fetchNpmPackage } from '~/composables/packages'
import type { InternalPackage } from '~/types/packages'

export const useNpmPackagesStore = defineStore('npmPackages', () => {
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

    const { data, error } = await useAsyncData(`npm:${name}`, () => fetchNpmPackage(name))

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

    const internalPackage = toInternalPackage(data.value.package, 'npm', unjsPackages)

    packages.value.push(internalPackage)

    return internalPackage
  }

  function set(internalPackages: InternalPackage[]) {
    packages.value = internalPackages
  }

  return {
    packages,
    fetch,
    set,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNpmPackagesStore, import.meta.hot))
