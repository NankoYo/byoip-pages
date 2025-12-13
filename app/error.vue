<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

// IP Info state
const ipInfo = reactive({
  ip: '正在获取IP地址...',
  location: '正在获取位置信息...'
})

// Particles state
const particles = ref<Array<{ style: Record<string, string> }>>([])

onMounted(async () => {
  // Create particles
  const particleCount = 30
  particles.value = Array.from({ length: particleCount }, () => ({
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 4}s`,
      width: `${5 + Math.random() * 10}px`,
      height: `${5 + Math.random() * 10}px`,
      opacity: `${Math.random() * 0.5 + 0.2}`
    }
  }))

  // Fetch IP info
  try {
    const data = await $fetch<string>('https://myip.ipip.net/', { responseType: 'text' })
    const ipMatch = data.match(/当前 IP：([\d\.]+)/)
    const locationMatch = data.match(/来自于：(.+)/)

    if (ipMatch && ipMatch[1]) {
      ipInfo.ip = `IP地址：${ipMatch[1]}`
    } else {
      ipInfo.ip = 'IP地址获取失败'
    }

    if (locationMatch && locationMatch[1]) {
      ipInfo.location = `地理位置：${locationMatch[1]}`
    } else {
      ipInfo.location = '无法获取地理位置'
    }
  } catch (e) {
    ipInfo.ip = 'IP地址获取失败'
    ipInfo.location = '无法获取地理位置'
  }
})

useHead({
  title: computed(() => `${props.error?.statusCode || 404} - 页面未找到`),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})
</script>

<template>
  <div class="error-container font-mixed">
    <!-- 背景 -->
    <div class="background"></div>
    
    <!-- 多层波浪背景 -->
    <div class="wave-container">
      <!-- 波浪层 1 -->
      <div class="wave-layer wave-1">
        <svg class="wave" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path fill="rgba(179, 224, 255, 0.3)" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
      
      <!-- 波浪层 2 -->
      <div class="wave-layer wave-2">
        <svg class="wave" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path fill="rgba(179, 224, 255, 0.2)" d="M0,64L48,69.3C96,75,192,85,288,69.3C384,53,480,11,576,0C672,0,768,32,864,48C960,64,1056,64,1152,48C1248,32,1344,0,1392,0L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
      
      <!-- 波浪层 3 -->
      <div class="wave-layer wave-3">
        <svg class="wave" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path fill="rgba(179, 224, 255, 0.15)" d="M0,96L48,90.7C96,85,192,75,288,58.7C384,43,480,21,576,32C672,43,768,85,864,90.7C960,96,1056,64,1152,64C1248,64,1344,96,1392,112L1440,128L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </div>

    <!-- 光效层 -->
    <div class="light-layer"></div>

    <!-- 光点效果 -->
    <div class="glow-point" style="top: 20%; left: 15%; animation-duration: 15s;"></div>
    <div class="glow-point" style="bottom: 20%; right: 25%; animation-duration: 20s;"></div>
    <div class="glow-point" style="top: 50%; right: 10%; animation-duration: 18s;"></div>

    <!-- 粒子效果 -->
    <div 
      v-for="(particle, index) in particles" 
      :key="index"
      class="particle"
      :style="particle.style"
    ></div>

    <!-- 主要内容 -->
    <div class="content">
      <div class="error-code">{{ error?.statusCode || 404 }}</div>
      <div class="message">{{ error?.message || '抱歉，您访问的页面不存在或已被移除' }}</div>
      
      <button class="back-button" @click="handleError">返回首页</button>
    </div>

    <!-- IP信息 -->
    <div class="ip-info">
      <div class="ip-label">您的访问信息</div>
      <div class="ip-value">{{ ipInfo.ip }}</div>
      <div class="ip-value">{{ ipInfo.location }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 基础容器 */
.error-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: var(--font-mixed, 'Segoe UI', sans-serif);
}

/* 柔和渐变背景 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
  z-index: -3;
}

/* 动态波浪背景容器 */
.wave-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  z-index: -2;
}

/* 波浪层基类 */
.wave-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100px;
  background: transparent;
  transform: translateX(-25%);
}

/* 波浪动画 */
@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 柔和波浪样式 */
.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: repeat-x;
  background-size: cover;
  animation: wave 40s linear infinite;
  opacity: 0.8;
  z-index: -1;
}

/* 不同层波浪的差异化样式 */
.wave-1 {
  fill: rgba(179, 224, 255, 0.3);
  animation-duration: 30s;
}

.wave-2 {
  fill: rgba(179, 224, 255, 0.2);
  animation-duration: 40s;
  z-index: -2;
}

.wave-3 {
  fill: rgba(179, 224, 255, 0.15);
  animation-duration: 50s;
  z-index: -3;
}

/* 光效层 */
.light-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 30%, rgba(0, 153, 153, 0.15), transparent 70%);
  z-index: -1;
  pointer-events: none;
}

/* 光点效果 */
.glow-point {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 153, 153, 0.2) 0%, transparent 70%);
  filter: blur(30px);
  animation: float 15s ease-in-out infinite;
  z-index: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

/* 粒子光效 */
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 153, 153, 0.1);
  animation: particleMove infinite linear;
  z-index: 0;
  pointer-events: none;
}

@keyframes particleMove {
  0% { transform: translateY(0) rotate(0); opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

/* 主要内容容器 */
.content {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #003333;
  text-align: center;
  padding: 2rem;
  z-index: 3;
}

/* 错误代码 */
.error-code {
  font-size: 10vw;
  font-weight: 900;
  color: #008888;
  text-shadow: 0 5px 15px rgba(0, 136, 136, 0.1);
  line-height: 1;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
  position: relative;
  z-index: 2;
}

.error-code::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(0, 153, 153, 0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  z-index: -1;
  animation: glow 4s ease-in-out infinite alternate;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes glow {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
}

/* 消息文本 */
.message {
  font-size: 1.8rem;
  margin-bottom: 3rem;
  max-width: 600px;
  color: #006666;
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.5s;
  z-index: 2;
  position: relative;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* IP信息容器 */
.ip-info {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1.2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 5px 20px rgba(0, 102, 102, 0.1);
  width: 90%;
  max-width: 600px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  animation: fadeInUp 1s ease-out forwards;
  z-index: 4;
  border: 1px solid rgba(0, 102, 102, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* IP信息样式 */
.ip-label {
  font-weight: 600;
  color: #004444;
}

.ip-value {
  font-weight: 500;
  color: #005555;
}

/* 返回按钮 */
.back-button {
  padding: 1rem 2rem;
  background: rgba(0, 102, 102, 0.1);
  color: #006666;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 102, 102, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 102, 102, 0.2);
  animation: pulseButton 3s infinite;
  z-index: 3;
}

@keyframes pulseButton {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.back-button:hover {
  background: rgba(0, 102, 102, 0.2);
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 102, 102, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .ip-info {
    bottom: 10vh;
  }
  
  .message {
    font-size: 1.4rem;
  }
  
  .error-code {
    font-size: 14vw;
  }
}
</style>
