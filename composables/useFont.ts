interface SimpleFontManager {
  isFontLoaded: (family: string) => boolean
  loadFonts: () => Promise<void>
  getFontStatus: () => Record<string, boolean>
}

export const useFont = (): SimpleFontManager => {
  const loadedFonts = ref<Set<string>>(new Set())
  const isFontLoaded = (family: string): boolean => {
    if (typeof document === 'undefined') return false
    if (document.fonts) {
      for (const font of document.fonts) {
        if (font.family.includes(family)) {
          return font.status === 'loaded'
        }
      }
    }
    
    return loadedFonts.value.has(family)
  }

  const waitForFonts = async (): Promise<void> => {
    if (typeof document === 'undefined') return

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready
        console.log('All fonts loaded')
      }
      const fontFamilies = ['xiaolai', 'Cascadia Code']
      
      for (const family of fontFamilies) {
        if (document.fonts) {
          const available = document.fonts.check(`16px "${family}"`)
          if (available) {
            loadedFonts.value.add(family)
          }
        }
      }

      document.documentElement.classList.remove('fonts-loading')
      document.documentElement.classList.add('fonts-loaded')
      
    } catch (error) {
      console.warn('Font loading check failed:', error)
      document.documentElement.classList.remove('fonts-loading')
      document.documentElement.classList.add('fonts-fallback')
    }
  }

  const loadFonts = async (): Promise<void> => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.add('fonts-loading')
    await waitForFonts()
    setTimeout(async () => {
      await waitForFonts()
    }, 1000)
  }

  const getFontStatus = (): Record<string, boolean> => {
    return {
      'xiaolai': isFontLoaded('xiaolai'),
      'Cascadia Code': isFontLoaded('Cascadia Code')
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      loadFonts()
    })
  }

  return {
    isFontLoaded,
    loadFonts,
    getFontStatus
  }
}