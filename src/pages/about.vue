<template>
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-cascadia">关于我们</h1>
        <div class="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
      </div>

      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div class="prose prose-lg mx-auto">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">项目简介</h2>
          <p class="mb-6">
            南科北上自建镜像是一个用于为前端开发者提供境内前端加速访问的开源项目。我们的目标是帮助用户获得更快、更稳定、更干净的前端资源托管体验。
          </p>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">我们是谁？</h2>
          <p class="mb-6">
            我们致力于为用户提供最好的服务，让用户能够享受到更快、更稳定的前端资源分发和更好的用户体验。
          </p>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">技术支持</h2>
          <p class="mb-6">
            我们支持 cdnjs、jsdelivr、Google前端库等全球主流前端库。我们定期更新数据，确保用户能够获取最新的前端资源版本。
          </p>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">项目代码</h2>
          <p class="mb-6">
            我们的项目已稳定运行3年，稳定性值得信任。
          </p>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">联系我们</h2>
          <p>
            如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：
          </p>
          <ul class="list-disc pl-6 mt-2">
            <li>X: <a href="https://x.com/NankoYo" class="text-blue-600 hover:text-blue-800">NanKoYo</a></li>
            <li>Telegram: <a href="https://t.me/NankoYo" class="text-blue-600 hover:text-blue-800">NanKoYo</a></li>
            <li>Email: nanfnet@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="h-5"></div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 页面标题
useHead({
  title: '关于我们 - 南科前端分发',
  meta: [
    { name: 'description', content: '南科前端分发项目介绍、使命和联系方式' }
  ]
})
</script>
