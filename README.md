<div align="center">

<h1>Scalar API Reference Plugin for Rspress</h1>

<p>Render interactive <a href="https://scalar.com">Scalar</a> API Reference pages from an OpenAPI specification, inside your <a href="https://rspress.dev">Rspress</a> documentation site.</p>

<a href="https://www.npmjs.com/package/@seshuk/rspress-plugin-scalar"><img src="https://img.shields.io/npm/v/@seshuk/rspress-plugin-scalar?style=flat-square&logo=npm" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/@seshuk/rspress-plugin-scalar"><img src="https://img.shields.io/npm/dm/@seshuk/rspress-plugin-scalar?style=flat-square" alt="npm downloads" /></a>
<a href="https://github.com/maximseshuk/rspress-plugin-scalar/releases/"><img src="https://img.shields.io/github/v/release/maximseshuk/rspress-plugin-scalar?style=flat-square&logo=github" alt="GitHub release" /></a>
<a href="https://github.com/maximseshuk/rspress-plugin-scalar/blob/main/LICENSE"><img src="https://img.shields.io/github/license/maximseshuk/rspress-plugin-scalar?style=flat-square" alt="license" /></a>
<a href="https://ko-fi.com/V7V61UCT39"><img src="https://img.shields.io/badge/Ko--fi-Buy_me_a_coffee-ff5f5f?style=flat-square&logo=ko-fi&logoColor=white" alt="Ko-fi" /></a>

</div>

Mount one or more Scalar API Reference instances at custom routes of your Rspress site. The plugin inherits the host site's theme via shared CSS variables and follows the site's light/dark mode automatically.

## Features

- **Drop-in route** — declare a route, point it at an OpenAPI document, done.
- **Multiple instances** — serve several APIs (public, admin, internal) from one site with a single Scalar runtime.
- **Theme-aware** — light/dark mode follows Rspress; visual tokens inherit from the host theme.
- **CDN-loaded** — Scalar bundle is loaded from jsDelivr; pin a version when you need reproducibility.
- **Type-safe config** — configuration types are re-exported from `@scalar/types`.

## Installation

```bash
npm install @seshuk/rspress-plugin-scalar
# or
pnpm add @seshuk/rspress-plugin-scalar
# or
bun add @seshuk/rspress-plugin-scalar
```

> [!NOTE]
> Requires `@rspress/core` v2 and React 18 or 19 as peer dependencies.

## Usage

Register the plugin in your `rspress.config.ts`:

```ts
import { defineConfig } from '@rspress/core'
import { pluginScalar } from '@seshuk/rspress-plugin-scalar'

export default defineConfig({
  plugins: [
    pluginScalar({
      instances: [
        {
          route: '/scalar',
          configuration: {
            url: '/openapi.json',
          },
        },
      ],
    }),
  ],
})
```

The OpenAPI document referenced by `url` should be reachable from the site (for example, place `openapi.json` in your `public/` folder).

### Multiple instances

Serve several API references from one site — a single Scalar bundle is loaded and shared:

```ts
pluginScalar({
  instances: [
    { route: '/scalar', configuration: { url: '/openapi.json' } },
    { route: '/scalar-admin', configuration: { url: '/admin.json' } },
  ],
})
```

### Pin the Scalar version

By default the latest Scalar bundle is loaded from jsDelivr. Pin a version for reproducible builds:

```ts
pluginScalar({
  cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.55.3',
  instances: [{ route: '/scalar', configuration: { url: '/openapi.json' } }],
})
```

## Options

### `ScalarPluginOptions`

| Option      | Type                      | Default                                              | Description                                                           |
| ----------- | ------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| `instances` | `ScalarInstanceOptions[]` | —                                                    | Required. One or more API Reference instances. Routes must be unique. |
| `cdn`       | `string`                  | `https://cdn.jsdelivr.net/npm/@scalar/api-reference` | URL of the Scalar bundle. Pin a version for reproducibility.          |

### `ScalarInstanceOptions`

| Option          | Type                           | Default     | Description                                                                          |
| --------------- | ------------------------------ | ----------- | ------------------------------------------------------------------------------------ |
| `route`         | `string`                       | `'/scalar'` | Route at which the API Reference is mounted.                                         |
| `configuration` | `AnyApiReferenceConfiguration` | —           | Required. Forwarded to `Scalar.createApiReference`. Must include `url` or `sources`. |

See the [Scalar configuration reference](https://scalar.com/products/api-references/configuration) for the full list of configuration options.

### Defaults applied to every instance

The plugin merges these defaults into each instance's `configuration` (override per-instance as needed):

```ts
{
  hideTestRequestButton: true,
  hideDownloadButton: true,
  hideDarkModeToggle: true,
  hideClientButton: true,
  hideModels: true,
  showSidebar: true,
  showDeveloperTools: 'never',
  telemetry: false,
}
```

## Examples

- [snapr.seshuk.im/api.html](https://snapr.seshuk.im/api.html) — live API reference rendered with this plugin.

## How it works

- The plugin registers a custom page at each `route` via Rspress's `addPages` hook.
- Per-route configuration is attached through `extendPageData`, so a single page component resolves the correct config at runtime via `usePage()`.
- The Scalar runtime is injected as one `<script async>` tag in the document head — loaded once per site, shared by all instances.
- `theme.css` maps Scalar's CSS variables onto Rspress's theme tokens, and `useDark()` keeps the API reference in sync with the site's color scheme.

> [!TIP]
> Since the Scalar bundle is loaded from a CDN at runtime, your build output stays small and the API reference picks up upstream Scalar fixes without you having to bump a dependency.

## Development

```bash
pnpm install        # install deps
pnpm dev            # rebuild on change
pnpm build          # production build
pnpm lint           # oxlint
pnpm format         # oxfmt
```

## Links

- [Rspress](https://rspress.dev)
- [Scalar](https://scalar.com)
- [Scalar configuration reference](https://scalar.com/products/api-references/configuration)
