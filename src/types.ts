import type { AnyApiReferenceConfiguration } from '@scalar/types'

export type { AnyApiReferenceConfiguration } from '@scalar/types'

/** A single Scalar API Reference mounted at its own route. */
export type ScalarInstanceOptions = {
  /**
   * Route where the API Reference is mounted. Must be unique per plugin call.
   *
   * @default '/scalar'
   */
  route?: string

  /**
   * Passed to `Scalar.createApiReference`. Must include `url` or `sources`.
   *
   * @see https://github.com/scalar/scalar/blob/main/documentation/configuration.md
   */
  configuration: AnyApiReferenceConfiguration
}

/** Options for `pluginScalar(...)`. */
export type ScalarPluginOptions = {
  /** One or more API Reference instances. */
  instances: ScalarInstanceOptions[]

  /**
   * Pin a specific Scalar bundle version. One runtime is loaded per site.
   *
   * @default 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
   * @example 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.55.3'
   */
  cdn?: string
}
