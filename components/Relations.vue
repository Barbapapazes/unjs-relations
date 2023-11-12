<script lang="ts" setup>
import type { Data, Edge, Options } from 'vis-network'
import { Network } from 'vis-network'
import type { Package } from '~/types/packages'

const props = defineProps<{
  packages: Package[]
  selection: string[]
  showDependencies: boolean
  showDevDependencies: boolean
  showChildren: boolean
}>()

const emits = defineEmits<{
  'selectNode': [string]
}>()

const container = ref<HTMLElement>()

const data = computed<Data>(() => {
  /** Selection */
  const selectionNodes: Data['nodes'] = props.selection.map((select) => {
    return {
      id: select,
      label: select,
      image: `https://unjs.io/assets/logos/${select}.svg`,
      group: 'selection',
    }
  })

  const selectionPackages = props.packages.filter((pkg) => {
    return props.selection.includes(pkg.name)
  })

  // Use a condition to avoid unnecessary computation
  const selectionChildrenPackages: Package[] = []
  const selectionChildrenPackagesName: string[] = []
  if (props.showChildren) {
  /** Children */
    selectionChildrenPackages.push(...props.packages
    // Filter out packages that have not selected packages as dependencies or devDependencies
      .filter((pkg) => {
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
      }))

    selectionChildrenPackagesName.push(...selectionChildrenPackages.map((pkg) => {
      return pkg.name
    }))
  }

  /** Dependencies and Dev Dependencies */
  const allDependencies = [...selectionPackages, ...selectionChildrenPackages].flatMap((pkg) => {
    const deps = []

    // Add current package for selection children packages
    deps.push(pkg.name)

    if (props.showDependencies)
      deps.push(...pkg.dependencies)

    if (props.showDevDependencies)
      deps.push(...pkg.devDependencies)

    return deps
  })

  // Remove duplicates in all dependencies
  const dedupedAllDependencies = [...new Set(allDependencies)]

  // Remove selected packages from all dependencies since they are already in selection
  const dedupedWithoutSelectionAllDependencies = dedupedAllDependencies.filter((dep) => {
    return !props.selection.includes(dep)
  })

  const allDependenciesNodes: Data['nodes'] = dedupedWithoutSelectionAllDependencies.flatMap((dep) => {
    return {
      id: dep,
      label: dep,
      image: `https://unjs.io/assets/logos/${dep}.svg`,
      group: 'dependencies',
    }
  })

  const nodes: Data['nodes'] = [
    ...selectionNodes,
    ...allDependenciesNodes,
  ]

  // Order matters since we want to show the dependencies and devDependencies of the selected packages first (otherwise, some packages will not have all their dependencies shown)
  const dedupePackages = [...selectionPackages, ...selectionChildrenPackages].reduce((acc, pkg) => {
    const index = acc.findIndex((p) => {
      return p.name === pkg.name
    })

    if (index === -1)
      acc.push(pkg)

    return acc
  }, [] as Package[])

  const edges: Data['edges'] = [
    ...dedupePackages.flatMap((pkg) => {
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
      shape: 'circularImage',
      imagePadding: 6,
      size: 16,
    },
    edges: {
      arrows: {
        to: {
          scaleFactor: 0.2,
        },
      },
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
          background: '#F7F1BD', // yellow-300
          border: '#ECDC5A', // yellow-500
          highlight: {
            background: '#F2E78C', // yellow-400
            border: '#D4C651', // yellow-600
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

  network.on('doubleClick', ({ nodes }) => {
    emits('selectNode', nodes[0])
  })

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
  height: 100vh;
}
</style>
