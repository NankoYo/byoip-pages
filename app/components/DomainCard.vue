<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
               :class="getProviderColor(service.provider)">
            {{ getProviderInitial(service.provider) }}
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 font-mixed">{{ service.name }}</h3>
          <p class="text-sm text-gray-500">{{ service.provider.toUpperCase() }}</p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 rounded-full" :class="getStatusColor(service.status)"></div>
          <span class="text-xs font-medium" :class="getStatusTextColor(service.status)">
            {{ getStatusText(service.status) }}
          </span>
        </div>
      </div>
    </div>

    <p class="text-gray-600 text-sm mb-4 font-chinese">{{ service.description }}</p>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full" :class="getNodeStatusColor(service.nodeStatus)"></div>
        <span class="text-sm text-gray-600">节点状态: {{ getNodeStatusText(service.nodeStatus) }}</span>
      </div>
      <div v-if="service.responseTime" class="text-sm text-gray-600 font-mixed">
        {{ service.responseTime }}ms
      </div>
    </div>

    <div class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">优选 IP 地址:</h4>
      <div v-if="service.optimizedIPs.length <= 1" class="space-y-2">
        <div v-for="(ip, index) in service.optimizedIPs" :key="index" 
             class="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
          <span class="text-sm font-mono text-gray-800 font-mixed">{{ ip }}</span>
          <button @click="copyToClipboard(ip)" 
                  class="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                  :class="{ 'text-green-600': copiedIP === ip }">
            {{ copiedIP === ip ? '已复制' : '复制' }}
          </button>
        </div>
      </div>

      <div v-else class="relative group">
         <div @click="toggleDropdown" ref="dropdownTrigger" class="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-2.5 transition-all duration-200 hover:shadow-md hover:border-blue-200">
             <div class="flex-1 min-w-0 mr-3">
                 <div class="text-sm font-mono text-gray-800 font-mixed whitespace-nowrap overflow-hidden relative" style="mask-image: linear-gradient(to right, black 85%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);">
                    {{ currentIp }}
                 </div>
             </div>

             <div class="flex items-center space-x-2 flex-shrink-0 relative">
                <div v-if="isSwitching" class="absolute right-full mr-3">
                    <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>

                <button 
                  @click.stop="toggleDropdown"
                  class="px-3 py-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100" 
                  title="切换域名"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                <button @click.stop="copyToClipboard(currentIp)" 
                      class="flex items-center px-2 py-2 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      :class="{ '!text-green-700 !bg-green-100': copiedIP === currentIp }">
                  <svg v-if="copiedIP === currentIp" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {{ copiedIP === currentIp ? '已复制' : '复制' }}
                </button>
             </div>
         </div>

         <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <div v-if="isDropdownOpen" 
                 ref="dropdownMenu"
                 class="absolute z-20 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden origin-top"
            >
                <div class="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-50 border-b border-gray-100">
                    选择优选域名
                </div>
                <div class="max-h-60 overflow-y-auto">
                    <button 
                        v-for="(ip, idx) in service.optimizedIPs" 
                        :key="idx"
                        @click="handleSwitch(idx)"
                        class="w-full text-left px-4 py-2.5 text-sm font-mono flex items-center justify-between group transition-colors hover:bg-blue-50"
                        :class="selectedIpIndex === idx ? 'bg-blue-50/50 text-blue-700' : 'text-gray-700'"
                    >
                        <span class="truncate">{{ ip }}</span>
                        <svg v-if="selectedIpIndex === idx" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </div>
         </transition>
      </div>
    </div>

    <div v-if="service.tags && service.tags.length > 0" class="flex flex-wrap gap-2">
      <span v-for="tag in service.tags" :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CDNServiceConfig } from '~/types'
import { ButterPop } from 'butterpop'
import { useNotices } from '~/composables/useNotices'

interface Props {
  service: CDNServiceConfig
}

const props = defineProps<Props>()
const domainPreferences = useCookie<Record<string, number>>('service-domain-prefs', {
  default: () => ({}),
  watch: true,
  maxAge: 60 * 60 * 24 * 365
})
const selectedIpIndex = ref(0)
const isSwitching = ref(false)

const isDropdownOpen = ref(false)
const dropdownTrigger = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (isDropdownOpen.value && 
      dropdownTrigger.value && 
      !dropdownTrigger.value.contains(event.target as Node) &&
      dropdownMenu.value &&
      !dropdownMenu.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  if (props.service.id && domainPreferences.value[props.service.id] !== undefined) {
    const savedIndex = domainPreferences.value[props.service.id]
    if (savedIndex >= 0 && savedIndex < props.service.optimizedIPs.length) {
      selectedIpIndex.value = savedIndex
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const currentIp = computed(() => {
  if (!props.service.optimizedIPs || props.service.optimizedIPs.length === 0) return ''
  return props.service.optimizedIPs[selectedIpIndex.value] || props.service.optimizedIPs[0]
})

const handleSwitch = (index: number) => {
  if (index === selectedIpIndex.value) {
    isDropdownOpen.value = false
    return
  }
  
  isSwitching.value = true
  selectedIpIndex.value = index
  isDropdownOpen.value = false
  
  if (props.service.id) {
    domainPreferences.value = {
      ...domainPreferences.value,
      [props.service.id]: index
    }
  }

  setTimeout(() => {
    isSwitching.value = false
  }, 300)
}


const copiedIP = ref<string | null>(null)
const { copySuccessConfig } = useNotices()

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedIP.value = text
    ButterPop.show(copySuccessConfig.value)
    setTimeout(() => {
      copiedIP.value = null
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copiedIP.value = text
    ButterPop.show(copySuccessConfig.value)
    setTimeout(() => {
      copiedIP.value = null
    }, 2000)
  }
}

const getProviderColor = (provider: string) => {
  const colors = {
    cloudflare: 'bg-orange-500',
    cloudfront: 'bg-yellow-600',
    vercel: 'bg-purple-600',
    netlify: 'bg-green-600',
    edgeone: 'bg-blue-600',
    other: 'bg-gray-500'
  }
  return colors[provider as keyof typeof colors] || colors.other
}

const getProviderInitial = (provider: string) => {
  const initials = {
    cloudflare: 'CF',
    cloudfront: 'CF',
    vercel: 'VC',
    netlify: 'NT',
    edgeone: 'EO',
    other: 'O'
  }
  return initials[provider as keyof typeof initials] || 'O'
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-500',
    inactive: 'bg-red-500',
    maintenance: 'bg-yellow-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

const getStatusTextColor = (status: string) => {
  const colors = {
    active: 'text-green-700',
    inactive: 'text-red-700',
    maintenance: 'text-yellow-700'
  }
  return colors[status as keyof typeof colors] || 'text-gray-700'
}

const getStatusText = (status: string) => {
  const texts = {
    active: '正常',
    inactive: '离线',
    maintenance: '维护中'
  }
  return texts[status as keyof typeof texts] || '未知'
}

const getNodeStatusColor = (nodeStatus: string) => {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    slow: 'bg-yellow-500'
  }
  return colors[nodeStatus as keyof typeof colors] || 'bg-gray-500'
}

const getNodeStatusText = (nodeStatus: string) => {
  const texts = {
    online: '在线',
    offline: '离线',
    slow: '缓慢'
  }
  return texts[nodeStatus as keyof typeof texts] || '未知'
}
</script>
