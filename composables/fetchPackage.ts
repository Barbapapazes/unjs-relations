import type { NpmPackage } from '~/types/packages'

export async function fetchPackage(name: string) {
  const { data: response, error } = await useFetch<{ package: NpmPackage }>(`https://unnpm.pages.dev/packages/${name}`)

  const data = computed(() => response.value?.package)

  return {
    data,
    error,
  }
}
