import { defineNuxtPlugin } from '#app'
import { useCDN } from '~/composables/useCDN'
import { useResourceLoader } from '~/composables/useResourceLoader'

const BUTTERPOP_GH_OWNER = 'FrecklyComb1728'
const BUTTERPOP_GH_REPO = 'ButterPop.js'
const BUTTERPOP_GH_BRANCH = '1.0.0'
const BUTTERPOP_JS_PATH = 'butterpop.min.js'
let butterpopInitPromise: Promise<void> | null = null

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  if (butterpopInitPromise) {
    return butterpopInitPromise
  }

  butterpopInitPromise = (async () => {
    const { buildGithubUrl } = useCDN()
    const { loadScript, preloadResource } = useResourceLoader()

    const jsUrl = buildGithubUrl(BUTTERPOP_GH_OWNER, BUTTERPOP_GH_REPO, BUTTERPOP_GH_BRANCH, BUTTERPOP_JS_PATH)

    preloadResource(jsUrl, 'script')

    await loadScript(jsUrl, { maxRetries: 2, retryDelay: 800, timeout: 5000 })

    if (typeof window !== 'undefined' && (window as any).ButterPop && typeof (window as any).ButterPop.configure === 'function') {
      ;(window as any).ButterPop.configure({ autoInject: false })
    }
  })()

  return butterpopInitPromise
})
