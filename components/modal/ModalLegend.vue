<script lang="ts" setup>
defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
}>()
</script>

<template>
  <AppModal
    :model-value="modelValue" title="Legend"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <Legend />
  </AppModal>
</template>
