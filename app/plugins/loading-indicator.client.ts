import { useRouter, useNuxtApp } from '#app'

export default defineNuxtPlugin(async () => {
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  const { startLoading, finishLoading, failLoading } = usePageLoading()

  if (typeof window !== 'undefined' && (window as any).__FIRST_LOAD_DONE) {
    return
  }

  startLoading()

  nuxtApp.hook('page:finish', () => { finishLoading() })

  try {
    await router.isReady()
    finishLoading()
  } catch {
    failLoading()
  }

  router.beforeResolve(() => {
    if (typeof window !== 'undefined' && !(window as any).__FIRST_NAV_DONE) {
      startLoading()
    }
  })

  router.afterEach(() => {
    if (typeof window !== 'undefined' && !(window as any).__FIRST_NAV_DONE) {
      finishLoading()
      ;(window as any).__FIRST_NAV_DONE = true
    }
  })

  router.onError(() => {
    if (typeof window !== 'undefined' && !(window as any).__FIRST_NAV_DONE) {
      failLoading()
      ;(window as any).__FIRST_NAV_DONE = true
    }
  })

  if (typeof window !== 'undefined') {
    ;(window as any).__FIRST_LOAD_DONE = true
  }
})
