<script lang="ts" setup>
import type { Data, Edge, Options } from 'vis-network'
import { Network } from 'vis-network'
import type { Package } from '~/types/packages'
import { _cyan, _pink, _violet, _yellow } from '#tailwind-config/theme/colors'

const props = defineProps<{
  packages: Package[]
  selection: Package[]
}>()

const emits = defineEmits<{
  'selectNode': [Package]
}>()

const {
  showDependencies,
  showDevDependencies,
  showChildren,
} = getSettings()

const selectionNames = computed<string[]>(() => {
  return props.selection.map((select) => {
    return select.name
  })
})

const container = ref<HTMLElement>()

const data = computed<Data>(() => {
  /** Selection */
  const selectionNodes: Data['nodes'] = props.selection.map((select) => {
    return {
      id: select.name,
      label: select.name,
      brokenImage: 'https://api.iconify.design/simple-icons/npm.svg',
      image: select.external ? `https://api.iconify.design/logos/${select.name}-icon.svg` : `https://unjs.io/assets/logos/${select.title}.svg`,
      group: 'selection',
    }
  })

  // Use a condition to avoid unnecessary computation
  const selectionChildrenPackages: Package[] = []
  const selectionChildrenPackagesName: string[] = []
  if (showChildren.value) {
  /** Children */
    selectionChildrenPackages.push(...props.packages
    // Filter out packages that have not selected packages as dependencies or devDependencies
      .filter((pkg) => {
        if (showDependencies.value) {
          // Check if current package use any of the selected packages
          const hasUsedBy = pkg.dependencies.some((dep) => {
            return selectionNames.value.includes(dep)
          })

          if (hasUsedBy)
            return true
        }

        if (showDependencies.value) {
          // Check if current package use any of the selected packages
          const hasUsedBy = pkg.devDependencies.some((dep) => {
            return selectionNames.value.includes(dep)
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
            return selectionNames.value.includes(dep)
          }),
          devDependencies: pkg.devDependencies.filter((dep) => {
            return selectionNames.value.includes(dep)
          }),
        }
      }))

    selectionChildrenPackagesName.push(...selectionChildrenPackages.map((pkg) => {
      return pkg.name
    }))
  }

  /** Dependencies and Dev Dependencies */
  const allDependencies = [...props.selection, ...selectionChildrenPackages].flatMap((pkg) => {
    const deps = []

    // Add current package for selection children packages
    deps.push(pkg.name)

    if (showDependencies.value)
      deps.push(...pkg.dependencies)

    if (showDevDependencies.value)
      deps.push(...pkg.devDependencies)

    return deps
  })

  // Remove duplicates in all dependencies
  const dedupedAllDependencies = [...new Set(allDependencies)]

  // Remove selected packages from all dependencies since they are already in selection
  const dedupedWithoutSelectionAllDependencies = dedupedAllDependencies.filter((dep) => {
    return !selectionNames.value.includes(dep)
  })

  const allDependenciesNodes: Data['nodes'] = dedupedWithoutSelectionAllDependencies.flatMap((dep) => {
    const logo = props.packages.find((pkg) => {
      return pkg.name === dep
    })?.title

    return {
      id: dep,
      label: dep,
      image: `https://unjs.io/assets/logos/${logo}.svg`,
      group: 'dependencies',
    }
  })

  const nodes: Data['nodes'] = [
    ...selectionNodes,
    ...allDependenciesNodes,
  ]

  // Order matters since we want to show the dependencies and devDependencies of the selected packages first (otherwise, some packages will not have all their dependencies shown)
  const dedupePackages = [...props.selection, ...selectionChildrenPackages].reduce((acc, pkg) => {
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

      if (showDependencies.value) {
        data.push(...pkg.dependencies.map((dep) => {
          return {
            from: pkg.name,
            to: dep,
            color: {
              color: _pink[300],
              highlight: _pink[500],
            },
            relation: 'dependencies',
            arrows: 'to',
          }
        }))
      }

      if (showDevDependencies.value) {
        data.push(...pkg.devDependencies.map((dep) => {
          return {
            from: pkg.name,
            to: dep,
            color: {
              color: _violet[300],
              highlight: _violet[500],
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
          background: _yellow[300],
          border: _yellow[500],
          highlight: {
            background: _yellow[400],
            border: _yellow[600],
          },
        },
      },
      dependencies: {
        color: {
          background: _cyan[50],
          border: _cyan[300],
          highlight: {
            background: _cyan[100],
            border: _cyan[500],
          },
        },
      },
    },
  }

  const network = new Network(container.value!, data.value, options)

  network.on('doubleClick', ({ nodes }) => {
    const package_ = [...props.packages, ...props.selection].find((pkg) => {
      return pkg.name === nodes[0]
    }) as Package
    emits('selectNode', package_)
  })

  watch(data, () => {
    network.setData(data.value)
  })
})
</script>

<template>
  <div ref="container" />
</template>
