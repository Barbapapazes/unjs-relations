<script lang="ts" setup>
import type { InternalPackage } from '~/types/packages'

const props = defineProps<{
  modelValue: boolean
  unjsPackages: InternalPackage[]
  package: InternalPackage | null
}>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  'open:relations': [string]
}>()

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
    <UCard v-if="package" class="h-screen flex flex-col flex-1" :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { base: 'flex justify-between items-center' } }">
      <template #header>
        <h2 class="text-xl font-bold">
          {{ package.name }}
        </h2>

        <UButton v-if="package.source === 'unjs'" aria-label="View on UnJS" :to="`https://unjs.io/${package.name}?utm_source=unjs-relations.barbapapazes.dev`" target="_blank" variant="ghost" color="gray">
          <template #leading>
            <UAvatar src="https://unjs.io/favicon.svg" alt="UnJS Logo" size="xs" :ui="{ rounded: 'rounded-sm' }" />
          </template>
        </UButton>
        <UButton v-if="package.source === 'npm'" icon="i-simple-icons-npm" aria-label="View on npm" :to="`https://npmjs.com/package/${package.name}`" target="_blank" variant="ghost" color="gray" />
      </template>

      <div class="prose dark:prose-invert">
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
