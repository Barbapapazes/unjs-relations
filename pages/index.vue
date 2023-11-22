<script lang="ts" setup>
import type { Package } from '~/types/packages'

const { data: pkg } = await useFetch('/api/packages')

if (!pkg.value) {
  throw createError({
    statusCode: 404,
    message: 'Packages not found',
  })
}

const packages = computed(() => pkg.value!.map((p) => {
  return p.name
}).sort(),
)

const selected = ref<string[]>([])

function resetSelection() {
  selected.value = []
}

function selectAll() {
  selected.value = packages.value
}

const showDependencies = ref<boolean>(true)
const showDevDependencies = ref<boolean>(true)
const showChildren = ref<boolean>(false)

const isSlideoverOpen = ref<boolean>(false)
const slideOverPackage = ref<Package | null>(null)
function onSelectNode(packageName: string) {
  slideOverPackage.value = pkg.value!.find(p => p.name === packageName) || null
  isSlideoverOpen.value = true
}
function openInRelations(packageName: string) {
  isSlideoverOpen.value = false
  selected.value = [packageName]
}

const input = ref<string>('')
const resultsPackages = computed(() => {
  return packages.value.filter(p => p.includes(input.value))
})

function togglePackageToSelection(packageName: string) {
  if (selected.value.includes(packageName))
    selected.value = selected.value.filter(p => p !== packageName)
  else
    selected.value = [...selected.value, packageName]
}
</script>

<template>
  <div class="relative">
    <div class="grid grid-cols-12">
      <div class="p-2 max-h-screen col-span-2">
        <UInput v-model="input" color="primary" variant="outline" placeholder="Search a package..." />
        <ol class="py-1 px-2 h-[calc(100vh-80px)] overflow-y-auto">
          <li v-for="item in resultsPackages" :key="item">
            <button type="button" class="py-1 w-full flex items-center justify-between rounded-lg hover:bg-zinc-100 transition ease-in" @click="togglePackageToSelection(item)">
              <span class="flex items-center gap-2">
                <UAvatar :src="`https://unjs.io/assets/logos/${item}.svg`" :alt="`Logo of ${item}`" size="xs" :ui="{ rounded: '' }" />
                <span>
                  {{ item }}
                </span>
              </span>
              <span v-if="selected.includes(item)" class="i-ph-check" />
            </button>
          </li>
        </ol>
        <div class="flex justify-between">
          <UButton color="red" variant="outline" @click="resetSelection">
            Reset selection
          </UButton>
          <UButton color="primary" @click="selectAll">
            Select all
          </UButton>
        </div>
      </div>
      <div class="col-span-10 w-full h-full">
        <div
          v-if="!selected.length" class="h-full flex flex-col items-center justify-center gap-4"
        >
          <span class="font-medium">
            Start by selecting a package
          </span>
        </div>
        <Relations
          v-else
          class="h-full w-full"
          :packages="pkg!" :selection="selected"
          :show-dependencies="showDependencies" :show-dev-dependencies="showDevDependencies" :show-children="showChildren" @select-node="onSelectNode($event)"
        />
      </div>
    </div>
    <!-- <div class="top-0 left-0 right-0 z-10 bg-white bg-opacity-60 backdrop-blur-lg">
      <UContainer>
        <UPage>
          <div class="py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div class="flex gap-4">
              <USelectMenu
                v-model="selected"
                multiple
                searchable
                searchable-placeholder="Search packages"
                placeholder="Select packages"
                :options="packages"
              />

              <UButton color="red" variant="outline" @click="resetSelection">
                Reset selection
              </UButton>
              <UButton color="primary" @click="selectAll">
                Select all
              </UButton>
            </div>

            <div class="flex gap-4">
              <UCheckbox v-model="showDependencies" label="Show dependencies" name="dependencies" />
              <UCheckbox v-model="showDevDependencies" label="Show devDependencies" name="devDependencies" />
              <UCheckbox v-model="showChildren" label="Show children" name="children" />
            </div>
          </div>

          <div class="flex flex-row flex-wrap gap-4">
            <div class="flex items-center gap-1">
              <span class="block rounded-full bg-yellow-500 w-2 h-2" />
              <span> Selected packages</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="block rounded-full bg-cyan-300 w-2 h-2" />
              <span> UnJS Packages </span>
            </div>
            <div class="flex items-center gap-1">
              <span class="block rounded-full bg-pink-300 w-2 h-2" />
              <span> Used as dependencies </span>
            </div>
            <div class="flex items-center gap-1">
              <span class="block rounded-full bg-purple-300 w-2 h-2" />
              <span> Used as devDependencies </span>
            </div>
          </div>
        </UPage>
      </UContainer>
    </div> -->
    <!-- <div class="absolute z-10 bottom-0 left-0 right-0 bg-white bg-opacity-60 backdrop-blur-lg">
      <UContainer>
        <UPage>
          <div class="py-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-zinc-500">
            <span>
              Made by <NuxtLink to="https://github.com/barbapapazes" target="_blank" rel="noopener">
                Estéban Soubiran
              </NuxtLink>
            </span>

            <UButton icon="i-simple-icons-github" to="https://github.com/barbapapazes/relations-unjs" target="blank" rel="noopener" variant="ghost" color="gray" size="xs">
              View Source
            </UButton>
          </div>
        </UPage>
      </UContainer>
    </div> -->
    <!-- <Relations
      :packages="pkg!" :selection="selected"
      :show-dependencies="showDependencies" :show-dev-dependencies="showDevDependencies" :show-children="showChildren" @select-node="onSelectNode($event)"
    />
    <USlideover v-model="isSlideoverOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-zinc-100 dark:divide-zinc-800', header: { base: 'flex justify-between items-center' } }">
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
    </USlideover> -->
  </div>
</template>
