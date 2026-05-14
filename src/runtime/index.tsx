import type { AnyApiReferenceConfiguration, CreateApiReference } from '@scalar/types'

import { useDark, usePage } from '@rspress/core/runtime'
import { useEffect, useRef } from 'react'

interface PageScalarData {
  configuration: AnyApiReferenceConfiguration
}

const PAGE_DATA_KEY = 'rspressPluginScalar'

declare global {
  interface Window {
    Scalar?: { createApiReference: CreateApiReference }
  }
}

export const ScalarPage = () => {
  const dark = useDark()
  const page = usePage()
  const ref = useRef<HTMLDivElement>(null)

  const data = (page.page as unknown as Record<string, PageScalarData | undefined>)[PAGE_DATA_KEY]

  useEffect(() => {
    if (!window.Scalar || !ref.current || !data) return
    ref.current.innerHTML = ''
    window.Scalar.createApiReference(ref.current, {
      ...data.configuration,
      darkMode: dark,
      forceDarkModeState: dark ? 'dark' : 'light',
    })
  }, [dark, data])

  return <div ref={ref} />
}

export default ScalarPage
