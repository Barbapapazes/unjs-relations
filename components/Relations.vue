<script lang="ts" setup>
import type { Data, Edge, Options } from 'vis-network'
import { Network } from 'vis-network'

const props = defineProps<{
  packages: {
    name: string
    dependencies: string[]
    devDependencies: string[]
  }[]
  selection: string[]
  showDependencies: boolean
  showDevDependencies: boolean
  showUsedBy: boolean
}>()

const container = ref<HTMLElement>()

const data = computed<Data>(() => {
  const selectionNodes: Data['nodes'] = props.selection.map((select) => {
    return {
      id: select,
      label: select,
      group: 'selection',
    }
  })

  const packagesUsedBySelection = props.packages
  // Only get parents of selected packages
    .filter((pkg) => {
      if (!props.showUsedBy)
        return false

      if (props.showDependencies) {
      // Check if current package use any of the selected packages
        const hasUsedBy = pkg.dependencies.some((dep) => {
          return props.selection.includes(dep)
        })

        if (hasUsedBy)
          return true
      }

      if (props.showDevDependencies) {
      // Check if current package use any of the selected packages
        const hasUsedBy = pkg.devDependencies.some((dep) => {
          return props.selection.includes(dep)
        })

        if (hasUsedBy)
          return true
      }

      return false
    })
  // Remove dependencies and devDependencies that are not selected
    .map((pkg) => {
      return {
        ...pkg,
        dependencies: pkg.dependencies.filter((dep) => {
          return props.selection.includes(dep)
        }),
        devDependencies: pkg.devDependencies.filter((dep) => {
          return props.selection.includes(dep)
        }),
      }
    })

  // Find all related packages
  const relatedPackages = props.packages.filter((pkg) => {
    return props.selection.includes(pkg.name)
  })

  // Find all dependencies of related packages
  const allDeps = relatedPackages.flatMap((pkg) => {
    const deps = []

    if (props.showDependencies)
      deps.push(...pkg.dependencies)

    if (props.showDevDependencies)
      deps.push(...pkg.devDependencies)

    return deps
  })

  const parentsPackages = packagesUsedBySelection.map((pkg) => {
    return pkg.name
  })

  // Remove duplicates
  const withoutDuplicatesDeps = new Set([...allDeps, ...parentsPackages])

  // Remove selected packages (already in the graph)
  const withoutSelection = [...withoutDuplicatesDeps].filter((dep) => {
    return !props.selection.includes(dep)
  })

  const depsNodes: Data['nodes'] = withoutSelection.flatMap((dep) => {
    return {
      id: dep,
      label: dep,
      group: 'dependencies',
    }
  })

  const nodes: Data['nodes'] = [
    ...selectionNodes,
    ...depsNodes,
  ]

  const edges: Data['edges'] = [
    ...[...relatedPackages, ...packagesUsedBySelection].flatMap((pkg) => {
      const data: Edge[] = []

      if (props.showDependencies) {
        data.push(...pkg.dependencies.map((dep) => {
          return {
            from: pkg.name,
            to: dep,
            color: {
              color: '#f9a8d4', // pink-300
              highlight: '#ec4899', // pink-500
            },
            relation: 'dependencies',
            arrows: 'to',
          }
        }))
      }

      if (props.showDevDependencies) {
        data.push(...pkg.devDependencies.map((dep) => {
          return {
            from: pkg.name,
            to: dep,
            color: {
              color: '#d8b4fe', // pink-300
              highlight: '#a855f7', // pink-500
            },
            relation: 'devDependencies',
            arrows: 'to',
          }
        }))
      }

      return data
    }),
  ]

  return {
    nodes,
    edges,
  }
})

onMounted(() => {
  const options: Options = {
    nodes: {
      shape: 'dot',
      size: 16,
    },
    physics: {
      repulsion: {
        centralGravity: 0.7,
        springLength: 100,
        springConstant: 0.01,
      },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 200,
      },
    },
    groups: {
      selection: {
        color: {
          background: '#F7F1BD', // unjs-300
          border: '#ECDC5A', // unjs-500
          highlight: {
            background: '#F2E78C', // unjs-400
            border: '#D4C651', // unjs-600
          },
        },
      },
      dependencies: {
        color: {
          background: '#ecfeff', // cyan-50
          border: '#67e8f9', // cyan-300
          highlight: {
            background: '#cffafe', // cyan-100
            border: '#06b6d4', // cyan-500
          },
        },
      },
    },
  }

  const network = new Network(container.value!, data.value, options)

  watch(data, () => {
    network.setData(data.value)
  })
})
</script>

<template>
  <div id="container" ref="container" />
</template>

<style scoped>
#container {
  width: 100%;
  height: 80vh;
}
</style>
