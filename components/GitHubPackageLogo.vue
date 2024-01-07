<script lang="ts" setup>
const props = defineProps<{
  name: string
}>()

// From @unjs/awesome to unjs
const organizationRegExp = /^@(.*)\//

const organization = computed(() => {
  if (!props.name.startsWith('@'))
    return props.name
  const match = props.name.match(organizationRegExp)
  return match?.length ? match[1] : null
})
</script>

<!-- TODO: remove support for iconify icon, explain why -->
<template>
  <UAvatar icon="i-simple-icons-github" :src="`https://api.iconify.design/logos/${organization}.svg`"  aria-hidden="true" size="xs" :ui="{ rounded: '', icon: { base: 'text-inherit dark:text-inherit', size: { xs: 'w-6 h-6' } } }" />
</template>
