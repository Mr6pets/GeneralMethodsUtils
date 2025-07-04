/**
 * 性能监控相关工具方法
 */

const timers = new Map();

/**
 * 开始计时
 * @param {string} name - 计时器名称
 */
export function startTimer(name) {
  timers.set(name, performance.now());
}

/**
 * 结束计时
 * @param {string} name - 计时器名称
 * @returns {number} 耗时（毫秒）
 */
export function endTimer(name) {
  const startTime = timers.get(name);
  if (!startTime) {
    console.warn(`计时器 ${name} 不存在`);
    return 0;
  }
  
  const duration = performance.now() - startTime;
  timers.delete(name);
  console.log(`${name}: ${duration.toFixed(2)}ms`);
  return duration;
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, delay = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 获取内存使用情况
 * @returns {object|null} 内存信息
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
}

/**
 * FPS 监控
 * @param {Function} callback - 回调函数
 * @returns {Function} 停止监控函数
 */
export function startFPSMonitor(callback) {
  let frames = 0;
  let lastTime = performance.now();
  let animationId;
  
  function tick() {
    frames++;
    const now = performance.now();
    
    if (now >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (now - lastTime));
      callback(fps);
      frames = 0;
      lastTime = now;
    }
    
    animationId = requestAnimationFrame(tick);
  }
  
  tick();
  
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

/**
 * 页面加载性能
 * @returns {object} 性能指标
 */
export function getPagePerformance() {
  const timing = performance.timing;
  
  return {
    // DNS 查询时间
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    // TCP 连接时间
    tcp: timing.connectEnd - timing.connectStart,
    // 请求时间
    request: timing.responseEnd - timing.requestStart,
    // 响应时间
    response: timing.responseEnd - timing.responseStart,
    // DOM 解析时间
    domParse: timing.domInteractive - timing.responseEnd,
    // 资源加载时间
    resourceLoad: timing.loadEventStart - timing.domContentLoadedEventEnd,
    // 总加载时间
    total: timing.loadEventEnd - timing.navigationStart
  };
}

/**
 * 长任务监控
 * @param {Function} callback - 回调函数
 * @returns {PerformanceObserver|null} 观察器
 */
export function observeLongTasks(callback) {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 50) { // 超过 50ms 的任务
          callback({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  }
  return null;
}