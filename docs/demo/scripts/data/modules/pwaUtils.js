// PWA工具模块
export default {
    title: 'PWA工具',
    icon: 'fas fa-mobile',
    methods: {
        registerServiceWorker: {
            name: 'registerServiceWorker',
            description: '注册Service Worker',
            params: [
                { name: 'swPath', type: 'string', required: true, description: 'Service Worker文件路径' },
                { name: 'options', type: 'object', required: false, description: '注册选项' }
            ],
            examples: {
                js: `// 注册Service Worker\nregisterServiceWorker('/sw.js')\n  .then(registration => {\n    console.log('SW注册成功:', registration);\n  })\n  .catch(error => {\n    console.error('SW注册失败:', error);\n  });\n\n// 带选项的注册\nregisterServiceWorker('/sw.js', {\n  scope: '/app/',\n  updateViaCache: 'none'\n});\n\n// 检查更新\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.addEventListener('controllerchange', () => {\n    console.log('Service Worker已更新');\n    window.location.reload();\n  });\n}`,
                ts: `import { registerServiceWorker } from 'general-method-utils';\n\nregisterServiceWorker('/sw.js')\n  .then((registration: ServiceWorkerRegistration) => {\n    console.log('SW注册成功:', registration);\n  })\n  .catch((error: Error) => {\n    console.error('SW注册失败:', error);\n  });\n\nregisterServiceWorker('/sw.js', {\n  scope: '/app/',\n  updateViaCache: 'none'\n});`
            },
            demo: true
        },
        installPrompt: {
            name: 'installPrompt',
            description: '显示PWA安装提示',
            params: [
                { name: 'options', type: 'object', required: false, description: '安装提示选项' }
            ],
            examples: {
                js: `// 显示安装提示\nlet deferredPrompt;\n\nwindow.addEventListener('beforeinstallprompt', (e) => {\n  e.preventDefault();\n  deferredPrompt = e;\n  showInstallButton();\n});\n\nfunction showInstallPrompt() {\n  if (deferredPrompt) {\n    deferredPrompt.prompt();\n    deferredPrompt.userChoice.then((choiceResult) => {\n      if (choiceResult.outcome === 'accepted') {\n        console.log('用户接受了安装');\n      }\n      deferredPrompt = null;\n    });\n  }\n}\n\n// 检查是否已安装\nif (window.matchMedia('(display-mode: standalone)').matches) {\n  console.log('PWA已安装');\n}`,
                ts: `import { installPrompt } from 'general-method-utils';\n\nlet deferredPrompt: any;\n\nwindow.addEventListener('beforeinstallprompt', (e: Event) => {\n  e.preventDefault();\n  deferredPrompt = e;\n  showInstallButton();\n});\n\nfunction showInstallPrompt(): void {\n  if (deferredPrompt) {\n    deferredPrompt.prompt();\n    deferredPrompt.userChoice.then((choiceResult: any) => {\n      if (choiceResult.outcome === 'accepted') {\n        console.log('用户接受了安装');\n      }\n      deferredPrompt = null;\n    });\n  }\n}`
            },
            demo: true
        },
        updateAvailable: {
            name: 'updateAvailable',
            description: '检查PWA更新',
            params: [
                { name: 'callback', type: 'function', required: true, description: '更新回调函数' }
            ],
            examples: {
                js: `// 检查更新\nupdateAvailable((hasUpdate) => {\n  if (hasUpdate) {\n    showUpdateNotification();\n  }\n});\n\nfunction showUpdateNotification() {\n  const notification = document.createElement('div');\n  notification.innerHTML = \`\n    <div class=\"update-banner\">\n      <p>新版本可用</p>\n      <button onclick=\"updateApp()\">更新</button>\n      <button onclick=\"dismissUpdate()\">稍后</button>\n    </div>\n  \`;\n  document.body.appendChild(notification);\n}\n\nfunction updateApp() {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.getRegistration().then(reg => {\n      if (reg && reg.waiting) {\n        reg.waiting.postMessage({ type: 'SKIP_WAITING' });\n      }\n    });\n  }\n}`,
                ts: `import { updateAvailable } from 'general-method-utils';\n\nupdateAvailable((hasUpdate: boolean) => {\n  if (hasUpdate) {\n    showUpdateNotification();\n  }\n});\n\nfunction showUpdateNotification(): void {\n  const notification = document.createElement('div');\n  notification.innerHTML = \`\n    <div class=\"update-banner\">\n      <p>新版本可用</p>\n      <button onclick=\"updateApp()\">更新</button>\n    </div>\n  \`;\n  document.body.appendChild(notification);\n}\n\nfunction updateApp(): void {\n  if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.getRegistration().then(reg => {\n      if (reg && reg.waiting) {\n        reg.waiting.postMessage({ type: 'SKIP_WAITING' });\n      }\n    });\n  }\n}`
            },
            demo: true
        },
        offlineDetection: {
            name: 'offlineDetection',
            description: '检测网络状态',
            params: [
                { name: 'onOnline', type: 'function', required: true, description: '上线回调' },
                { name: 'onOffline', type: 'function', required: true, description: '离线回调' }
            ],
            examples: {
                js: `// 网络状态检测\nofflineDetection(\n  () => {\n    console.log('网络已连接');\n    hideOfflineBanner();\n    syncPendingData();\n  },\n  () => {\n    console.log('网络已断开');\n    showOfflineBanner();\n    enableOfflineMode();\n  }\n);\n\nfunction showOfflineBanner() {\n  const banner = document.createElement('div');\n  banner.id = 'offline-banner';\n  banner.textContent = '您当前处于离线状态';\n  banner.style.cssText = \`\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    background: #f44336;\n    color: white;\n    text-align: center;\n    padding: 10px;\n    z-index: 9999;\n  \`;\n  document.body.appendChild(banner);\n}\n\nfunction hideOfflineBanner() {\n  const banner = document.getElementById('offline-banner');\n  if (banner) {\n    banner.remove();\n  }\n}`,
                ts: `import { offlineDetection } from 'general-method-utils';\n\nofflineDetection(\n  () => {\n    console.log('网络已连接');\n    hideOfflineBanner();\n    syncPendingData();\n  },\n  () => {\n    console.log('网络已断开');\n    showOfflineBanner();\n    enableOfflineMode();\n  }\n);\n\nfunction showOfflineBanner(): void {\n  const banner = document.createElement('div');\n  banner.id = 'offline-banner';\n  banner.textContent = '您当前处于离线状态';\n  document.body.appendChild(banner);\n}\n\nfunction hideOfflineBanner(): void {\n  const banner = document.getElementById('offline-banner');\n  if (banner) {\n    banner.remove();\n  }\n}`
            },
            demo: true
        },
        cacheManager: {
            name: 'cacheManager',
            description: '缓存管理器',
            params: [
                { name: 'cacheName', type: 'string', required: true, description: '缓存名称' }
            ],
            examples: {
                js: `// 创建缓存管理器\nconst cache = cacheManager('app-cache-v1');\n\n// 缓存资源\nawait cache.add('/api/data');\nawait cache.addAll([\n  '/css/app.css',\n  '/js/app.js',\n  '/images/logo.png'\n]);\n\n// 获取缓存\nconst response = await cache.match('/api/data');\nif (response) {\n  const data = await response.json();\n  console.log('从缓存获取:', data);\n}\n\n// 删除缓存\nawait cache.delete('/old-api/data');\n\n// 清空缓存\nawait cache.clear();\n\n// 缓存策略\nasync function cacheFirst(request) {\n  const cached = await cache.match(request);\n  if (cached) {\n    return cached;\n  }\n  \n  const response = await fetch(request);\n  cache.put(request, response.clone());\n  return response;\n}`,
                ts: `import { cacheManager } from 'general-method-utils';\n\ninterface CacheManager {\n  add(request: string): Promise<void>;\n  addAll(requests: string[]): Promise<void>;\n  match(request: string): Promise<Response | undefined>;\n  delete(request: string): Promise<boolean>;\n  clear(): Promise<void>;\n  put(request: string, response: Response): Promise<void>;\n}\n\nconst cache: CacheManager = cacheManager('app-cache-v1');\n\nawait cache.add('/api/data');\nawait cache.addAll([\n  '/css/app.css',\n  '/js/app.js',\n  '/images/logo.png'\n]);\n\nconst response = await cache.match('/api/data');\nif (response) {\n  const data = await response.json();\n  console.log('从缓存获取:', data);\n}`
            },
            demo: true
        },
        backgroundSync: {
            name: 'backgroundSync',
            description: '后台同步',
            params: [
                { name: 'tag', type: 'string', required: true, description: '同步标签' },
                { name: 'data', type: 'object', required: false, description: '同步数据' }
            ],
            examples: {
                js: `// 注册后台同步\nbackgroundSync('sync-posts', {\n  action: 'upload',\n  data: pendingPosts\n});\n\n// 在Service Worker中处理同步\nself.addEventListener('sync', event => {\n  if (event.tag === 'sync-posts') {\n    event.waitUntil(syncPosts());\n  }\n});\n\nasync function syncPosts() {\n  const pendingPosts = await getPendingPosts();\n  \n  for (const post of pendingPosts) {\n    try {\n      await uploadPost(post);\n      await markPostAsSynced(post.id);\n    } catch (error) {\n      console.error('同步失败:', error);\n    }\n  }\n}\n\n// 离线表单提交\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const formData = new FormData(form);\n  \n  if (navigator.onLine) {\n    await submitForm(formData);\n  } else {\n    await saveFormOffline(formData);\n    backgroundSync('sync-forms');\n  }\n});`,
                ts: `import { backgroundSync } from 'general-method-utils';\n\ninterface SyncData {\n  action: string;\n  data: any;\n}\n\n// 注册后台同步\nbackgroundSync('sync-posts', {\n  action: 'upload',\n  data: pendingPosts\n});\n\n// Service Worker事件处理\nself.addEventListener('sync', (event: any) => {\n  if (event.tag === 'sync-posts') {\n    event.waitUntil(syncPosts());\n  }\n});\n\nasync function syncPosts(): Promise<void> {\n  const pendingPosts = await getPendingPosts();\n  \n  for (const post of pendingPosts) {\n    try {\n      await uploadPost(post);\n      await markPostAsSynced(post.id);\n    } catch (error) {\n      console.error('同步失败:', error);\n    }\n  }\n}`
            },
            demo: true
        }
    }
};