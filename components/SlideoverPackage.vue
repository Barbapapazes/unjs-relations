<script lang="ts" setup>
import type { Package } from '~/types/packages'

const props = defineProps<{
  modelValue: boolean
  unjsPackages: Package[]
  package: Package | null
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'open:relations': [string]
}>()

const slideoverGitHubLink = computed(() => {
  if (!props.package)
    return null

  const isExternal = props.package.external

  if (isExternal)
    return null

  return getGitHubLink(props.package.name)
})

const slideoverNpmLink = computed(() => {
  if (!props.package)
    return null

  const isExternal = props.package.external

  if (!isExternal)
    return null

  return `https://www.npmjs.com/package/${props.package.name}`
})

/**
 * Will only be used by a UnJS package
 */
function getGitHubLink(packageName: string): string {
  const repoName = props.unjsPackages.find(p => p.name === packageName)?.title

  return `https://github.com/unjs/${repoName}`
}
</script>

<template>
  <USlideover :model-value="modelValue" @update:model-value="emits('update:modelValue', $event)">
    <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-zinc-100 dark:divide-zinc-800', header: { base: 'flex justify-between items-center' } }">
      <template #header>
        <h2 v-if="package" class="text-xl font-bold">
          {{ package.name }}
        </h2>

        <UButton v-if="slideoverGitHubLink" icon="i-simple-icons-github" label="View on GitHub" :to="slideoverGitHubLink" target="_blank" variant="ghost" color="gray" />
        <UButton v-if="slideoverNpmLink" icon="i-simple-icons-npm" label="View on npm" :to="slideoverNpmLink" target="_blank" variant="ghost" color="gray" />
      </template>

      <div class="prose">
        <p v-if="package">
          {{ package.description }}
        </p>

        <p>
          UnJS Dependencies:
        </p>
        <ul v-if="package?.dependencies.length">
          <li v-for="dep in package?.dependencies" :key="dep">
            <span class="not-prose flex items-center justify-between">
              <span>
                {{ dep }}
              </span>
              <span class="not-prose flex gap-2">
                <UTooltip text="View relations">
                  <UButton icon="i-heroicons-play" variant="ghost" color="gray" @click="emits('open:relations', dep)" />
                </UTooltip>
                <UButton icon="i-simple-icons-github" :to="getGitHubLink(dep)" target="_blank" variant="ghost" color="gray" />
              </span>
            </span>
          </li>
        </ul>
        <p v-else>
          <em>
            No dependencies
          </em>
        </p>

        <p>
          UnJS Dev dependencies:
        </p>
        <ul>
          <li v-for="dep in package?.devDependencies" :key="dep">
            <span class="not-prose flex items-center justify-between">
              <span>
                {{ dep }}
              </span>
              <span class="not-prose flex gap-2">
                <UTooltip text="View relations">
                  <UButton icon="i-heroicons-play" variant="ghost" color="gray" @click="emits('open:relations', dep)" />
                </UTooltip>
                <UButton icon="i-simple-icons-github" :to="getGitHubLink(dep)" target="_blank" variant="ghost" color="gray" />
              </span>
            </span>
          </li>
        </ul>
        <p v-if="!package?.devDependencies.length">
          <em>
            No devDependencies
          </em>
        </p>
      </div>
    </UCard>
  </USlideover>
</template>
