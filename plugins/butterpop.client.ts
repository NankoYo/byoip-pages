export default defineNuxtPlugin(async () => {
  if (import.meta.server) return

  const { buildNpmUrl, getAvailableMirrors, config } = useCDN()
  const { loadCSS, loadScript, preloadResource } = useResourceLoader()

  const version = '1.0.4'
  const cssPath = 'butterpop.min.css'
  const jsPath = 'butterpop.min.js'

  const primaryCss = buildNpmUrl('butterpop', version, cssPath)
  const primaryJs = buildNpmUrl('butterpop', version, jsPath)

  const mirrors = getAvailableMirrors()
  const mirrorsArr = Array.isArray(mirrors) ? mirrors : (typeof mirrors === 'string' && mirrors ? [mirrors] : [])
  const npmTemplate = config.value?.npm?.template || 'https://{{mirror}}/npm/{{package}}@{{version}}/{{path}}'

  const buildFromMirror = (mirror: string, path: string) => {
    return npmTemplate
      .replace('{{mirror}}', mirror)
      .replace('{{package}}', 'butterpop')
      .replace('{{version}}', version)
      .replace('{{path}}', path)
  }

  const cssFallbacks = mirrorsArr.map(m => buildFromMirror(m, cssPath))
  const jsFallbacks = mirrorsArr.map(m => buildFromMirror(m, jsPath))

  preloadResource(primaryCss, 'style')
  preloadResource(primaryJs, 'script')

  await loadCSS(primaryCss, { fallbackUrls: cssFallbacks, maxRetries: 2, retryDelay: 800, timeout: 10000 })
  await loadScript(primaryJs, { fallbackUrls: jsFallbacks, maxRetries: 2, retryDelay: 800, timeout: 10000 })
})
