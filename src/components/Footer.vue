<template>
  <footer
    class="bg-gray-50 text-gray-1000 border-t border-gray-200 py-6 md:py-5 transition-all duration-300 fixed bottom-0 left-0 right-0 z-10 bg-opacity-90 backdrop-blur-sm"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <!-- 版权信息 -->
        <p class="text-sm md:text-base">
          Copyright &copy; {{ currentYear }} 南科前端分发
        </p>
        <!-- 导航链接（可选） -->
        <nav>
          <!-- 这部分由copilot修改 -->
          <!-- <NuxtLink v-for="link in footerLinks" :key="link.href" :to="link.href" class="text-sm hover:text-blue-600 transition-colors duration-200">
            {{ link.label }}
          </NuxtLink> -->
          <span class="inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              class="inline-block mr-1 align-middle"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </span>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = [

  { label: '首页', href: '/' },
  { label: '合作伙伴', href: '/partners' },
  { label: '赞助商', href: '/sponsor' },
  { label: '关于我们', href: '/about' },
  { label: '隐私政策', href: '/privacy' },
]
</script>
