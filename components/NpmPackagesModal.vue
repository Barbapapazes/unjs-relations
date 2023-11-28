<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { UInput } from '#components'
import type { Package } from '~/types/packages'

defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'selection': [Package[]]
}>()

function close() {
  emits('update:modelValue', false)
}

const packages = ref<Package[]>([])
const selection = ref<Package[]>([])

const toast = useToast()
const input = ref<string>('')
const loading = ref<boolean>(false)
// search for a package on npm using https://registry.npmjs.org/-/v1/search?text=nuxt
async function addPackage() {
  const packageName = input.value.trim()

  loading.value = true
  const { data, error } = await useFetch<Package>(`/api/npm/packages/${packageName}`)
  loading.value = false

  if (error.value) {
    if (error.value?.statusCode === 404) {
      toast.add({
        title: `'${packageName}' not found`,
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

  if (data.value && packages.value.findIndex(p => p.name === data.value!.name) === -1) {
    packages.value.push(data.value)
    selection.value.push(data.value)
    input.value = ''
  }
  else {
    toast.add({
      title: `'${packageName}' already added`,
      color: 'orange',
      timeout: 3000,
    })
  }
}

function getLogoURL(package_: Package): string {
  return `https://api.iconify.design/logos/${package_.name}-icon.svg`
}

const query = ref<string>('')
const search = computed(() => {
  return packages.value.filter(pkg => pkg.name.includes(query.value))
})

function removePackage(package_: Package) {
  packages.value = packages.value.filter(pkg => pkg.name !== package_.name)
  selection.value = selection.value.filter(pkg => pkg.name !== package_.name)
}

function clear() {
  selection.value = []
}

function validate() {
  emits('selection', selection.value)
  close()
}
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

      <section>
        <h3 class="text-sm">
          Add a package from npm
        </h3>

        <form class="mt-1 flex gap-2 items-end" @submit.prevent="addPackage">
          <UInput v-model="input" color="primary" variant="outline" placeholder="nuxt, tailwindcss, ..." :ui="{ wrapper: 'grow' }" />
          <UButton color="primary" :disabled="!input" size="sm" type="submit" :loading="loading">
            Add
          </UButton>
        </form>
      </section>

      <UDivider class="my-4" />

      <Combobox v-model="selection" multiple as="template">
        <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." class="mb-2" />
        <ComboboxOptions static as="ol" class="grid xl:grid-cols-3 gap-2">
          <div v-if="!search.length && !selection.length" class="text-center text-sm xl:col-span-3">
            <span>
              Start by adding a package
            </span>
          </div>
          <template v-else-if="search.length">
            <li v-for="item in search" :key="item.name" class="w-full flex flex-row gap-1">
              <ComboboxOption v-slot="{ active, selected }" as="template" :value="item">
                <UButton :ui="{ base: 'grow' }" :class="{ 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800': active }" color="gray" variant="ghost" :active="active" tabindex="-1">
                  <template #leading>
                    <UAvatar :src="getLogoURL(item)" aria-hidden="true" size="xs" :ui="{ rounded: '' }" />
                  </template>
                  <span class="grow text-start">
                    {{ item.name }}
                  </span>
                  <template v-if="selected" #trailing>
                    <span class="i-ph-check" />
                  </template>
                </UButton>
              </ComboboxOption>
              <UTooltip text="Delete">
                <UButton color="red" variant="ghost" type="button" icon="i-ph-trash" @click="removePackage(item)" />
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
