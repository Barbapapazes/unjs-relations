<script lang="ts" setup>
import type { Settings } from '~/types/settings'

const props = defineProps<{ settings: Settings }>()

const emits = defineEmits<{
  'change': [Settings]
}>()

const emit = function (field: keyof Settings, data: boolean) {
  emits('change', {
    ...props.settings,
    [field]: data,
  })
}
</script>

<template>
  <UCheckbox :model-value="settings.dependencies" label="Show dependencies" name="dependencies" @update:model-value="emit('dependencies', $event)" />
  <UCheckbox :model-value="settings.devDependencies" label="Show devDependencies" name="devDependencies" @update:model-value="emit('devDependencies', $event)" />
  <UCheckbox :model-value="settings.children" label="Show children" name="children" @update:model-value="emit('children', $event)" />
</template>
