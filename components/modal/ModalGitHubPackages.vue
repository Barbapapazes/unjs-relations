<script lang="ts" setup>
import { UInput } from '#components'
import type { InternalPackage } from '~/types/packages'

const props = defineProps<{
  modelValue: boolean
  unjsPackages: InternalPackage[]
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'update:selection': [InternalPackage[]]
}>()

function close() {
  emits('update:modelValue', false)
}

// Used to update the selection when the parent changes

const store = useGitHubPackagesStore()

const input = ref<string>('')
const loading = ref<boolean>(false)
async function addPackages() {
  const name = input.value.trim().toLowerCase()

  loading.value = true
  const fetched = await store.fetch(name, props.unjsPackages, { mode: 'new' })
  // TODO: only fetch github files
  loading.value = false

  if (fetched) {
    // TODO: Update the npm store
    input.value = ''
  }
}

// In readme, explain how all of this works since it's a little tricky

function removeInternalPackage(internalPackage: InternalPackage) {
  store.remove(internalPackage.name)
}

const query = ref<string>('')
const search = computed(() => {
  return store.packages.filter(pkg => pkg.name.includes(query.value))
})

function clear() {
}

function validate() {
  emits('update:selection', store.packages)
  close()
}
</script>

<template>
  <UModal :model-value="modelValue" :ui="{ width: 'xl:max-w-3xl' }" @update:model-value="close">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2 class="font-semibold">
            Manage GitHub Packages
          </h2>
          <UButton type="button" aria-label="close" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="close" />
        </div>
      </template>

      <section>
        <div class="flex flex-row gap-2">
          <h3 class="text-sm">
            Add package(s) from GitHub
          </h3>
          <UTooltip text="Add all packages found in the repository or organization">
            <div class="i-heroicons-information-circle" />
          </UTooltip>
        </div>

        <form class="mt-1 flex gap-2 items-end" @submit.prevent="addPackages">
          <UInput v-model="input" color="primary" variant="outline" placeholder="nuxt/nuxt, analog, ..." :ui="{ wrapper: 'grow' }" />
          <UButton color="primary" :disabled="!input" size="sm" type="submit" :loading="loading">
            Add
          </UButton>
        </form>
      </section>

      <!-- TODO: Externalize to a component -->
      <template v-if="store.packages.length">
        <UDivider class="my-4" />

        <!-- <Combobox v-model="selection" multiple by="name" as="template">
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
                  <UButton :ui="{ base: 'grow' }" :class="{ 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800': active }" color="gray" variant="ghost" :active="active" tabindex="-1">
                    <template #leading>
                      <GitHubPackageLogo :name="item.name" />
                    </template>
                    <span class="grow text-start">
                      {{ item.name }}
                    </span>
                    <template v-if="selected" #trailing>
                      <span class="i-heroicons-check" />
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
        </Combobox> -->
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton type="button" variant="ghost" color="red" @click="clear">
            Clear
          </UButton>
          <UButton type="button" @click="validate">
            Validate
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
