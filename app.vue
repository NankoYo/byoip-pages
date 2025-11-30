<template>
  <div class="min-h-screen bg-white text-gray-900">
    <Navigation />
      <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
// 设置基本head
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  bodyAttrs: {}
})

console.log('App loaded')
</script>
