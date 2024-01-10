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
    :model-value="modelValue" title="Info"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <Info />
  </AppModal>
</template>
