<template>
  <div class="font-mixed font-bold navigation-link">
    <nav class="bg-white border-b border-gray-200 py-2.5 md:py-3 px-3 fixed top-0 left-0 right-0 z-10">
      <div class="max-w-[1200px] mx-auto flex items-center justify-between px-2 sm:px-4 md:px-4">
        <a href="/" @click="handleNavigation('/', $event)" class="font-bold text-gray-800 no-underline text-base md:text-lg hover:text-blue-500 flex items-center min-w-0 gap-1">
          <img src="/favicon.ico" alt="favicon" class="inline-block w-6 h-6 mr-1 align-middle" />
          <span class="truncate">NB 优选服务</span>
        </a>

        <div class="hidden md:flex flex-1 items-center justify-center gap-1">
          <a
            v-for="link in navigationLinks"
            :key="link.path"
            :href="link.path"
            @click="handleNavigation(link.path, $event)"
            class="navigation-link text-gray-500 no-underline !py-1.5 !px-3 rounded-md font-medium hover:text-blue-500 hover:bg-gray-100"
            :class="route.path === link.path ? 'link-active' : ''"
          >
            {{ link.label }}
          </a>
        </div>

        <div class="flex items-center gap-2">
          <button
            ref="menuTrigger"
            @click="toggleMobileMenu"
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            aria-label="打开导航菜单"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="relative">
            <button
              ref="qqTrigger"
              @click="toggleQQ"
              class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow group"
              type="button"
            >
              <img :src="qqIcon" alt="QQ" class="w-4 h-4 transition-transform group-hover:scale-110" />
              <span class="hidden sm:inline">加入QQ交流群</span>
            </button>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <div v-if="isQQOpen" ref="qqPopover" class="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-80 bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50 max-h-[70vh] overflow-auto">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 text-gray-800 font-medium">
                  <img :src="qqIcon" alt="QQ" class="w-5 h-5" />
                  <span>加入 QQ 交流群</span>
                </div>
                <button @click="isQQOpen = false" class="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="space-y-3">
                <div class="rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-700">URL 加入</span>
                    <div class="flex items-center gap-2">
                      <button @click="copyToClipboard(groupUrl)" :disabled="!groupUrl" class="px-2.5 py-1.5 text-xs rounded border border-blue-200 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">复制链接</button>
                      <button @click="openUrl" :disabled="!groupUrl" class="px-2.5 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">打开</button>
                    </div>
                  </div>
                  <div class="text-xs font-mono text-gray-600 truncate">{{ groupUrl }}</div>
                </div>

                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="text-sm text-gray-700 mb-2">扫码加入</div>
                  <img src="/images/qrcode.png" alt="QQ 二维码" class="w-full h-auto rounded-md border" />
                </div>

                <div class="rounded-lg border border-gray-200 p-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-700">群号加入</div>
                      <div class="text-sm font-mono text-gray-900">{{ groupNumber }}</div>
                    </div>
                    <button @click="copyToClipboard(groupNumber)" class="px-2.5 py-1.5 text-xs rounded border border-blue-200 text-blue-600 hover:bg-blue-100">复制</button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          </div>
        </div>
      </div>

      <transition enter-active-class="transition ease-out duration-150" enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="transform opacity-100 translate-y-0" leave-to-class="transform opacity-0 -translate-y-2">
        <div v-if="isMobileMenuOpen" ref="menuPanel" class="md:hidden mt-2 px-1 sm:px-2 pb-2">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <a
              v-for="link in navigationLinks"
              :key="link.path"
              :href="link.path"
              @click="handleMobileNavigation(link.path, $event)"
              class="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="route.path === link.path ? 'text-blue-600 bg-blue-50/60' : ''"
            >
              <span>{{ link.label }}</span>
              <svg v-if="route.path === link.path" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </a>
          </div>
        </div>
      </transition>
    </nav>
    <div class="h-12"></div>
  </div>
</template>

<script setup lang="ts">
import qqIcon from '~/assets/icons/qq.svg'
import { useNotices } from '~/composables/useNotices'

// 导航链接配置
const navigationLinks = [
  { path: '/', label: '首页' },
  { path: '/notices', label: '公告' },
  { path: '/partners', label: '合作伙伴' },
  { path: '/sponsor', label: '赞助商' },
  { path: '/about', label: '关于我们' },
  { path: '/privacy', label: '隐私政策' },
]

const route = useRoute()

// 处理导航点击
const handleNavigation = async (to: string, event: Event) => {
  if (route.path === to) {
    event.preventDefault()
    return
  }
  
  // 阻止默认行为并导航
  event.preventDefault()
  await navigateTo(to)
}

const { copySuccessConfig } = useNotices()
const isQQOpen = ref(false)
const isMobileMenuOpen = ref(false)
const qqTrigger = ref<HTMLElement | null>(null)
const qqPopover = ref<HTMLElement | null>(null)
const menuTrigger = ref<HTMLElement | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
const groupNumber = '156102689'
const groupUrl = ref('https://qm.qq.com/q/sNnRfLmM9O')

const toggleQQ = () => {
  isMobileMenuOpen.value = false
  isQQOpen.value = !isQQOpen.value
}

const toggleMobileMenu = () => {
  isQQOpen.value = false
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleMobileNavigation = async (to: string, event: Event) => {
  await handleNavigation(to, event)
  isMobileMenuOpen.value = false
}

const getButterPop = () => {
  if (!import.meta.client) return null
  return (window as any).ButterPop || null
}

const copyToClipboard = async (text: string) => {
  const butterPop = getButterPop()
  try {
    await navigator.clipboard.writeText(text)
    if (butterPop) butterPop.show(copySuccessConfig.value)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    if (butterPop) butterPop.show(copySuccessConfig.value)
  }
}

const openUrl = () => {
  if (!groupUrl.value) return
  if (groupUrl.value.startsWith('http')) window.open(groupUrl.value, '_blank')
}

const handleOutside = (event: MouseEvent) => {
  const target = event.target as Node

  if (isQQOpen.value) {
    if (qqTrigger.value && qqTrigger.value.contains(target)) return
    if (qqPopover.value && !qqPopover.value.contains(target)) isQQOpen.value = false
  }

  if (isMobileMenuOpen.value) {
    if (menuTrigger.value && menuTrigger.value.contains(target)) return
    if (menuPanel.value && !menuPanel.value.contains(target)) isMobileMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutside))
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>


  
