<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  right?: boolean
  title?: string
  openClass?: string
  closeClass?: string
}>()

provide('right', props.right)

const isOpen = ref<boolean>(true)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <Transition mode="out-in" :name="right ? 'slide-right' : 'slide-left'">
    <Card v-if="isOpen" v-bind="$attrs" :class="openClass">
      <slot :close="close" />
    </Card>

    <Card v-else v-bind="$attrs" :class="closeClass">
      <UButton square size="xs" color="gray" variant="ghost" type="button" :icon="right ? 'i-ph-arrow-line-left' : 'i-ph-arrow-line-right'" aria-label="open card" @click="open" />
    </Card>
  </Transition>
</template>
