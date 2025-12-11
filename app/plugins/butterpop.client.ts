import { ButterPop } from 'butterpop'

export default defineNuxtPlugin(async () => {
  if (import.meta.server) return

  ButterPop.configure({ autoInject: false })

  const { buildNpmUrl, getAvailableMirrors, config } = useCDN()
  const { loadCSS, preloadResource } = useResourceLoader()

  const version = '1.0.4'
  const cssPath = `butterpop.min.css`

  const primaryCss = buildNpmUrl('butterpop', version, cssPath)

  const mirrors = getAvailableMirrors()
  const mirrorsArr = Array.isArray(mirrors) ? mirrors : (typeof mirrors === 'string' && mirrors ? [mirrors] : [])
  const npmTemplate = config.value?.npm?.template

  const buildFromMirror = (mirror: string, path: string) => {
    return npmTemplate
      .replace('{{mirror}}', mirror)
      .replace('{{package}}', 'butterpop')
      .replace('{{version}}', version)
      .replace('{{path}}', path)
  }

  const cssFallbacks = mirrorsArr.map(m => buildFromMirror(m, cssPath))

  preloadResource(primaryCss, 'style')

  await loadCSS(primaryCss, { fallbackUrls: cssFallbacks, maxRetries: 2, retryDelay: 800, timeout: 5000 })
})
