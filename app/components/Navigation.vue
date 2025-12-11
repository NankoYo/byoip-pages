<template>
  <div class="font-mixed font-bold navigation-link">
    <!-- 导航栏 -->
    <nav class="bg-white border-b border-gray-200 py-3 px-3 fixed top-0 left-0 right-0 z-10">
      <div class="max-w-[1200px] mx-auto flex justify-between items-center px-4 md:px-4">
        <a href="/" @click="handleNavigation('/', $event)" class="font-bold text-gray-800 no-underline text-base md:text-lg hover:text-blue-500">
          <img src="/favicon.ico" alt="favicon" class="inline-block w-6 h-6 mr-1 align-middle" />
          NB 优选服务
        </a>
        <div class="flex items-center gap-1 flex-wrap sm:flex-nowrap">
          <a v-for="link in navigationLinks" 
          :key="link.path" :href="link.path" @click="handleNavigation(link.path, $event)" 
          class="navigation-link text-gray-500 no-underline !py-1.5 !px-3 rounded-md font-medium hover:text-blue-500 hover:bg-gray-100" 
          :class="route.path === link.path ? 'link-active' : ''">
            {{ link.label }}
          </a>
        </div>
      </div>
    </nav>
    
    <div class="h-12"></div>
  </div>
</template>

<script setup lang="ts">
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
</script>
