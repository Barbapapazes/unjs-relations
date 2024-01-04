<script lang="ts" setup>
import type { Package } from '~/types/packages'

// We can't fetch on server since this will use the API endpoint and not the prerender file.
const { data, error, pending } = await useAsyncData<Package[]>('unjs-package', () => fetchUnJSPackages(), {
  server: false,
  default: () => [],
  transform: (data) => {
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },
})

watch(error, () => {
  throw createError({
    statusCode: 500,
    message: 'Failed to fetch packages',
    fatal: true,
  })
})

const toast = useToast()

const openMenu = ref<boolean>(true)

const openSettings = ref<boolean>(false)
const openLegend = ref<boolean>(false)
const openUnJSPackages = ref<boolean>(false)
const openNpmPackages = ref<boolean>(false)

defineShortcuts({
  meta_h: {
    handler() {
      openMenu.value = !openMenu.value
    },
  },
  meta_s: {
    handler() {
      openSettings.value = !openSettings.value
    },
  },
  meta_l: {
    handler() {
      openLegend.value = !openLegend.value
    },
  },
})

const queryPackages = getRoutePackages('packages[]')
const selectedUnJSPackages = computed(() => {
  if (!queryPackages.value)
    return data.value

  return findPackages(data.value, queryPackages.value)
})

function findPackages(packages: Package[], names: string[]): Package[] {
  return packages.filter((pkg) => {
    return names.includes(pkg.name)
  })
}

function onUnJSPackagesSelection(packages: Package[]) {
  const packageNames = packages.map(pkg => pkg.name)
  navigateToPackages(packageNames, 'packages[]')
}

const npmPackagesStore = useNpmPackagesStore()
const queryNpmPackages = getRoutePackages('npm-packages[]')
watch([data, queryNpmPackages], async () => {
  if (!data.value.length)
    return

  await Promise.all(queryNpmPackages.value?.map(name => npmPackagesStore.fetch(name, data.value)) || [])
})

const selectedNpmPackages = computed(() => {
  return npmPackagesStore.packages.filter((pkg) => {
    return queryNpmPackages.value?.includes(pkg.name)
  })
})

function onNpmSelection(packages: Package[]) {
  const packageNames = packages.map(pkg => pkg.name)
  navigateToPackages(packageNames, 'npm-packages[]')
}

const packages = computed(() => {
  return [
    ...data.value!,
  ]
})
const selection = computed(() => {
  return [
    ...selectedUnJSPackages.value,
    ...selectedNpmPackages.value,
  ]
})

const openSlideoverPackage = ref<boolean>(false)
const slideoverPackage = ref<Package | null>(null)
function onSelectNode(package_: Package | null) {
  if (!package_)
    return

  slideoverPackage.value = package_
  openSlideoverPackage.value = true
}

function onOpenRelations(packageName: string) {
  openSlideoverPackage.value = false

  const package_ = packages.value.find(pkg => pkg.name === packageName) as Package
  navigateToPackages([package_.name], 'packages[]')

  toast.add({
    title: `Showing relations for ${package_.name}`,
    color: 'primary',
    timeout: 3000,
  })
}

const route = useRoute()
function navigateToPackages(packageNames: string[], queryName: 'packages[]' | 'npm-packages[]') {
  navigateTo({
    query: {
      ...route.query,
      // We set packages to an empty string if there are no packages to avoid to use all packages
      [queryName]: packageNames.length ? packageNames : 'null',
    },
  })
}

const title = 'UnJS Relations: Visualize interdependencies between repositories'
const description = 'Visualize relations between UnJS repositories and the outside ecosystem'
useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <Menu
      v-if="openMenu"
      @update:settings="openSettings = $event" @update:legend="openLegend = $event"
      @update:unjs-packages="openUnJSPackages = $event" @update:npm-packages="openNpmPackages = $event"
    />

    <ModalSettings v-model="openSettings" />
    <ModalLegend v-model="openLegend" />

    <SlideoverPackage
      v-model="openSlideoverPackage"
      :unjs-packages="data"
      :package="slideoverPackage" @open:relations="onOpenRelations($event)"
    />

    <Graph
      v-if="selection.length"
      class="h-full w-full"
      :packages="packages" :selection="selection" @select-node="onSelectNode($event)"
    />
    <div
      v-else
      class="h-full flex items-center justify-center gap-4"
    >
      <span class="font-medium">
        <template v-if="pending">
          Loading...
        </template>
        <template v-else>
          Start by selecting a package
        </template>
      </span>
    </div>
  </div>

  <ModalUnJSPackages v-model="openUnJSPackages" :packages="data" :selection="selectedUnJSPackages" @update:selection="onUnJSPackagesSelection($event)" />
  <ModalNpmPackages
    v-model="openNpmPackages" :unjs-packages="data"
    :selection="selectedNpmPackages"
    @update:selection="onNpmSelection($event)"
  />
</template>
