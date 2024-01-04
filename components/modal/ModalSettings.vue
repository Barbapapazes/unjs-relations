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
    :model-value="modelValue" title="Settings"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <AppSettings />
  </AppModal>
</template>
