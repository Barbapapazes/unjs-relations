<script lang="ts" setup>
import type { Package } from '~/types/packages'

defineProps<{
  packages: Package[]
}>()
</script>

<template>
  <section class="flex flex-col">
    <h2 class="font-semibold mb-1">
      Manage UnJS Packages
    </h2>
    <PackagesList :packages="packages" />
  </section>
</template>
