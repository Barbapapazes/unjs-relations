<script lang="ts" setup>
const emits = defineEmits<{
  'update:settings': [boolean]
  'update:legend': [boolean]
  'update:unjs-packages': [boolean]
  'update:npm-packages': [boolean]
}>()

const menuStorage = useLocalStorage('unjs-relations-menu', { x: 16, y: 16 }, { listenToStorageChanges: true })
const menu = ref<HTMLElement | null>(null)
const menuHandle = ref<HTMLElement | null>(null)

const { style, position } = useDraggable(menu, {
  initialValue: { x: menuStorage.value.x, y: menuStorage.value.y },
  handle: menuHandle,
  preventDefault: true,
  onEnd(position) {
    menuStorage.value = position
  },
})

watch(menuStorage, (value) => {
  if (value.x !== position.value.x || value.y !== position.value.y)
    position.value = value
})
</script>

<template>
  <div ref="menu" class="fixed z-10" :style="style">
    <AppCard>
      <div class="mb-2 flex justify-between items-center gap-4">
        <div class="flex items-end gap-1">
          <h1 class="font-bold whitespace-nowrap">
            UnJS Relations
          </h1>
          <span>
            -
          </span>
          <NuxtLink to="https://github.com/barbapapazes" target="_blank" rel="noopener" class="whitespace-nowrap">
            Built by Estéban
          </NuxtLink>
        </div>
        <div ref="menuHandle" class="w-5 h-5 cursor-move i-heroicons-ellipsis-vertical">
          <span class="sr-only">
            Drag to move
          </span>
        </div>
      </div>

      <section>
        <h2 class="font-semibold dark:text-gray-200">
          Manage Packages
        </h2>
        <div class="mt-1 flex gap-2">
          <UButton variant="ghost" color="gray" @click="emits('update:unjs-packages', true)">
            <template #leading>
              <UAvatar src="https://unjs.io/favicon.svg" alt="UnJS Logo" size="xs" :ui="{ rounded: 'rounded-sm' }" />
            </template>
            UnJS
          </UButton>
          <UButton icon="i-simple-icons-npm" variant="ghost" color="gray" @click="emits('update:npm-packages', true)">
            npm
          </UButton>
        </div>
      </section>

      <section class="mt-2">
        <h2 class="font-semibold dark:text-gray-200">
          Misc
        </h2>
        <div class="mt-1 flex gap-2">
          <UButton icon="i-heroicons-cog-8-tooth" variant="ghost" color="gray" label="Settings" @click="emits('update:settings', true)" />
          <UButton icon="i-heroicons-tag" variant="ghost" color="gray" label="Legend" @click="emits('update:legend', true)" />
        </div>
      </section>
    </AppCard>
  </div>
</template>
