export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  try {
    const head = document.head
    const existingStyles = Array.from(head.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[]
    existingStyles.forEach((styleLink) => {
      const href = styleLink.getAttribute('href')
      if (!href) return
      const alreadyPreloaded = head.querySelector(`link[rel="preload"][as="style"][href="${href}"]`)
      if (alreadyPreloaded) return
      const preload = document.createElement('link')
      preload.setAttribute('rel', 'preload')
      preload.setAttribute('as', 'style')
      preload.setAttribute('href', href)
      preload.setAttribute('crossorigin', 'anonymous')
      head.insertBefore(preload, head.firstChild)
    })
  } catch {}
})
