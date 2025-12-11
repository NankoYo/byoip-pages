import { ref } from 'vue'
import { useRouter } from '#app'

const isLoading = ref(import.meta.client ? false : true)
const isTimeout = ref(false)
let minDone = false
let finished = false
let inFlight = false
let minTimer: ReturnType<typeof setTimeout> | null = null
let timeoutTimer: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  if (minTimer) { clearTimeout(minTimer); minTimer = null }
  if (timeoutTimer) { clearTimeout(timeoutTimer); timeoutTimer = null }
}

const close = () => {
  clearTimers()
  inFlight = false
  isLoading.value = false
}

const startLoading = () => {
  if (!import.meta.client) return
  if (inFlight) return
  inFlight = true
  isTimeout.value = false
  isLoading.value = true
  minDone = false
  finished = false
  clearTimers()
  minTimer = setTimeout(() => {
    minDone = true
    if (finished) close()
  }, 1000)
  timeoutTimer = setTimeout(() => {
    failLoading()
  }, 3000)
}

const finishLoading = () => {
  if (!import.meta.client) return
  finished = true
  if (minDone) close()
}

const failLoading = () => {
  if (!import.meta.client) return
  isTimeout.value = true
  close()
}

const reset = () => {
  isTimeout.value = false
}

const retry = () => {
  if (!import.meta.client) return
  const router = useRouter()
  reset()
  startLoading()
  router.replace(router.currentRoute.value.fullPath)
    .catch(() => {})
    .finally(() => { finishLoading() })
}

export const usePageLoading = () => {
  return { isLoading, isTimeout, startLoading, finishLoading, failLoading, retry }
}
