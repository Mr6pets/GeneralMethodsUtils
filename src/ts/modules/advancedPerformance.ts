import {
  AdvancedPerformanceMetrics,
  UserBehaviorEvent,
  ErrorInfo,
  PerformanceObserverOptions,
  FPSMonitorOptions,
  LongTaskOptions,
  MemoryMonitorOptions
} from '../types/index';

/**
 * 高级性能监控与分析模块
 * 提供 Core Web Vitals、用户行为追踪、错误监控等功能
 */

// 全局状态
let performanceObservers: PerformanceObserver[] = [];
let behaviorEvents: UserBehaviorEvent[] = [];
let sessionId = generateSessionId();
let userId: string | undefined;

/**
 * 初始化性能监控
 * @param options 配置选项
 */
export function initPerformanceMonitoring(options: {
  userId?: string;
  enableBehaviorTracking?: boolean;
  enableErrorTracking?: boolean;
  enableCoreWebVitals?: boolean;
} = {}): void {
  userId = options.userId;
  
  if (options.enableCoreWebVitals !== false) {
    initCoreWebVitals();
  }
  
  if (options.enableBehaviorTracking) {
    initBehaviorTracking();
  }
  
  if (options.enableErrorTracking !== false) {
    initErrorTracking();
  }
}

/**
 * 获取核心 Web Vitals 指标
 * @returns Promise<AdvancedPerformanceMetrics>
 */
export async function getCoreWebVitals(): Promise<AdvancedPerformanceMetrics> {
  const metrics: AdvancedPerformanceMetrics = {};
  
  // LCP (Largest Contentful Paint)
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  if (lcpEntries.length > 0) {
    metrics.LCP = lcpEntries[lcpEntries.length - 1].startTime;
  }
  
  // FCP (First Contentful Paint)
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    metrics.FCP = fcpEntry.startTime;
  }
  
  // TTFB (Time to First Byte)
  const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navigationEntries.length > 0) {
    const nav = navigationEntries[0];
    metrics.TTFB = nav.responseStart - nav.requestStart;
  }
  
  // CLS (Cumulative Layout Shift) - 需要通过 PerformanceObserver 收集
  metrics.CLS = await getCLS();
  
  // FID (First Input Delay) - 需要通过 PerformanceObserver 收集
  metrics.FID = await getFID();
  
  // 内存使用情况
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    metrics.memoryUsage = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }
  
  // 网络信息
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    metrics.networkInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }
  
  // 资源加载时间
  metrics.resourceTiming = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  return metrics;
}

/**
 * 追踪用户行为事件
 * @param event 行为事件
 */
export function trackUserBehavior(event: Omit<UserBehaviorEvent, 'timestamp' | 'sessionId'>): void {
  const behaviorEvent: UserBehaviorEvent = {
    ...event,
    timestamp: Date.now(),
    sessionId,
    userId
  };
  
  behaviorEvents.push(behaviorEvent);
  
  // 限制事件数量，避免内存泄漏
  if (behaviorEvents.length > 1000) {
    behaviorEvents = behaviorEvents.slice(-500);
  }
}

/**
 * 获取用户行为事件
 * @param limit 限制数量
 * @returns 用户行为事件列表
 */
export function getUserBehaviorEvents(limit?: number): UserBehaviorEvent[] {
  return limit ? behaviorEvents.slice(-limit) : [...behaviorEvents];
}

/**
 * 记录错误信息
 * @param error 错误对象
 * @param customData 自定义数据
 */
export function trackError(error: Error, customData?: any): void {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId,
    userId,
    customData
  };
  
  console.error('Tracked error:', errorInfo);
  
  // 这里可以发送到错误收集服务
  // sendErrorToService(errorInfo);
}

/**
 * 开始 FPS 监控
 * @param options FPS 监控选项
 * @returns 停止监控函数
 */
export function startFPSMonitor(options: FPSMonitorOptions = {}): () => void {
  const { sampleRate = 1000, threshold = 30, onLowFPS } = options;
  
  let lastTime = performance.now();
  let frameCount = 0;
  let isRunning = true;
  
  function countFrame() {
    if (!isRunning) return;
    
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= sampleRate) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      if (fps < threshold) {
        onLowFPS?.(fps);
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(countFrame);
  }
  
  requestAnimationFrame(countFrame);
  
  return () => {
    isRunning = false;
  };
}

/**
 * 监控长任务
 * @param options 长任务监控选项
 * @returns 停止监控函数
 */
export function observeLongTasks(options: LongTaskOptions = {}): () => void {
  const { threshold = 50, onLongTask } = options;
  
  if (!('PerformanceObserver' in window)) {
    console.warn('PerformanceObserver not supported');
    return () => {};
  }
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.duration > threshold) {
        onLongTask?.(entry);
      }
    });
  });
  
  try {
    observer.observe({ entryTypes: ['longtask'] });
    performanceObservers.push(observer);
  } catch (error) {
    console.warn('Long task observation not supported');
  }
  
  return () => {
    observer.disconnect();
    const index = performanceObservers.indexOf(observer);
    if (index > -1) {
      performanceObservers.splice(index, 1);
    }
  };
}

