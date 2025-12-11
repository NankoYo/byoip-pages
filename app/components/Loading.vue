<template>
  <transition name="fade">
    <div v-if="isLoading || isTimeout" class="fixed inset-0 z-[9999] w-screen h-screen pointer-events-auto flex items-center justify-center bg-white/95 backdrop-blur-sm" aria-busy="true">
      <div class="flex flex-col items-center gap-3">
        <svg v-if="isLoading" class="animate-spin h-8 w-8 text-gray-900" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span v-if="isLoading" class="text-sm text-gray-800">加载中…</span>
        <div v-else class="flex flex-col items-center gap-2">
          <span class="text-sm text-gray-800">加载超时</span>
          <button @click="retry" class="px-3 py-1 rounded bg-gray-900 text-white text-xs">重试</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const { isLoading, isTimeout, retry } = usePageLoading()
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
