(function(){
  const KEYS = [
    'capitalNetworkUsers',
    'capitalNetworkCurrentUser',
    'capitalNetworkSiteContent',
    'capitalNetworkRegistrations',
    'admin_token',
    'adminNotificationsEnabled',
  ]

  const removed = []
  try {
    KEYS.forEach(k => {
      try {
        if (localStorage.getItem(k) !== null) { localStorage.removeItem(k); removed.push(k) }
      } catch (e) {}
    })

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (!key) continue
      const lower = key.toLowerCase()
      if (lower.includes('registration') || lower.includes('capitalnetwork') || lower.includes('admin')) {
        try { localStorage.removeItem(key); removed.push(key) } catch (e) {}
      }
    }

    try { sessionStorage.clear() } catch (e) {}
  } catch (e) {}

  console.log('clear-localstorage.js completed. removed keys:', Array.from(new Set(removed)))
})()
