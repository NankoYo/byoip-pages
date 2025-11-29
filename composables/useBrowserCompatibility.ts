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

    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

    let name = 'Unknown'
    let version = 'Unknown'
    let engine = 'Unknown'

    // 检测浏览器
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      name = 'Chrome'
      const match = userAgent.match(/Chrome\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox'
      const match = userAgent.match(/Firefox\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Gecko'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      name = 'Safari'
      const match = userAgent.match(/Version\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'WebKit'
    } else if (userAgent.includes('Edg')) {
      name = 'Edge'
      const match = userAgent.match(/Edg\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      name = 'Internet Explorer'
      const match = userAgent.match(/(?:MSIE |rv:)(\d+)/)
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

    const support: CompatibilityFeatures = {
      webp: false,
      avif: false,
      intersectionObserver: 'IntersectionObserver' in window,
      performanceObserver: 'PerformanceObserver' in window,
      fontDisplay: CSS.supports('font-display', 'swap'),
      cssGrid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      customProperties: CSS.supports('--custom', 'property'),
      es6Modules: 'noModule' in document.createElement('script'),
      fetch: 'fetch' in window
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    support.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0

    checkAVIFSupport().then(avifSupported => {
      support.avif = avifSupported
      features.value = { ...support }
    })

    features.value = support
    return support
  }

  const checkAVIFSupport = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const avif = new Image()
      avif.onload = () => resolve(true)
      avif.onerror = () => resolve(false)
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })
  }

  const applyPolyfills = async (): Promise<void> => {
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
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }

  const optimizeForBrowser = (): void => {
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