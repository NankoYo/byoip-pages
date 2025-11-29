export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  try {
    const appConfig = (window as any).__APP_CONFIG__
    
    if (!appConfig) {
      console.error('Application configuration not found in embedded data')
      return
    }

    console.log('Embedded configuration loaded successfully:', {
      services: appConfig.services?.services?.length || 0,
      partners: appConfig.partners?.partners?.length || 0,
      sponsors: appConfig.sponsors?.sponsors?.length || 0
    })

  } catch (error) {
    console.error('Failed to access embedded configuration:', error)
  }
})