<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { UInput } from '#components'
import type { Package } from '~/types/packages'

const props = defineProps<{
  modelValue: boolean
  packages: Package[]
}>()

const emits = defineEmits<{
  'update:model-value': [boolean]
  'selection': [Package[]]
}>()

function getLogoURL(package_: Package): string {
  return `https://unjs.io/assets/logos/${package_.title}.svg`
}

const query = ref<string>('')
const search = computed(() => {
  return props.packages.filter(pkg => pkg.name.includes(query.value))
})

const selection = ref<Package[]>([])

function close() {
  emits('update:model-value', false)
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
  <UModal :model-value="modelValue" :ui="{ width: 'xl:max-w-2xl' }" @update:model-value="close">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <h2 class="font-semibold">
            Manage UnJS Packages
          </h2>
          <UButton type="button" aria-label="close" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="close" />
        </div>
      </template>

      <Combobox v-model="selection" multiple as="template">
        <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." class="mb-2" />
        <ComboboxOptions static as="ol" class="grid xl:grid-cols-3 gap-2">
          <template v-if="search.length">
            <ComboboxOption v-for="item in search" :key="item.name" v-slot="{ active, selected }" as="template" :value="item">
              <li class="w-full">
                <UButton :ui="{ base: 'w-full' }" :class="{ 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800': active }" color="gray" variant="ghost" :active="active" tabindex="-1">
                  <template #leading>
                    <UAvatar :src="getLogoURL(item)" :alt="`Logo of ${item}`" size="xs" :ui="{ rounded: '' }" />
                  </template>
                  <span class="grow text-start">
                    {{ item.name }}
                  </span>
                  <template v-if="selected" #trailing>
                    <span class="i-ph-check" />
                  </template>
                </UButton>
              </li>
            </ComboboxOption>
          </template>
          <div v-else class="text-center xl:col-span-3">
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
