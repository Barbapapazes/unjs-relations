<script setup lang="ts">
const { metaSymbol } = useShortcuts()
</script>

<template>
  <section class="prose dark:prose-invert">
    <p>
      Welcome to UnJS Relations, a tool to help you visualize the interdependencies between packages in the <NuxtLink
        class="inline-block"
        rel="noopener"
        to="https://unjs.io"
      >
        UnJS
      </NuxtLink> ecosystem and with other packages.
    </p>
    <p>
      <NuxtLink
        class="inline-block"
        rel="noopener"
        to="https://unjs.io"
      >
        UnJS
      </NuxtLink> is a large and <strong>complex ecosystem</strong>. It's not easy to get to grips with, to understand and can be very intimidating, especially for beginners.
    </p>
    <p>
      Despite this, it's very <strong>powerful</strong>, with packages that can be integrated into all your projects. Understanding and visualizing the links between the different packages could help you to <strong>better understand</strong> how the ecosystem is composed and articulated.
    </p>
    <p>
      You can use multiple shortcuts to navigate through the interface:
      <ul>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>h</kbd> toggle the menu
        </li>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>i</kbd> toggle the info
        </li>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>l</kbd> toggle the legend
        </li>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>s</kbd> toggle the settings
        </li>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>u</kbd> toggle the UnJS manage packages
        </li>
        <li>
          <kbd>{{ metaSymbol }}</kbd> + <kbd>n</kbd> toggle the NPM manage packages
        </li>
      </ul>
    </p>
    <p>
      Built by <NuxtLink
        class="inline-block"
        rel="noopener"
        to="https://github.com/barbapapazes"
      >
        Estéban (Barbapapazes)
      </NuxtLink>, this tool is <strong>open source</strong> and <strong>free</strong>. You can find the source code on <NuxtLink
        class="inline-block"
        rel="noopener"
        to="https://github.com/barbapapazes/unjs-relations"
      >
        GitHub
      </NuxtLink>.
    </p>
  </section>
</template>
