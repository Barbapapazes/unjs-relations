<script lang="ts" setup>
const { data: pkg } = await useFetch('/api/packages', { deep: false })

if (!pkg.value) {
  throw createError({
    statusCode: 404,
    message: 'Packages not found',
  })
}

const packages = computed(() => pkg.value!.map((p) => {
  return p.name
}).sort(),
)

const selected = ref<string[]>([])

function resetSelection() {
  selected.value = []
}

function selectAll() {
  selected.value = packages.value
}

const showDependencies = ref<boolean>(true)
const showDevDependencies = ref<boolean>(true)
const showChilds = ref<boolean>(false)
</script>

<template>
  <UContainer>
    <UPage>
      <div class="flex gap-2">
        <USelectMenu
          v-model="selected"
          multiple
          searchable
          searchable-placeholder="Search packages"
          placeholder="Select packages"
          :options="packages"
        />

        <UCheckbox v-model="showDependencies" label="Show dependencies" name="dependencies" />
        <UCheckbox v-model="showDevDependencies" label="Show devDependencies" name="devDependencies" />

        <UCheckbox v-model="showChilds" label="Show childs" name="childs" />

        <UButton color="red" variant="outline" @click="resetSelection">
          Reset selection
        </UButton>
        <UButton color="primary" @click="selectAll">
          Select all
        </UButton>
      </div>

      <Relations
        :packages="pkg!" :selection="selected"
        :show-dependencies="showDependencies" :show-dev-dependencies="showDevDependencies" :show-childs="showChilds"
      />
    </UPage>
  </UContainer>
</template>
