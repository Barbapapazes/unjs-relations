<script lang="ts" setup>
import { Combobox, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import type { Package } from '~/types/packages'

const props = defineProps<{
  packages: Package[]
}>()

// emits on new selection

function getLogo(packageName: Package): string {
  const logo = props.packages.find(p => p.name === packageName.name)?.title
  // TODO: handle external packages (voir si on peut se faire via un icon de l'api de iconify)
  return `https://unjs.io/assets/logos/${logo}.svg`
}

const query = ref<string>('')
const search = computed(() => {
  return props.packages.filter(pkg => pkg.name.includes(query.value))
})
</script>

<template>
  <Combobox multiple as="template">
    <!-- <ComboboxInput v-model="query" :as="UInput" color="primary" variant="outline" placeholder="Search a package..." /> -->
    <ComboboxOptions static as="ol" class="py-2 px-1 overflow-auto">
      <template v-if="search.length">
        <ComboboxOption v-for="item in search" :key="item.name" v-slot="{ active, selected }" as="template" :value="item">
          <li class="cursor-pointer px-1 py-1 w-full flex items-center justify-between rounded-md transition ease-in" :class="{ 'bg-gray-300/40': active }">
            <span class="flex items-center gap-2">
              <UAvatar :src="getLogo(item)" :alt="`Logo of ${item}`" size="xs" :ui="{ rounded: '' }" />
              <span>
                {{ item.name }}
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
</template>
