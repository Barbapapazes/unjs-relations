<script lang="ts" setup>
import type { NpmPackage, Package } from '~/types/packages'

defineProps<{
  packages: Package[]
}>()

const emits = defineEmits<{
  'addPackage': [NpmPackage]
}>()

const toast = useToast()

const input = ref<string>('')
const loading = ref<boolean>(false)

async function addPackage() {
  const packageName = input.value.trim()

  loading.value = true
  const { data, error } = await useFetch<{ package: NpmPackage }>(`https://unnpm.pages.dev/packages/${packageName}`)
  loading.value = false

  if (error.value) {
    if (error.value?.statusCode === 404) {
      toast.add({
        title: `'${packageName}' not found`,
        color: 'red',
        timeout: 3000,
      })
    }
    else {
      toast.add({
        title: 'Error',
        description: error.value?.message,
        color: 'red',
        timeout: 3000,
      })
    }
  }

  if (data.value) {
    emits('addPackage', data.value?.package)
    input.value = ''
  }
}
</script>

<template>
  <section class="flex flex-col">
    <h2 class="font-semibold mb-1">
      Manage External Packages
    </h2>
    <form class="mb-1 flex gap-2 items-end" @submit.prevent="addPackage">
      <UInput v-model="input" color="primary" variant="outline" placeholder="nuxt, tailwindcss, ..." :ui="{ wrapper: 'grow' }" />
      <UButton color="primary" :disabled="!input" size="sm" type="submit" :loading="loading">
        Add
      </UButton>
    </form>
    <PackagesList :packages="packages" />
  </section>
</template>
