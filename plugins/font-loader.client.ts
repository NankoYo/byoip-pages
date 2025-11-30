export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  const initializeFonts = async () => {
    try {
    } catch (error) {
      console.warn('⚠️ 字体加载失败，使用后备字体:', error)
      document.documentElement.classList.add('fonts-fallback')
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFonts)
  } else {
    initializeFonts()
  }
})