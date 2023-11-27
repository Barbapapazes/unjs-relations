<script lang="ts" setup>
import type { Package } from '~/types/packages'
import type { Settings } from '~/types/settings'

useSeoMeta({
  title: 'UnJS Relations',
  description: 'Visualize the relations between UnJS packages',
})

const { data: pkg } = await useFetch<Package[]>('/api/packages.json')

if (!pkg.value) {
  throw createError({
    statusCode: 404,
    message: 'Packages not found',
  })
}

const settings = ref<Settings>({
  dependencies: true,
  devDependencies: false,
  children: false,
})

const isSettingsOpen = ref<boolean>(false)
function updateSettings(data: Settings) {
  settings.value = data
}

const isSlideoverOpen = ref<boolean>(false)
const slideOverPackage = ref<Package | null>(null)
function onSelectNode(packageName: string | null) {
  if (!packageName)
    return

  slideOverPackage.value = pkg.value!.find(p => p.name === packageName) || null
  isSlideoverOpen.value = true
}

// TODO: add homepage to unnpm
function getGitHubLink(packageName: string): string {
  const repoName = pkg.value!.find(p => p.name === packageName)?.title
  return `https//github.com/unjs/${repoName}`
}

// function openInRelations(packageName: string) {
//   isSlideoverOpen.value = false
//   selectedPackages.value = [packageName]
// }

const isLegendOpen = ref<boolean>(false)

const unjsPackages = computed(() => pkg.value!.sort((a, b) => b.name.localeCompare(a.name)))
const selectedUnJSPackages = ref<Package[]>([])

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
    ...pkg.value!,
  ]
})
const selection = computed(() => {
  return [
    ...selectedUnJSPackages.value,
    ...selectedNpmPackages.value,
  ]
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <CardSlideover v-slot="{ close }" class="z-10 absolute top-4 left-4" open-class="right-4 sm:right-auto sm:w-80">
      <div class="mb-2 flex justify-between items-center">
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
      <!-- <div class="h-full grid grid-rows-2">
        <ManageUnjsPackages :packages="pkg!" class="overflow-hidden" />
        <ManageExternalPackages :packages="externalPackages" @add-package="onAddPackage($event)" />
      </div>
      <div>
        button
      </div>
      <USelectMenu
        v-if="lessXl"
        v-model="selectedPackages" :options="packages" multiple placeholder="Select packages"
        searchable
        searchable-placeholder="Search a package..."
      >
        <template #option="{ option: packageName }">
          <UAvatar :src="getLogo(packageName)" :alt="`Logo of ${packageName}`" size="xs" :ui="{ rounded: '' }" />
          <span>
            {{ packageName }}
          </span>
        </template>
      </USelectMenu> -->
      <!-- <Combobox v-else v-model="selectedPackages" multiple as="div">
        <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." />
        <ComboboxOptions static as="ol" class="py-2 px-1 h-[calc(100vh-148px)] overflow-y-scroll">
          <template v-if="resultsPackages.length">
            <ComboboxOption v-for="item in resultsPackages" :key="item" v-slot="{ active, selected }" as="template" :value="item">
              <li class="cursor-pointer px-1 py-1 w-full flex items-center justify-between rounded-md transition ease-in" :class="{ 'bg-gray-300/40': active }">
                <span class="flex items-center gap-2">
                  <UAvatar :src="getLogo(item)" :alt="`Logo of ${item}`" size="xs" :ui="{ rounded: '' }" />
                  <span>
                    {{ item }}
                  </span>
                </span>
                <span v-if="selected" class="i-ph-check" />
              </li>
            </ComboboxOption>
          </template>
          <div v-else class="mt-1 text-center">
            <span>
              No results
            </span>
          </div>
        </ComboboxOptions>
      </Combobox> -->
      <!-- <div class="mt-2 xl:mt-0 flex justify-between">
        <UButton class="xl:hidden" color="white" variant="ghost" size="xs" @click="isSettingsOpen = true">
          Settings
        </UButton>
        <div class="xl:grow flex gap-2 xl:justify-between">
          <UButton color="red" variant="outline" :size="lessXl ? 'xs' : 'sm'" @click="resetSelection">
            Reset selection
          </UButton>
          <UButton color="primary" :size="lessXl ? 'xs' : 'sm'" @click="selectAll">
            Select all
          </UButton>
        </div>
      </div> -->
    </CardSlideover>
    <!-- <CardSlideover v-if="!lessXl" v-slot="{ close }" right class="z-10 absolute top-4 right-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-bold">
          Settings
        </h2>
        <CardSlideoverClose @click="close" />
      </div>
      <div class="flex flex-col gap-1">
        <GraphSettings :settings="settings" @change="updateSettings($event)" />
      </div>
    </CardSlideover> -->
    <!-- <CardSlideover v-slot="{ close }" right class="z-10 absolute bottom-4 right-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-bold">
          Legend
        </h2>
        <CardSlideoverClose @click="close" />
      </div>
      <div class="flex flex-col gap-1">
        <GraphLegend />
      </div>
    </CardSlideover> -->

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
  <!-- <USlideover v-model="isSlideoverOpen">
    <UCard v-if="slideOverPackage" class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-zinc-100 dark:divide-zinc-800', header: { base: 'flex justify-between items-center' } }">
      <template #header>
        <h2 class="text-xl font-bold">
          {{ slideOverPackage?.name }}
        </h2>

        <UButton icon="i-simple-icons-github" label="View on GitHub" :to="`https://github.com/unjs/${slideOverPackage.title}`" target="_blank" variant="ghost" color="gray" />
      </template>

      <div class="prose">
        <p>
          {{ slideOverPackage?.description }}
        </p>

        <p>
          UnJS Dependencies:
        </p>
        <ul v-if="slideOverPackage?.dependencies.length">
          <li v-for="dep in slideOverPackage?.dependencies" :key="dep">
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
          <li v-for="dep in slideOverPackage?.devDependencies" :key="dep">
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
        <p v-if="!slideOverPackage?.devDependencies.length">
          <em>
            No devDependencies
          </em>
        </p>
      </div>
    </UCard>
  </USlideover> -->
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
  <UnJsPackagesModal v-model="isUnJSPackagesOpen" :packages="unjsPackages" @selection="onUnJSSelection($event)" />
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
