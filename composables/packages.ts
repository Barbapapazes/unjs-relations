import myzod from 'myzod'
import type { NpmPackage, Package } from '~/types/packages'

export async function fetchUnJSPackages() {
  const data = await $fetch('/api/packages.json')

  const validatedData = myzod.array(myzod.object({
    name: myzod.string(),
    title: myzod.string(),
    external: myzod.boolean(),
    description: myzod.string().or(myzod.undefined()),
    dependencies: myzod.array(myzod.string()),
    devDependencies: myzod.array(myzod.string()),
  })).parse(data)

  // TODO: we could infer Package from the validation schema
  return validatedData as Package[]
}

//     {
//   "package": {
//     "name": "nitropack",
//     "version": "2.8.1",
//     "description": "Build and Deploy Universal JavaScript Servers",
//     "dependencies": {
//       "@cloudflare/kv-asset-handler": "^0.3.0",
//       "@netlify/functions": "^2.4.0",
//       "@rollup/plugin-alias": "^5.1.0",
//       "@rollup/plugin-commonjs": "^25.0.7",
//       "@rollup/plugin-inject": "^5.0.5",
//       "@rollup/plugin-json": "^6.0.1",
//       "@rollup/plugin-node-resolve": "^15.2.3",
//       "@rollup/plugin-replace": "^5.0.5",
//       "@rollup/plugin-terser": "^0.4.4",
//       "@rollup/plugin-wasm": "^6.2.2",
//       "@rollup/pluginutils": "^5.0.5",
//       "@types/http-proxy": "^1.17.14",
//       "@vercel/nft": "^0.24.3",
//       "archiver": "^6.0.1",
//       "c12": "^1.5.1",
//       "chalk": "^5.3.0",
//       "chokidar": "^3.5.3",
//       "citty": "^0.1.5",
//       "consola": "^3.2.3",
//       "cookie-es": "^1.0.0",
//       "defu": "^6.1.3",
//       "destr": "^2.0.2",
//       "dot-prop": "^8.0.2",
//       "esbuild": "^0.19.8",
//       "escape-string-regexp": "^5.0.0",
//       "estree-walker": "^3.0.3",
//       "etag": "^1.8.1",
//       "fs-extra": "^11.2.0",
//       "globby": "^14.0.0",
//       "gzip-size": "^7.0.0",
//       "h3": "^1.9.0",
//       "hookable": "^5.5.3",
//       "httpxy": "^0.1.5",
//       "is-primitive": "^3.0.1",
//       "jiti": "^1.21.0",
//       "klona": "^2.0.6",
//       "knitwork": "^1.0.0",
//       "listhen": "^1.5.5",
//       "magic-string": "^0.30.5",
//       "mime": "^3.0.0",
//       "mlly": "^1.4.2",
//       "mri": "^1.2.0",
//       "node-fetch-native": "^1.4.1",
//       "ofetch": "^1.3.3",
//       "ohash": "^1.1.3",
//       "openapi-typescript": "^6.7.1",
//       "pathe": "^1.1.1",
//       "perfect-debounce": "^1.0.0",
//       "pkg-types": "^1.0.3",
//       "pretty-bytes": "^6.1.1",
//       "radix3": "^1.1.0",
//       "rollup": "^4.6.0",
//       "rollup-plugin-visualizer": "^5.9.3",
//       "scule": "^1.1.0",
//       "semver": "^7.5.4",
//       "serve-placeholder": "^2.0.1",
//       "serve-static": "^1.15.0",
//       "std-env": "^3.5.0",
//       "ufo": "^1.3.2",
//       "uncrypto": "^0.1.3",
//       "unctx": "^2.3.1",
//       "unenv": "^1.8.0",
//       "unimport": "^3.6.0",
//       "unstorage": "^1.10.1"
//     },
//     "devDependencies": {
//       "@azure/functions": "^3.5.1",
//       "@cloudflare/workers-types": "^4.20231121.0",
//       "@types/aws-lambda": "^8.10.129",
//       "@types/estree": "^1.0.5",
//       "@types/etag": "^1.8.3",
//       "@types/fs-extra": "^11.0.4",
//       "@types/node-fetch": "^2.6.9",
//       "@types/semver": "^7.5.6",
//       "@types/serve-static": "^1.15.5",
//       "@vitest/coverage-v8": "1.0.0-beta.5",
//       "changelogen": "^0.5.5",
//       "edge-runtime": "^2.5.7",
//       "eslint": "^8.54.0",
//       "eslint-config-unjs": "^0.2.1",
//       "execa": "^8.0.1",
//       "expect-type": "^0.17.3",
//       "firebase-admin": "^11.11.1",
//       "firebase-functions": "^4.5.0",
//       "get-port-please": "^3.1.1",
//       "miniflare": "^2.14.1",
//       "prettier": "^3.1.0",
//       "typescript": "^5.3.2",
//       "unbuild": "^2.0.0",
//       "undici": "^5.28.1",
//       "vitest": "1.0.0-beta.5",
//       "xml2js": "^0.6.2"
//     },
//     "maintainers": [
//       {
//         "name": "pi0",
//         "email": "pyapar@gmail.com"
//       }
//     ]
//   }
// }

export async function fetchNpmPackage(name: string) {
  const data = await $fetch(`https://unnpm.pages.dev/packages/${name}`)

  const validatedData = myzod.object({
    package: myzod.object({
      name: myzod.string(),
      version: myzod.string(),
      description: myzod.string().or(myzod.undefined()),
      dependencies: myzod.object({}).allowUnknownKeys(),
      devDependencies: myzod.object({}).allowUnknownKeys(),
      maintainers: myzod.array(myzod.object({
        name: myzod.string(),
        email: myzod.string(),
      })),
    }),
  }).parse(data)

  return validatedData as { package: NpmPackage }
}

export function getRoutePackages(queryName: 'packages[]' | 'npm-packages[]') {
  const route = useRoute()

  const query = route.query[queryName]

  const packages = ref<string[] | null>(parseQuery(query))

  watch(() => route.query, () => {
    packages.value = parseQuery(route.query[queryName])
  })

  /**
   * If there is no query, we set packages to null (initial state)
   * If the query is an empty string, we set packages to an empty array (handle by vue-router)
   * If the query is the string 'null', we set packages to an empty array (handle in-app)
   * Otherwise, we set packages using the query
   */
  function parseQuery(query: unknown | unknown[] | null) {
    if (!query)
      return null

    if (query === '')
      return [] as string[]

    if (query === 'null')
      return [] as string[]

    return toArray<string>(query)
  }

  return packages
}
