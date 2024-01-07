<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { UInput } from '#components'
import type { InternalPackage, PackageJson } from '~/types/packages'

const props = defineProps<{
  modelValue: boolean
  unjsPackages: InternalPackage[]
  selection: InternalPackage[]
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'update:selection': [InternalPackage[]]
}>()

const toast = useToast()

const store = useNpmPackagesStore()

const currentPackages = ref<InternalPackage[]>(store.packages)
const selection = ref<InternalPackage[]>([...props.selection])
// Used to update the selection when the parent changes
watch(() => props.selection, () => {
  selection.value = [...props.selection]
})

function close() {
  emits('update:modelValue', false)
}

function removeAll() {
  currentPackages.value = []
  selection.value = []
}

function clear() {
  selection.value = []
}

function validate() {
  close()
  store.set(currentPackages.value)
  emits('update:selection', selection.value)
}

/**
 * Add a package from npm
 */
// TODO: implement search for a package on npm using https://registry.npmjs.org/-/v1/search?text=nuxt
const npmInput = ref<string>('')
const npmLoading = ref<boolean>(false)
async function addNpmPackage() {
  const packageName = npmInput.value.trim().toLowerCase()

  npmLoading.value = true
  // TODO: do not use this to avoid update chart
  const fetched = await store.fetch(packageName, props.unjsPackages, { mode: 'new' })
  npmLoading.value = false

  if (fetched) {
    selection.value = [...selection.value, fetched]
    npmInput.value = ''
  }
}

/**
 * Add packages from npm through GitHub
 */
const githubInput = ref<string>('')
const githubLoading = ref<boolean>(false)
async function addNpmPackagesFromGitHub() {
  const input = githubInput.value.trim().toLowerCase()
  const isOrg = !input.includes('/')

  githubLoading.value = true
  const contents: PackageJson[] = []
  try {
    if (isOrg) {
      const { repos } = await fetchGitHubRepos(input)

      const data = await Promise.all(repos.map(async (repo) => {
        const contents = await fetchPackagesFromGitHubRepo(repo.repo, repo.defaultBranch)
        return contents
      }))

      for (const content of data)
        contents.push(...content)
    }
    else {
      const { repo } = await fetchGitHubRepo(input)
      contents.push(...await fetchPackagesFromGitHubRepo(repo.repo, repo.defaultBranch))
    }

    for (const content of contents) {
      const internalPackage = toInternalPackage(content, 'npm', props.unjsPackages)

      addCurrentPackage(internalPackage)
      addSelection(internalPackage)

      githubInput.value = ''
    }

    toast.add({
      title: 'Success',
      description: `Successfully fetched ${contents.length} packages from GitHub`,
      color: 'green',
      timeout: 3000,
    })
  }
  catch (error) {
    toast.add({
      title: 'Error',
      description: 'An error occured while fetching the packages from GitHub',
      color: 'red',
      timeout: 3000,
    })
  }
  finally {
    githubLoading.value = false
  }
}

function addCurrentPackage(internalPackage: InternalPackage) {
  // Check if already exists
  if (currentPackages.value.find(pkg => pkg.name === internalPackage.name))
    return

  currentPackages.value = [...currentPackages.value, internalPackage]
}

function addSelection(internalPackage: InternalPackage) {
  // Check if already exists
  if (selection.value.find(pkg => pkg.name === internalPackage.name))
    return

  selection.value = [...selection.value, internalPackage]
}

function removeInternalPackage(internalPackage: InternalPackage) {
  currentPackages.value = currentPackages.value.filter(pkg => pkg.name !== internalPackage.name)
  selection.value = selection.value.filter(pkg => pkg.name !== internalPackage.name)
}

/**
 * Search inside current packages
 */
const query = ref<string>('')
const search = computed(() => {
  return currentPackages.value.filter(pkg => pkg.name.includes(query.value))
})
</script>

<template>
  <UModal :model-value="modelValue" :ui="{ width: 'xl:max-w-3xl' }" @update:model-value="close">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2 class="font-semibold">
            Manage npm Packages
          </h2>
          <UButton type="button" aria-label="close" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="close" />
        </div>
      </template>

      <div class="flex flex-col lg:flex-row gap-4">
        <!--
          Directly from npm
       -->
        <form class="grow mt-1 flex gap-2 items-end" @submit.prevent="addNpmPackage">
          <UFormGroup class="grow" label="Add a package from npm">
            <UInput v-model="npmInput" color="white" variant="outline" placeholder="nuxt, tailwindcss..." :ui="{ wrapper: 'grow' }" icon="i-simple-icons-npm" />
          </UFormGroup>
          <UButton color="primary" :disabled="!npmInput" size="sm" type="submit" :loading="npmLoading">
            Add
          </UButton>
        </form>

        <!--
        From GitHub to npm
        TODO: support user and organization by trying org and if fail try user (need to push a pr to ungh)
       -->
        <form class="grow mt-1 flex gap-2 items-end" @submit.prevent="addNpmPackagesFromGitHub">
          <UFormGroup class="grow" label="Add packages from GitHub">
            <UInput v-model="githubInput" color="white" variant="outline" placeholder="nuxt/nuxt, adonisjs..." :ui="{ wrapper: 'grow' }" icon="i-simple-icons-github" />
          </UFormGroup>
          <UButton color="primary" size="sm" type="submit" :disabled="!githubInput" :loading="githubLoading">
            Add
          </UButton>
        </form>
      </div>

      <template v-if="currentPackages.length">
        <UDivider class="my-4" />

        <Combobox v-model="selection" multiple by="name" as="template">
          <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." class="mb-2" />
          <ComboboxOptions static as="ol" class="grid xl:grid-cols-3 gap-2">
            <div v-if="!search.length" class="mt-2 text-center text-sm xl:col-span-3">
              <span>
                No results
              </span>
            </div>
            <template v-else-if="search.length">
              <li v-for="item in search" :key="item.name" class="w-full flex flex-row gap-1">
                <ComboboxOption v-slot="{ active, selected }" as="template" :value="item">
                  <UButton :ui="{ base: 'w-[calc(100%-2.25rem)]' }" :class="{ 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800': active }" color="gray" variant="ghost" :active="active" tabindex="-1">
                    <template #leading>
                      <NpmPackageLogo :name="item.name" />
                    </template>
                    <span class="text-start truncate w-full">
                      {{ item.name }}
                    </span>
                    <template v-if="selected" #trailing>
                      <span class="i-heroicons-check shrink-0" />
                    </template>
                  </UButton>
                </ComboboxOption>
                <UTooltip text="Delete">
                  <UButton color="red" variant="ghost" type="button" icon="i-heroicons-trash" @click="removeInternalPackage(item)" />
                </UTooltip>
              </li>
            </template>

            <div v-else class="text-center text-sm xl:col-span-3">
              <span>
                No results
              </span>
            </div>
          </ComboboxOptions>
        </Combobox>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <UButton type="button" variant="ghost" color="red" @click="removeAll">
            Remove all
          </UButton>
          <div class="flex justify-end gap-2">
            <UButton type="button" variant="ghost" color="red" @click="clear">
              Clear
            </UButton>
            <UButton type="button" @click="validate">
              Validate
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
