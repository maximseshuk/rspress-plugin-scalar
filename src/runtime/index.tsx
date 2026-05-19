import type { AnyApiReferenceConfiguration, CreateApiReference } from '@scalar/types'

import { useDark, usePage } from '@rspress/core/runtime'
import { useEffect, useRef, useState } from 'react'

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
  const [mounted, setMounted] = useState(false)

  const data = (page.page as unknown as Record<string, PageScalarData | undefined>)[PAGE_DATA_KEY]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !ref.current || !data) return
    let cancelled = false
    const start = () => {
      if (cancelled || !ref.current || !window.Scalar) return
      ref.current.innerHTML = ''
      window.Scalar.createApiReference(ref.current, {
        ...data.configuration,
        darkMode: dark,
        forceDarkModeState: dark ? 'dark' : 'light',
      })
    }
    if (window.Scalar) {
      start()
    } else {
      const id = window.setInterval(() => {
        if (window.Scalar) {
          window.clearInterval(id)
          start()
        }
      }, 50)
      return () => {
        cancelled = true
        window.clearInterval(id)
      }
    }
    return () => {
      cancelled = true
    }
  }, [dark, data, mounted])

  if (!mounted) return null
  return <div ref={ref} />
}

export default ScalarPage
