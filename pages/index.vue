<script lang="ts" setup>
import type { Package } from '~/types/packages'
import type { Settings } from '~/types/settings'

useSeoMeta({
  title: 'UnJS Relations',
  description: 'Visualize the relations between UnJS packages',
})

const { data } = await useFetch<Package[]>('/api/packages.json')

const isSettingsOpen = ref<boolean>(false)
const settings = ref<Settings>({
  dependencies: true,
  devDependencies: false,
  children: false,
})
function updateSettings(data: Settings) {
  settings.value = data
}

const isLegendOpen = ref<boolean>(false)

const unjsPackages = computed(() => data.value!.sort((a, b) => a.name.localeCompare(b.name)))
const selectedUnJSPackages = ref<Package[]>(unjsPackages.value)

const isUnJSPackagesOpen = ref<boolean>(false)
function onUnJSSelection(packages: Package[]) {
  selectedUnJSPackages.value = packages
}

const selectedNpmPackages = ref<Package[]>([])

const isNpmPackagesOpen = ref<boolean>(false)
function onNpmSelection(packages: Package[]) {
  selectedNpmPackages.value = packages
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

const isSlideoverOpen = ref<boolean>(false)
const slideoverPackage = ref<Package | null>(null)
function onSelectNode(package_: Package | null) {
  if (!package_)
    return

  slideoverPackage.value = package_
  isSlideoverOpen.value = true
}
function openInRelations(packageName: string) {
  isSlideoverOpen.value = false

  const package_ = packages.value.find(pkg => pkg.name === packageName) as Package
  selectedUnJSPackages.value = [package_]
  selectedNpmPackages.value = []
}

const slideoverGitHubLink = computed(() => {
  if (!slideoverPackage.value)
    return null

  const isExternal = slideoverPackage.value.external

  if (isExternal)
    return null

  return getGitHubLink(slideoverPackage.value.name)
})

const slideoverNpmLink = computed(() => {
  if (!slideoverPackage.value)
    return null

  const isExternal = slideoverPackage.value.external

  if (!isExternal)
    return null

  return `https://www.npmjs.com/package/${slideoverPackage.value.name}`
})

/**
 * Will only be used by a UnJS package
 */
function getGitHubLink(packageName: string): string {
  const repoName = data.value!.find(p => p.name === packageName)?.title

  return `https://github.com/unjs/${repoName}`
}
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <CardSlideover v-slot="{ close }" class="z-10 absolute top-4 left-4" open-class="right-4 sm:right-auto">
      <div class="mb-2 flex justify-between items-center gap-4">
        <div class="flex items-end gap-1">
          <h1 class="font-bold">
            UnJS Relations
          </h1>
          <span>
            -
          </span>
          <NuxtLink to="https://github.com/barbapapazes/relations-unjs" target="_blank" rel="noopener">
            Built by Estéban
          </NuxtLink>
        </div>
        <CardSlideoverClose @click="close" />
      </div>

      <section>
        <h2 class="font-semibold">
          Manage Packages
        </h2>
        <div class="mt-1 flex gap-2">
          <UButton variant="solid" color="white" @click="isUnJSPackagesOpen = true">
            <template #leading>
              <UAvatar src="https://unjs.io/favicon.svg" alt="UnJS Logo" size="xs" :ui="{ rounded: 'rounded-sm' }" />
            </template>
            UnJS
          </UButton>
          <UButton icon="i-simple-icons-npm" variant="solid" color="white" @click="isNpmPackagesOpen = true">
            npm
          </UButton>
        </div>
      </section>

      <section class="mt-2">
        <h2 class="font-semibold">
          Misc
        </h2>
        <div class="mt-1 flex gap-2">
          <UButton icon="i-ph-gear" variant="ghost" color="gray" label="Settings" @click="isSettingsOpen = true" />
          <UButton icon="i-ph-flashlight" variant="ghost" color="gray" label="Legend" @click="isLegendOpen = true" />
        </div>
      </section>
    </CardSlideover>

    <div
      v-if="!selection.length" class="h-full flex items-center justify-center gap-4"
    >
      <span class="font-medium">
        Start by selecting a package
      </span>
    </div>
    <Graph
      v-else
      class="h-full w-full"
      :packages="packages" :selection="selection"
      :settings="settings" @select-node="onSelectNode($event)"
    />
  </div>
  <USlideover v-model="isSlideoverOpen">
    <UCard v-if="slideoverPackage" class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-zinc-100 dark:divide-zinc-800', header: { base: 'flex justify-between items-center' } }">
      <template #header>
        <h2 class="text-xl font-bold">
          {{ slideoverPackage?.name }}
        </h2>

        <UButton v-if="slideoverGitHubLink" icon="i-simple-icons-github" label="View on GitHub" :to="slideoverGitHubLink" target="_blank" variant="ghost" color="gray" />
        <UButton v-if="slideoverNpmLink" icon="i-simple-icons-npm" label="View on npm" :to="slideoverNpmLink" target="_blank" variant="ghost" color="gray" />
      </template>

      <div class="prose">
        <p>
          {{ slideoverPackage?.description }}
        </p>

        <p>
          UnJS Dependencies:
        </p>
        <ul v-if="slideoverPackage?.dependencies.length">
          <li v-for="dep in slideoverPackage?.dependencies" :key="dep">
            <span class="not-prose flex items-center justify-between">
              <span>
                {{ dep }}
              </span>
              <span class="not-prose flex gap-2">
                <UTooltip text="View relations">
                  <UButton icon="i-ph-graph" variant="ghost" color="gray" @click="openInRelations(dep)" />
                </UTooltip>
                <UButton icon="i-simple-icons-github" :to="getGitHubLink(dep)" target="_blank" variant="ghost" color="gray" />
              </span>
            </span>
          </li>
        </ul>
        <p v-else>
          <em>
            No dependencies
          </em>
        </p>

        <p>
          UnJS Dev dependencies:
        </p>
        <ul>
          <li v-for="dep in slideoverPackage?.devDependencies" :key="dep">
            <span class="not-prose flex items-center justify-between">
              <span>
                {{ dep }}
              </span>
              <span class="not-prose flex gap-2">
                <UTooltip text="View relations">
                  <UButton icon="i-ph-graph" variant="ghost" color="gray" @click="openInRelations(dep)" />
                </UTooltip>
                <UButton icon="i-simple-icons-github" :to="getGitHubLink(dep)" target="_blank" variant="ghost" color="gray" />
              </span>
            </span>
          </li>
        </ul>
        <p v-if="!slideoverPackage?.devDependencies.length">
          <em>
            No devDependencies
          </em>
        </p>
      </div>
    </UCard>
  </USlideover>
  <UModal v-model="isSettingsOpen">
    <div class="p-4">
      <div
        class="flex justify-between items-center"
      >
        <h2 class="font-bold">
          Settings
        </h2>
        <UButton color="gray" variant="ghost" icon="i-ph-x" class="-my-1" @click="isSettingsOpen = false" />
      </div>
      <div class="mt-2 flex flex-col gap-1">
        <GraphSettings :settings="settings" @change="updateSettings($event)" />
      </div>
    </div>
  </UModal>
  <UModal v-model="isLegendOpen">
    <div class="p-4">
      <div class="flex justify-between items-center">
        <h2 class="font-bold">
          Legend
        </h2>
        <UButton color="gray" variant="ghost" icon="i-ph-x" class="-my-1" @click="isLegendOpen = false" />
      </div>
      <div class="mt-2 flex flex-col gap-1">
        <GraphLegend />
      </div>
    </div>
  </UModal>
  <UnJsPackagesModal v-model="isUnJSPackagesOpen" :packages="unjsPackages" :selection="selectedUnJSPackages" @selection="onUnJSSelection($event)" />
  <NpmPackagesModal v-model="isNpmPackagesOpen" @selection="onNpmSelection($event)" />
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(calc(-100% - 1rem));
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(calc(100% + 1rem));
}
</style>
