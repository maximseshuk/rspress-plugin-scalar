import type { RspressPlugin } from '@rspress/core'

import { normalizePosixPath, removeTrailingSlash } from '@rspress/core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { AnyApiReferenceConfiguration, ScalarPluginOptions } from './types.js'

export type { AnyApiReferenceConfiguration, ScalarInstanceOptions, ScalarPluginOptions } from './types.js'

const DEFAULT_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
const DEFAULT_ROUTE = '/scalar'
const PAGE_DATA_KEY = 'rspressPluginScalar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_CONFIGURATION: AnyApiReferenceConfiguration = {
  hideTestRequestButton: true,
  hideDownloadButton: true,
  hideDarkModeToggle: true,
  hideClientButton: true,
  hideModels: true,
  showSidebar: true,
  showDeveloperTools: 'never',
  telemetry: false,
}

const normalizeRoute = (route: string): string => {
  const withLeadingSlash = route.startsWith('/') ? route : `/${route}`
  return removeTrailingSlash(normalizePosixPath(withLeadingSlash)) || '/'
}

const hasSource = (cfg: AnyApiReferenceConfiguration): boolean => {
  if (Array.isArray(cfg)) return cfg.length > 0
  return Boolean('url' in cfg && cfg.url) || Boolean('sources' in cfg && cfg.sources)
}

/**
 * Render Scalar API Reference pages inside an Rspress site. Each instance
 * mounts at its own route and is fed by an OpenAPI document.
 *
 * @example
 * ```ts
 * pluginScalar({
 *   instances: [
 *     { route: '/scalar', configuration: { url: '/openapi.json' } },
 *   ],
 * })
 * ```
 */
export const pluginScalar = (options: ScalarPluginOptions): RspressPlugin => {
  if (!options?.instances || options.instances.length === 0) {
    throw new Error('rspress-plugin-scalar: `instances` must contain at least one entry')
  }

  const stylePath = path.join(__dirname, 'theme.css')
  const cdn = options.cdn ?? DEFAULT_CDN

  const seenRoutes = new Set<string>()
  const normalised = options.instances.map((inst, i) => {
    if (!inst?.configuration) {
      throw new Error(`rspress-plugin-scalar: instances[${i}].configuration is required`)
    }
    if (!hasSource(inst.configuration)) {
      throw new Error(`rspress-plugin-scalar: instances[${i}].configuration must provide either \`url\` or \`sources\``)
    }
    const route = normalizeRoute(inst.route ?? DEFAULT_ROUTE)
    if (seenRoutes.has(route)) {
      throw new Error(`rspress-plugin-scalar: duplicate route "${route}"`)
    }
    seenRoutes.add(route)
    return {
      route,
      configuration: {
        ...DEFAULT_CONFIGURATION,
        ...inst.configuration,
      },
    }
  })

  const pageContent = [
    '---',
    'pageType: custom',
    '---',
    '',
    "import ScalarPage from '@seshuk/rspress-plugin-scalar/runtime'",
    '',
    '<ScalarPage />',
    '',
  ].join('\n')

  return {
    name: 'rspress-plugin-scalar',
    globalStyles: stylePath,
    addPages() {
      return normalised.map((inst) => ({
        routePath: inst.route,
        content: pageContent,
      }))
    },
    extendPageData(pageData) {
      const match = normalised.find((i) => i.route === pageData.routePath)
      if (match) {
        ;(pageData as unknown as Record<string, unknown>)[PAGE_DATA_KEY] = {
          configuration: match.configuration,
        }
      }
    },
    builderConfig: {
      html: {
        tags: [
          {
            tag: 'script',
            attrs: { src: cdn, async: true },
            head: true,
            append: true,
            publicPath: false,
          },
        ],
      },
    },
  }
}

export default pluginScalar
