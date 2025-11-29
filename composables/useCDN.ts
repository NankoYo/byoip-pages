import type { CDNMirrorConfig } from '~/types'

interface CDNManager {
  config: Ref<CDNMirrorConfig | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  buildGithubUrl: (owner: string, repo: string, branch: string, path: string) => string
  buildNpmUrl: (packageName: string, version: string, path: string) => string
  updateMirror: (type: 'github' | 'npm', mirror: string) => Promise<void>
  loadConfig: () => Promise<void>
  getAvailableMirrors: () => string[]
}

export const useCDN = (): CDNManager => {
  const staticConfig = useCDNConfig()
  const config = ref<CDNMirrorConfig | null>(staticConfig.value)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadConfig = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // 从静态配置获取
      config.value = staticConfig.value
      if (!config.value) {
        config.value = {
          github: {
            template: 'https://{{mirror}}/gh/{{owner}}/{{repo}}@{{branch}}/{{path}}',
            mirror: 'fastly.jsdelivr.net'
          },
          npm: {
            template: 'https://{{mirror}}/npm/{{package}}@{{version}}/{{path}}',
            mirror: 'fastly.jsdelivr.net'
          }
        }
      }
    } catch (err) {
      error.value = `Failed to load CDN configuration: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('CDN config load error:', err)
    } finally {
      loading.value = false
    }
  }

  const buildGithubUrl = (owner: string, repo: string, branch: string, path: string): string => {
    if (!config.value?.github) {
      throw new Error('GitHub CDN configuration not loaded')
    }

    const { template, mirror } = config.value.github
    
    return template
      .replace('{{mirror}}', mirror)
      .replace('{{owner}}', owner)
      .replace('{{repo}}', repo)
      .replace('{{branch}}', branch)
      .replace('{{path}}', path.startsWith('/') ? path.slice(1) : path)
  }

  const buildNpmUrl = (packageName: string, version: string, path: string): string => {
    if (!config.value?.npm) {
      throw new Error('npm CDN configuration not loaded')
    }

    const { template, mirror } = config.value.npm
    
    return template
      .replace('{{mirror}}', mirror)
      .replace('{{package}}', packageName)
      .replace('{{version}}', version)
      .replace('{{path}}', path.startsWith('/') ? path.slice(1) : path)
  }

  const updateMirror = async (type: 'github' | 'npm', mirror: string): Promise<void> => {
    if (!config.value) {
      throw new Error('CDN configuration not loaded')
    }

    const availableMirrors = getAvailableMirrors()
    if (availableMirrors.length > 0 && !availableMirrors.includes(mirror)) {
      throw new Error(`Invalid mirror: ${mirror}. Available mirrors: ${availableMirrors.join(', ')}`)
    }

    config.value[type].mirror = mirror
  }

  const getAvailableMirrors = (): string[] => {
    return config.value?.alternatives?.mirrors || []
  }

  onMounted(() => {
    if (!config.value) {
      loadConfig()
    }
  })

  return {
    config,
    loading,
    error,
    buildGithubUrl,
    buildNpmUrl,
    updateMirror,
    loadConfig,
    getAvailableMirrors
  }
}