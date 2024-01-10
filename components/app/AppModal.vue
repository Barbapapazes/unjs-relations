<script lang="ts" setup>
defineProps<{
  title: string
  modelValue: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
}>()
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emits('update:modelValue', $event)">
    <UCard>
      <h2 class="text-xl font-semibold">
        {{ title }}
      </h2>
      <div class="absolute top-4 right-4">
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="emits('update:modelValue', false)" />
      </div>

      <div class="mt-4">
        <slot />
      </div>
    </UCard>
  </UModal>
</template>
