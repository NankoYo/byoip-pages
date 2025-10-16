import { readFileSync } from 'fs'
import { join } from 'path'

// 在构建时读取配置文件
const servicesConfig = JSON.parse(readFileSync(join(process.cwd(), 'config/services.json'), 'utf-8'))
const partnersConfig = JSON.parse(readFileSync(join(process.cwd(), 'config/partners.json'), 'utf-8'))
const sponsorsConfig = JSON.parse(readFileSync(join(process.cwd(), 'config/sponsors.json'), 'utf-8'))

// 构建时嵌入的应用配置
const embeddedConfig = {
  services: servicesConfig,
  partners: partnersConfig,
  sponsors: sponsorsConfig,
  cdn: {
    github: {
      template: "https://{{mirror}}/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}",
      mirror: "cdn.jsdelivr.net"
    },
    npm: {
      template: "https://{{mirror}}/npm/{{package}}@{{version}}/{{path}}",
      mirror: "cdn.jsdelivr.net"
    },
    alternatives: {
      mirrors: "cdn.jsdelivr.net"
    }
  },
  performance: {
    optimization: {
      preload: { enabled: false, routes: [], resources: [] },
      lazyLoading: { enabled: true, threshold: "100px", components: [] },
      caching: {
        staticAssets: { maxAge: 31536000, immutable: true },
        apiResponses: { maxAge: 300, staleWhileRevalidate: 86400 },
        fonts: { maxAge: 31536000, crossOrigin: "anonymous" }
      },
      compression: { enabled: true, algorithms: ["gzip"], threshold: 1024 }
    },
    monitoring: {
      coreWebVitals: {
        enabled: true,
        thresholds: { fcp: 1800, lcp: 2500, cls: 0.1, fid: 100 }
      },
      resourceTiming: { enabled: true, slowResourceThreshold: 1000 },
      longTasks: { enabled: true, threshold: 50 }
    },
    compatibility: {
      polyfills: {
        intersectionObserver: true,
        fetch: true,
        customProperties: true
      },
      fallbacks: {
        webp: "jpg",
        avif: "webp",
        modernFonts: "systemFonts"
      }
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-09-19',
  devtools: { enabled: true },
  ssr: true,

  // 指定源码目录
  srcDir: 'src/',

  css: ['~/assets/css/main.css'],

  // 应用配置
  app: {
    head: {
      title: '南科北上前端分发',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'cdnjs、jsdelivr、Google前端库 等全球主流前端服务商的镜像分发 、节点状态监测服务' },
        { name: 'keywords', content: 'CDN, CloudFlare, jsdelivr, cdnjs, 前端加速, 节点监测' },
        { name: 'author', content: '© 南科 前端分发' },
        { property: 'og:title', content: '© 南科 前端分发' },
        { property: 'og:description', content: 'CloudFlare、cdnjs、jsdeivr等全球主流云服务商的前端镜像分发、节点状态监测服务' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '© 南科 前端分发' },
        { name: 'twitter:description', content: 'CloudFlare、jsdelivr、cdnjs等全球主流云服务商的前端镜像分发、节点状态监测服务' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://cdn.nakeu.cn/favicon.png' },
        { rel: 'canonical', href: 'https://status.nankoyo.cn' }
      ],
      script: [
        { src: 'https://cdn.tailwindcss.com' },
        // 嵌入应用配置和结构化数据
        {
          innerHTML: `
            // 嵌入构建时配置
            window.__APP_CONFIG__ = ${JSON.stringify(embeddedConfig)};
            
            // 为SEO添加结构化数据
            const structuredData = {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "南科 前端分发",
              "description": "CCloudFlare、cdnjs、jsdelivr等全球主流云服务商的前端镜像分发、节点状态监测服务",
              "applicationCategory": "NetworkingApplication",
              "operatingSystem": "Web Browser",
            };
            
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringifstructuredDatata);
            document.head.appendChild(script);
          `,
          type: 'text/javascript'
        }
      ]
    }
  },

  // 构建配置
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      routes: ['/partners', '/sponsor']
    },
    publicAssets: [
      {
        baseURL: '/icon',
        dir: 'public/icon'
      }
    ]
  },

  // 构建优化
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', '@vue/runtime-core']
          }
        }
      },
      assetsDir: 'assets'
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
    server: {
      fs: {
        allow: ['..']
      }
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      appConfig: embeddedConfig
    }
  }
})
