<script lang="ts" setup>
const { data: pkg } = await useFetch('/api/packages')

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
const showChildren = ref<boolean>(false)
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

        <UCheckbox v-model="showChildren" label="Show children" name="children" />

        <UButton color="red" variant="outline" @click="resetSelection">
          Reset selection
        </UButton>
        <UButton color="primary" @click="selectAll">
          Select all
        </UButton>
      </div>

      <div class="flex gap-2">
        <div class="flex items-center gap-1">
          <span class="block rounded-full bg-yellow-500 w-2 h-2" />
          <span> Selected packages</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="block rounded-full bg-cyan-300 w-2 h-2" />
          <span> Packages </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="block rounded-full bg-pink-300 w-2 h-2" />
          <span> Used as dependencies </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="block rounded-full bg-purple-300 w-2 h-2" />
          <span> Used as devDependencies </span>
        </div>
      </div>

      <Relations
        :packages="pkg!" :selection="selected"
        :show-dependencies="showDependencies" :show-dev-dependencies="showDevDependencies" :show-children="showChildren"
      />
    </UPage>
  </UContainer>
</template>
