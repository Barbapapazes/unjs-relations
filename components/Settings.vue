<script lang="ts" setup>
const colorMode = useColorMode()
const toggleTheme = function () {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const route = useRoute()

// TODO: use an event to handle this at page level
function updateNavigation(queryName: string, value: string) {
  navigateTo({
    query: {
      ...route.query,
      [queryName]: value,
    },
  })
}

function onResetMenuPosition() {
  const defaultPosition = { x: 16, y: 16 }
  const storage = useLocalStorage('unjs-relations-menu', defaultPosition)
  storage.value = defaultPosition
}

const {
  showDependencies,
  showDevDependencies,
  showChildren,
} = getSettings()
</script>

<template>
  <div class="space-y-2">
    <h3 class="font-medium">
      Theme
    </h3>
    <UButton variant="ghost" color="gray" square :icon="$colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" aria-label="Toggle Theme" @click="toggleTheme">
      {{ $colorMode.value === 'dark' ? 'Light' : 'Dark' }}
    </UButton>
  </div>
  <div class="mt-4 space-y-2">
    <h3 class="font-medium">
      Graph
    </h3>
    <div class="flex flex-col gap-1">
      <UCheckbox
        :model-value="showDependencies"
        label="Show dependencies"
        name="dependencies" @update:model-value="updateNavigation('showDependencies', $event)"
      />
      <UCheckbox
        :model-value="showDevDependencies"
        label="Show devDependencies"
        name="devDependencies" @update:model-value="updateNavigation('showDevDependencies', $event)"
      />
      <UCheckbox
        :model-value="showChildren"
        label="Show children"
        name="children" @update:model-value="updateNavigation('showChildren', $event)"
      />
    </div>
  </div>
  <div class="mt-4 space-y-2">
    <h3 class="font-medium">
      Menu
    </h3>
    <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="onResetMenuPosition">
      Reset Position
    </UButton>
  </div>
</template>
