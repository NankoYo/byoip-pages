import servicesConfig from './assets/config/services.json'
import partnersConfig from './assets/config/partners.json'
import sponsorsConfig from './assets/config/sponsors.json'
import cdnConfig from './assets/config/cdn.json'
import butterpopConfig from './assets/config/butterpop.json'

export default defineAppConfig({
  services: servicesConfig || { services: [] },
  partners: partnersConfig || { partners: [] },
  sponsors: sponsorsConfig || { sponsors: [] },
  cdn: cdnConfig,
  butterpop: butterpopConfig,
  performance: {
    optimization: {
      preload: { enabled: true, routes: [], resources: [] },
      lazyLoading: { enabled: true, threshold: '100px', components: [] },
      caching: {
        staticAssets: { maxAge: 31536000, immutable: true },
        apiResponses: { maxAge: 300, staleWhileRevalidate: 86400 },
        fonts: { maxAge: 31536000, crossOrigin: 'anonymous' }
      },
      compression: { enabled: true, algorithms: ['gzip'], threshold: 1024 }
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
        webp: 'jpg',
        avif: 'webp'
      }
    }
  }
})

