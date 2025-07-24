import {
  ServiceWorkerOptions,
  CacheOptions,
  NotificationOptions,
  InstallPromptOptions,
  PWAUpdateOptions
} from '../types/index';

/**
 * PWA 增强工具模块
 * 提供 Service Worker、缓存管理、推送通知等 PWA 功能
 */

/**
 * 注册 Service Worker
 * @param swPath Service Worker 文件路径
 * @param options 注册选项
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function registerServiceWorker(
  swPath: string = '/sw.js',
  options: ServiceWorkerOptions = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath, options);
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * 卸载 Service Worker
 * @returns Promise<boolean>
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const results = await Promise.all(
      registrations.map(registration => registration.unregister())
    );
    return results.every(result => result);
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * 缓存资源
 * @param resources 要缓存的资源列表
 * @param options 缓存选项
 * @returns Promise<boolean>
 */
export async function cacheResources(
  resources: string[],
  options: CacheOptions = {}
): Promise<boolean> {
  if (!('caches' in window)) {
    console.warn('Cache API not supported');
    return false;
  }

  const cacheName = options.cacheName || 'app-cache-v1';

  try {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
    console.log('Resources cached successfully');
    return true;
  } catch (error) {
    console.error('Failed to cache resources:', error);
    return false;
  }
}

/**
 * 清理过期缓存
 * @param options 缓存选项
 * @returns Promise<boolean>
 */
export async function clearExpiredCache(options: CacheOptions = {}): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    const cacheName = options.cacheName || 'app-cache-v1';
    
    const deletePromises = cacheNames
      .filter(name => name !== cacheName)
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log('Expired caches cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
    return false;
  }
}

/**
 * 请求通知权限
 * @returns Promise<NotificationPermission>
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * 显示通知
 * @param options 通知选项
 * @returns Promise<Notification | null>
 */
export async function showNotification(options: NotificationOptions): Promise<Notification | null> {
  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    console.warn('Notification permission denied');
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon,
      badge: options.badge,
      tag: options.tag,
      data: options.data,
      actions: options.actions,
      requireInteraction: options.requireInteraction,
      silent: options.silent
    });
    
    return notification;
  } catch (error) {
    console.error('Failed to show notification:', error);
    return null;
  }
}

/**
 * 检查是否在线
 * @returns boolean
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 监听网络状态变化
 * @param onOnline 上线回调
 * @param onOffline 离线回调
 * @returns 清理函数
 */
export function watchNetworkStatus(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  const handleOnline = () => {
    console.log('Network: Online');
    onOnline?.();
  };
  
  const handleOffline = () => {
    console.log('Network: Offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * 处理应用安装提示
 * @param options 安装提示选项
 * @returns Promise<boolean>
 */
export async function handleInstallPrompt(options: InstallPromptOptions = {}): Promise<boolean> {
  if (!options.deferredPrompt) {
    console.warn('No deferred install prompt available');
    return false;
  }

  try {
    options.deferredPrompt.prompt();
    const { outcome } = await options.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA install accepted');
      options.onAccept?.();
      return true;
    } else {
      console.log('PWA install declined');
      options.onDecline?.();
      return false;
    }
  } catch (error) {
    console.error('Install prompt failed:', error);
    return false;
  }
}

/**
 * 检查PWA更新
 * @param options 更新选项
 * @returns Promise<boolean>
 */
export async function checkForUpdates(options: PWAUpdateOptions = {}): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      options.onUpdateAvailable?.(registration);

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          options.onUpdateReady?.();
          
          if (options.skipWaiting) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      });
    });

    await registration.update();
    return true;
  } catch (error) {
    console.error('Update check failed:', error);
    return false;
  }
}