/**
 * 监控内存使用
 * @param options 内存监控选项
 * @returns 停止监控函数
 */
export function startMemoryMonitor(options: MemoryMonitorOptions = {}): () => void {
  const { interval = 5000, threshold = 50 * 1024 * 1024, onHighMemory } = options;
  
  if (!('memory' in performance)) {
    console.warn('Memory API not supported');
    return () => {};
  }
  
  const intervalId = setInterval(() => {
    const memory = (performance as any).memory;
    if (memory.usedJSHeapSize > threshold) {
      onHighMemory?.(memory);
    }
  }, interval);
  
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * 创建自定义性能观察器
 * @param options 观察器选项
 * @returns 停止观察函数
 */
export function createPerformanceObserver(options: PerformanceObserverOptions): () => void {
  if (!('PerformanceObserver' in window)) {
    console.warn('PerformanceObserver not supported');
    return () => {};
  }
  
  const observer = new PerformanceObserver((list) => {
    options.callback(list.getEntries());
  });
  
  try {
    observer.observe({
      entryTypes: options.entryTypes,
      buffered: options.buffered
    });
    performanceObservers.push(observer);
  } catch (error) {
    console.warn('Performance observation failed:', error);
  }
  
  return () => {
    observer.disconnect();
    const index = performanceObservers.indexOf(observer);
    if (index > -1) {
      performanceObservers.splice(index, 1);
    }
  };
}

/**
 * 获取页面加载性能指标
 * @returns 性能指标对象
 */
export function getPagePerformance(): Record<string, number> {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) {
    return {};
  }
  
  return {
    // DNS 查询时间
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    // TCP 连接时间
    tcpConnect: navigation.connectEnd - navigation.connectStart,
    // SSL 握手时间
    sslHandshake: navigation.connectEnd - navigation.secureConnectionStart,
    // 请求时间
    request: navigation.responseStart - navigation.requestStart,
    // 响应时间
    response: navigation.responseEnd - navigation.responseStart,
    // DOM 解析时间
    domParse: navigation.domInteractive - navigation.responseEnd,
    // 资源加载时间
    resourceLoad: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
    // 总加载时间
    totalLoad: navigation.loadEventEnd - navigation.navigationStart
  };
}

/**
 * 清理所有性能监控
 */
export function cleanup(): void {
  performanceObservers.forEach(observer => observer.disconnect());
  performanceObservers = [];
  behaviorEvents = [];
}

// 私有辅助函数
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function initCoreWebVitals(): void {
  // 初始化 Core Web Vitals 监控
  if ('PerformanceObserver' in window) {
    // LCP 监控
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      performanceObservers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observation not supported');
    }
    
    // CLS 监控
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      performanceObservers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }
}

function initBehaviorTracking(): void {
  // 点击事件追踪
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    trackUserBehavior({
      type: 'click',
      target: target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className}` : ''),
      data: {
        x: event.clientX,
        y: event.clientY
      }
    });
  });
  
  // 滚动事件追踪
  let scrollTimeout: number;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      trackUserBehavior({
        type: 'scroll',
        data: {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        }
      });
    }, 100);
  });
  
  // 页面导航追踪
  window.addEventListener('beforeunload', () => {
    trackUserBehavior({
      type: 'navigation',
      data: {
        from: window.location.href,
        duration: Date.now() - performance.timing.navigationStart
      }
    });
  });
}

function initErrorTracking(): void {
  // JavaScript 错误追踪
  window.addEventListener('error', (event) => {
    const errorInfo: ErrorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId,
      userId
    };
    
    console.error('JavaScript error tracked:', errorInfo);
  });
  
  // Promise 拒绝追踪
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo: ErrorInfo = {
      message: `Unhandled Promise Rejection: ${event.reason}`,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId,
      userId,
      customData: { reason: event.reason }
    };
    
    console.error('Promise rejection tracked:', errorInfo);
  });
}

async function getCLS(): Promise<number> {
  return new Promise((resolve) => {
    let clsValue = 0;
    
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // 在页面卸载时返回 CLS 值
        window.addEventListener('beforeunload', () => {
          observer.disconnect();
          resolve(clsValue);
        });
        
        // 5秒后返回当前 CLS 值
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 5000);
      } catch (e) {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  });
}

async function getFID(): Promise<number> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const firstEntry = entries[0] as any;
            observer.disconnect();
            resolve(firstEntry.processingStart - firstEntry.startTime);
          }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
        
        // 10秒后如果没有输入事件，返回 0
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 10000);
      } catch (e) {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  });
}