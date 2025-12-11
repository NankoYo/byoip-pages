import { computed } from 'vue'
import { useRuntimeConfig } from '#app'

export interface NoticeItem {
  id: string
  notice: string | boolean 
  time: string 
  message: string
  type?: string
  position?: string
  theme?: string
  duration?: number
  progress?: boolean
  closable?: boolean
  pauseOnHover?: boolean
  closeOnClick?: boolean
  preventDuplicates?: boolean
}

export interface CopySuccessConfig {
  message: string
  type?: string
  position?: string
  theme?: string
  duration?: number
  progress?: boolean
  closable?: boolean
  pauseOnHover?: boolean
  closeOnClick?: boolean
}

export const useNotices = () => {
  const runtimeConfig = useRuntimeConfig()
  const config = (runtimeConfig.public.appConfig as any)?.butterpop || { notices: [], copySuccess: {} }

  const notices = computed<NoticeItem[]>(() => {
    const raw = config.notices || []
    
    return [...raw].sort((a, b) => {
      const dateA = new Date(a.time).getTime()
      const dateB = new Date(b.time).getTime()
      return dateB - dateA
    })
  })

  const activeNotices = computed(() => {
    return notices.value.filter(item => String(item.notice) === 'true')
  })

  const historyNotices = computed(() => {
    return notices.value
  })

  const copySuccessConfig = computed<CopySuccessConfig>(() => {
    return config.copySuccess || {
      message: '已成功复制',
      type: 'success',
      duration: 2000,
    }
  })

  return {
    notices,
    activeNotices,
    historyNotices,
    copySuccessConfig
  }
}
