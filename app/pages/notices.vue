<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-chinese">历史公告</h1>
      <p class="text-lg text-gray-600 font-chinese">
        查看所有历史系统公告与通知
      </p>
    </div>

    <div class="space-y-6">
      <div v-if="notices.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
        <p class="text-gray-500">暂无公告记录</p>
      </div>

      <div 
        v-for="notice in notices" 
        :key="notice.id"
        class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        :class="{
          'border-blue-200': notice.type === 'info',
          'border-green-200': notice.type === 'success',
          'border-yellow-200': notice.type === 'warning',
          'border-red-200': notice.type === 'error'
        }"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-500 font-mono">{{ notice.time }}</span>
            <span 
              class="px-2 py-1 text-xs rounded-full font-medium uppercase"
              :class="{
                'bg-blue-100 text-blue-800': notice.type === 'info',
                'bg-green-100 text-green-800': notice.type === 'success',
                'bg-yellow-100 text-yellow-800': notice.type === 'warning',
                'bg-red-100 text-red-800': notice.type === 'error'
              }"
            >
              {{ notice.type || 'INFO' }}
            </span>
          </div>
          <p class="text-gray-800 font-medium">{{ notice.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotices } from '~/composables/useNotices'

const { notices } = useNotices()

useHead({
  title: '历史公告 | NB 优选服务',
  meta: [
    { name: 'description', content: 'NB 优选服务历史公告与通知列表' }
  ]
})
</script>
