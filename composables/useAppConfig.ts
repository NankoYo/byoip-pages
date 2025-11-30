import { useRuntimeConfig } from '#app'

interface AppConfig {
  services: ServicesConfig
  partners: PartnersConfig
  sponsors: SponsorsConfig
  cdn: CDNMirrorConfig
  performance: PerformanceConfig
}

interface AppConfigManager {
  services: ComputedRef<ServicesConfig>
  partners: ComputedRef<PartnersConfig>
  sponsors: ComputedRef<SponsorsConfig>
  cdn: ComputedRef<CDNMirrorConfig>
  performance: ComputedRef<PerformanceConfig>
  isLoaded: ComputedRef<boolean>
  getConfig: <T extends keyof AppConfig>(key: T) => AppConfig[T]
}

export const useStaticConfig = (): AppConfigManager => {
  const runtimeConfig = useRuntimeConfig()
  const config = ref<AppConfig>(runtimeConfig.public.appConfig)
  const services = computed(() => config.value.services)
  const partners = computed(() => config.value.partners)
  const sponsors = computed(() => config.value.sponsors)
  const cdn = computed(() => config.value.cdn)
  const performance = computed(() => config.value.performance)
  const isLoaded = computed(() => {
    return !!(
      config.value.services?.services?.length ||
      config.value.partners?.partners?.length ||
      config.value.sponsors?.sponsors?.length ||
      config.value.cdn?.github ||
      config.value.performance?.optimization
    )
  })

  const getConfig = <T extends keyof AppConfig>(key: T): AppConfig[T] => {
    return config.value[key]
  }
  onMounted(() => {
    config.value = runtimeConfig.public.appConfig
  })

  return {
    services,
    partners,
    sponsors,
    cdn,
    performance,
    isLoaded,
    getConfig
  }
}
export const useServices = () => {
  const { services } = useStaticConfig()
  return services
}

export const usePartners = () => {
  const { partners } = useStaticConfig()
  return partners
}

export const useSponsors = () => {
  const { sponsors } = useStaticConfig()
  return sponsors
}

export const useCDNConfig = () => {
  const { cdn } = useStaticConfig()
  return cdn
}

export const usePerformanceConfig = () => {
  const { performance } = useStaticConfig()
  return performance
}