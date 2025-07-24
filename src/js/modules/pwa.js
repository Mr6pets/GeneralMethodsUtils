/**
 * PWA 增强工具模块
 * 提供 Service Worker 管理、离线缓存、推送通知等功能
 */

/**
 * 注册 Service Worker
 * @param {string} swPath - Service Worker 文件路径
 * @param {Object} options - 注册选项
 * @returns {Promise<ServiceWorkerRegistration>}
 */
export function registerServiceWorker(swPath = '/sw.js', options = {}) {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
    }
    
    return navigator.serviceWorker.register(swPath, options)
        .then(registration => {
            console.log('Service Worker registered:', registration);
            return registration;
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
            throw error;
        });
}

/**
 * 卸载 Service Worker
 * @returns {Promise<boolean>}
 */
export function unregisterServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return Promise.resolve(false);
    }
    
    return navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            return Promise.all(
                registrations.map(registration => registration.unregister())
            );
        })
        .then(results => results.every(result => result));
}

/**
 * 检查应用更新
 * @returns {Promise<boolean>}
 */
export function checkForUpdates() {
    if (!('serviceWorker' in navigator)) {
        return Promise.resolve(false);
    }
    
    return navigator.serviceWorker.getRegistration()
        .then(registration => {
            if (registration) {
                return registration.update().then(() => {
                    return registration.waiting !== null;
                });
            }
            return false;
        });
}

/**
 * 应用更新
 * @returns {Promise<void>}
 */
export function applyUpdate() {
    if (!('serviceWorker' in navigator)) {
        return Promise.reject(new Error('Service Worker not supported'));
    }
    
    return navigator.serviceWorker.getRegistration()
        .then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                return new Promise(resolve => {
                    navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
                });
            }
        });
}

/**
 * 请求推送通知权限
 * @returns {Promise<NotificationPermission>}
 */
export function requestNotificationPermission() {
    if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
    }
    
    return Notification.requestPermission();
}

/**
 * 发送推送通知
 * @param {string} title - 通知标题
 * @param {Object} options - 通知选项
 * @returns {Promise<Notification>}
 */
export function sendNotification(title, options = {}) {
    if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
    }
    
    if (Notification.permission !== 'granted') {
        throw new Error('Notification permission not granted');
    }
    
    return Promise.resolve(new Notification(title, options));
}

/**
 * 添加到主屏幕提示
 * @returns {Promise<void>}
 */
export function promptInstall() {
    return new Promise((resolve, reject) => {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });
        
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    resolve();
                } else {
                    reject(new Error('User dismissed install prompt'));
                }
                deferredPrompt = null;
            });
        } else {
            reject(new Error('Install prompt not available'));
        }
    });
}

/**
 * 检查是否已安装为 PWA
 * @returns {boolean}
 */
export function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

/**
 * 缓存资源
 * @param {string} cacheName - 缓存名称
 * @param {Array<string>} urls - 要缓存的 URL 列表
 * @returns {Promise<void>}
 */
export function cacheResources(cacheName, urls) {
    if (!('caches' in window)) {
        throw new Error('Cache API not supported');
    }
    
    return caches.open(cacheName)
        .then(cache => cache.addAll(urls));
}

/**
 * 清理旧缓存
 * @param {Array<string>} keepCaches - 要保留的缓存名称列表
 * @returns {Promise<void>}
 */
export function clearOldCaches(keepCaches = []) {
    if (!('caches' in window)) {
        return Promise.resolve();
    }
    
    return caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => !keepCaches.includes(cacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        });
}