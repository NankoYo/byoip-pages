export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const { loadFonts, isFontLoaded } = useFont()
  const initializeFonts = async () => {
    try {
      document.documentElement.classList.add('fonts-loading')
      await loadFonts()
      const fontsLoaded = isFontLoaded('xiaolai') && isFontLoaded('Cascadia Code')
      
      if (fontsLoaded) {
        document.documentElement.classList.remove('fonts-loading')
        document.documentElement.classList.add('fonts-loaded')
        console.log('✅ 自定义字体加载成功')
      } else {
        throw new Error('部分字体加载失败')
      }
    } catch (error) {
      console.warn('⚠️ 字体加载失败，使用后备字体:', error)
      document.documentElement.classList.remove('fonts-loading')
      document.documentElement.classList.add('fonts-fallback')
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFonts)
  } else {
    initializeFonts()
  }

  return {
    provide: {
      fontLoader: {
        loadFonts,
        isFontLoaded
      }
    }
  }
})