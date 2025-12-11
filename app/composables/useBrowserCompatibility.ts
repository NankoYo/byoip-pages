interface BrowserInfo {
  name: string
  version: string
  engine: string
  platform: string
  mobile: boolean
}

interface CompatibilityFeatures {
  webp: boolean
  avif: boolean
  intersectionObserver: boolean
  performanceObserver: boolean
  fontDisplay: boolean
  cssGrid: boolean
  flexbox: boolean
  customProperties: boolean
  es6Modules: boolean
  fetch: boolean
}

interface BrowserCompatibilityManager {
  getBrowserInfo: () => BrowserInfo
  checkFeatureSupport: () => CompatibilityFeatures
  applyPolyfills: () => Promise<void>
  optimizeForBrowser: () => void
  isModernBrowser: () => boolean
  shouldUsePolyfills: () => boolean
}

export const useBrowserCompatibility = (): BrowserCompatibilityManager => {
  const browserInfo = ref<BrowserInfo | null>(null)
  const features = ref<CompatibilityFeatures | null>(null)

  const getBrowserInfo = (): BrowserInfo => {
    if (browserInfo.value) {
      return browserInfo.value
    }

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const platform = typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

    let name = 'Unknown'
    let version = 'Unknown'
    let engine = 'Unknown'

    // 检测浏览器
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'Chrome'
      const match = ua.match(/Chrome\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (ua.includes('Firefox')) {
      name = 'Firefox'
      const match = ua.match(/Firefox\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Gecko'
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'Safari'
      const match = ua.match(/Version\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'WebKit'
    } else if (ua.includes('Edg')) {
      name = 'Edge'
      const match = ua.match(/Edg\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (ua.includes('MSIE') || ua.includes('Trident')) {
      name = 'Internet Explorer'
      const match = ua.match(/(?:MSIE |rv:)(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Trident'
    }

    const info: BrowserInfo = {
      name,
      version,
      engine,
      platform,
      mobile
    }

    browserInfo.value = info
    return info
  }

  const checkFeatureSupport = (): CompatibilityFeatures => {
    if (features.value) {
      return features.value
    }

    const hasWindow = typeof window !== 'undefined'
    const hasDocument = typeof document !== 'undefined'
    const hasCSS = typeof CSS !== 'undefined'

    const support: CompatibilityFeatures = {
      webp: false,
      avif: false,
      intersectionObserver: hasWindow && 'IntersectionObserver' in window,
      performanceObserver: hasWindow && 'PerformanceObserver' in window,
      fontDisplay: hasCSS ? CSS.supports('font-display', 'swap') : false,
      cssGrid: hasCSS ? CSS.supports('display', 'grid') : false,
      flexbox: hasCSS ? CSS.supports('display', 'flex') : true,
      customProperties: hasCSS ? CSS.supports('--custom', 'property') : false,
      es6Modules: hasDocument ? 'noModule' in document.createElement('script') : false,
      fetch: hasWindow ? 'fetch' in window : false
    }

    if (hasDocument) {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      support.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }

    if (hasWindow) {
      checkAVIFSupport().then(avifSupported => {
        support.avif = avifSupported
        features.value = { ...support }
      })
    }

    features.value = support
    return support
  }

  const checkAVIFSupport = (): Promise<boolean> => {
    if (typeof Image === 'undefined') {
      return Promise.resolve(false)
    }
    return new Promise((resolve) => {
      const avif = new Image()
      avif.onload = () => resolve(true)
      avif.onerror = () => resolve(false)
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })
  }

  const applyPolyfills = async (): Promise<void> => {
    if (!import.meta.client) return
    const support = checkFeatureSupport()
    const polyfillsNeeded: string[] = []

    if (!support.intersectionObserver) {
      polyfillsNeeded.push('intersection-observer')
    }

    if (!support.fetch) {
      polyfillsNeeded.push('fetch')
    }

    if (!support.customProperties) {
      polyfillsNeeded.push('css-vars-ponyfill')
    }

    if (polyfillsNeeded.length > 0) {
      const polyfillUrl = `https://polyfill.io/v3/polyfill.min.js?features=${polyfillsNeeded.join(',')}`
      
      try {
        await loadScript(polyfillUrl)
        console.log('Polyfills loaded:', polyfillsNeeded)
      } catch (error) {
        console.warn('Failed to load polyfills:', error)
      }
    }
  }

  const loadScript = (src: string): Promise<void> => {
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Document is not available'))
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }

  const optimizeForBrowser = (): void => {
    if (!import.meta.client) return
    const browser = getBrowserInfo()
    const support = checkFeatureSupport()
    document.documentElement.classList.add(`browser-${browser.name.toLowerCase()}`)
    document.documentElement.classList.add(`engine-${browser.engine.toLowerCase()}`)
    
    if (browser.mobile) {
      document.documentElement.classList.add('mobile')
    }

    Object.entries(support).forEach(([feature, supported]) => {
      document.documentElement.classList.add(
        supported ? `supports-${feature}` : `no-${feature}`
      )
    })

    switch (browser.name) {
      case 'Safari':

        optimizeForSafari()
        break
      case 'Firefox':

        optimizeForFirefox()
        break
      case 'Internet Explorer':

        optimizeForIE()
        break
    }
  }

  const optimizeForSafari = (): void => {
    document.documentElement.style.scrollBehavior = 'auto'
    const style = document.createElement('style')
    style.textContent = `
      /* Safari font rendering fix */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Safari flexbox fixes */
      .flex-container {
        -webkit-flex-wrap: wrap;
      }
    `
    document.head.appendChild(style)
  }

  const optimizeForFirefox = (): void => {
    const style = document.createElement('style')
    style.textContent = `
      /* Firefox scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #888 #f1f1f1;
      }
    `
    document.head.appendChild(style)
  }

  const optimizeForIE = (): void => {
    document.documentElement.style.scrollBehavior = 'auto'
    console.warn('Internet Explorer detected. Some features may not work properly.')
    document.documentElement.classList.add('legacy-browser')
  }

  const isModernBrowser = (): boolean => {
    const browser = getBrowserInfo()
    const support = checkFeatureSupport()

    const modernCriteria = [
      support.es6Modules,
      support.fetch,
      support.customProperties,
      support.flexbox,
      browser.name !== 'Internet Explorer'
    ]
    
    return modernCriteria.every(criterion => criterion)
  }

  const shouldUsePolyfills = (): boolean => {
    return !isModernBrowser()
  }

  if (import.meta.client) {
    onMounted(() => {
      getBrowserInfo()
      checkFeatureSupport()
      optimizeForBrowser()

      if (shouldUsePolyfills()) {
        applyPolyfills()
      }
    })
  }

  return {
    getBrowserInfo,
    checkFeatureSupport,
    applyPolyfills,
    optimizeForBrowser,
    isModernBrowser,
    shouldUsePolyfills
  }
}
import { ref, onMounted } from 'vue'
