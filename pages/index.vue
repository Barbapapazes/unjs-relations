<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { UInput } from '#components'
import type { Package } from '~/types/packages'
import type { Settings } from '~/types/settings'

useSeoMeta({
  title: 'UnJS Relations',
  description: 'Visualize the relations between UnJS packages',
})

const { data: pkg } = await useFetch<Package[]>('/api/packages')

if (!pkg.value) {
  throw createError({
    statusCode: 404,
    message: 'Packages not found',
  })
}

const packages = computed(() => pkg.value!.map((p) => {
  return p.name
}).sort()) as ComputedRef<string[]>

const settings = ref<Settings>({
  dependencies: true,
  devDependencies: false,
  children: false,
})

function updateSettings(data: Settings) {
  settings.value = data
}

const isSlideoverOpen = ref<boolean>(false)
const slideOverPackage = ref<Package | null>(null)
function onSelectNode(packageName: string) {
  slideOverPackage.value = pkg.value!.find(p => p.name === packageName) || null
  isSlideoverOpen.value = true
}

const query = ref<string>('')
const selectedPackages = ref<string[]>(packages.value)
const resultsPackages = computed(() => {
  return packages.value.filter(p => p.includes(query.value))
})

function resetSelection() {
  selectedPackages.value = []
}

function selectAll() {
  selectedPackages.value = packages.value
}

function openInRelations(packageName: string) {
  isSlideoverOpen.value = false
  selectedPackages.value = [packageName]
}
</script>

<template>
  <!-- TODO: mobile version -->
  <div class="relative w-scree h-screen overflow-hidden">
    <CardSlideover v-slot="{ close }" class="z-10 absolute top-4 left-4" open-class="bottom-4 w-80">
      <div class="flex justify-between items-center">
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
      <Combobox v-model="selectedPackages" multiple as="div" class="mt-2">
        <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." />
        <ComboboxOptions static as="ol" class="py-2 px-1 h-[calc(100vh-148px)] overflow-y-scroll">
          <template v-if="resultsPackages.length">
            <ComboboxOption v-for="item in resultsPackages" :key="item" v-slot="{ active, selected }" as="template" :value="item">
              <li class="cursor-pointer px-1 py-1 w-full flex items-center justify-between rounded-md transition ease-in" :class="{ 'bg-gray-300/40': active }">
                <span class="flex items-center gap-2">
                  <UAvatar :src="`https://unjs.io/assets/logos/${item}.svg`" :alt="`Logo of ${item}`" size="xs" :ui="{ rounded: '' }" />
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
      </Combobox>
      <div class="flex justify-between">
        <UButton color="red" variant="outline" @click="resetSelection">
          Reset selection
        </UButton>
        <UButton color="primary" @click="selectAll">
          Select all
        </UButton>
      </div>
    </CardSlideover>
    <CardSlideover v-slot="{ close }" right class="z-10 absolute top-4 right-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-bold">
          Settings
        </h2>
        <CardSlideoverClose @click="close" />
      </div>
      <div class="flex flex-col gap-1">
        <GraphSettings :settings="settings" @change="updateSettings($event)" />
      </div>
    </CardSlideover>
    <CardSlideover v-slot="{ close }" right class="z-10 absolute bottom-4 right-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-bold">
          Legend
        </h2>
        <CardSlideoverClose @click="close" />
      </div>
      <div class="flex flex-col gap-1">
        <GraphLegend />
      </div>
    </CardSlideover>

    <div
      v-if="!selectedPackages.length" class="h-full flex items-center justify-center gap-4"
    >
      <span class="font-medium">
        Start by selecting a package
      </span>
    </div>
    <Graph
      v-else
      class="h-full w-full"
      :packages="pkg!" :selection="selectedPackages"
      :settings="settings" @select-node="onSelectNode($event)"
    />
  </div>
  <!-- TODO: fix slide over -->
  <USlideover v-model="isSlideoverOpen">
    <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-zinc-100 dark:divide-zinc-800', header: { base: 'flex justify-between items-center' } }">
      <template #header>
        <h2 class="text-xl font-bold">
          {{ slideOverPackage?.name }}
        </h2>

        <UButton icon="i-simple-icons-github" label="View on GitHub" :to="`https://github.com/unjs/${slideOverPackage.name}`" target="_blank" variant="ghost" color="gray" />
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
                <UButton icon="i-simple-icons-github" :to="`https://github.com/unjs/${dep}`" target="_blank" variant="ghost" color="gray" />
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
                <UButton icon="i-simple-icons-github" :to="`https://github.com/unjs/${dep}`" target="_blank" variant="ghost" color="gray" />
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
  </USlideover>
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
