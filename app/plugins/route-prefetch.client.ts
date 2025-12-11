import { defineNuxtPlugin } from '#app'
import { useRouter, preloadRouteComponents } from '#imports'

export default defineNuxtPlugin(async () => {
  const router = useRouter()
  
  await router.isReady()
  const path = router.currentRoute.value.path
  
  if (path === '/') {
    setTimeout(() => {
      // 使用 Nuxt 提供的 preloadRouteComponents
      preloadRouteComponents('/partners').catch(() => {})
      preloadRouteComponents('/sponsor').catch(() => {})
      preloadRouteComponents('/about').catch(() => {})
      preloadRouteComponents('/privacy').catch(() => {})
      preloadRouteComponents('/notices').catch(() => {})
    }, 800)
  }
})
