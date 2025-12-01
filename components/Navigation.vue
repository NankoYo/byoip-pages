<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navigation-bar">
      <div class="navigation-container">
        <a 
          href="/"
          @click="handleNavigation('/', $event)"
          class="navigation-logo"
        >
          <img src="/favicon.ico" alt="favicon" class="navigation-logo-img" />
          NB 优选服务
        </a>
        <div class="navigation-links">
          <a 
            v-for="link in navigationLinks"
            :key="link.path"
            :href="link.path"
            @click="handleNavigation(link.path, $event)"
            class="navigation-link"
            :class="{ 'link-active': route.path === link.path }"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </nav>
    
    <div class="navigation-spacer"></div>
  </div>
</template>

<script setup lang="ts">
// 导航链接配置
const navigationLinks = [
  { path: '/', label: '首页' },
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

<style scoped>
.navigation-bar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navigation-logo {
  font-family: 'xiaolai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
}

.navigation-logo img,
.navigation-logo-img {
  display: inline-block;
  width: 40px;
  height: 32px;
  margin-right: 8px;
  vertical-align: middle;
}

.navigation-logo:hover {
  color: #3b82f6;
}

.navigation-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.navigation-link {
  font-family: 'xiaolai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #6b7280;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.navigation-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.navigation-link.link-active {
  color: #3b82f6;
  background-color: #eff6ff;
  font-weight: 600;
}

.navigation-spacer {
  height: 80px;
}

@media (max-width: 768px) {
  .navigation-container {
    padding: 0 1rem;
  }
  
  .navigation-links {
    gap: 0.25rem;
  }
  
  .navigation-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .navigation-logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 640px) {
  .navigation-links {
    flex-wrap: wrap;
  }
  
  .navigation-link {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>