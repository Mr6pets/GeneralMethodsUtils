/**
 * 性能监控与分析模块
 * 提供性能指标收集、用户行为追踪、错误监控等功能
 */

/**
 * 性能监控器类
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = {};
        this.errorHandlers = [];
        this.init();
    }
    
    init() {
        this.setupErrorHandling();
        this.setupPerformanceObserver();
    }
    
    /**
     * 设置错误处理
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.recordError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });
    }
    
    /**
     * 设置性能观察器
     */
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // 观察导航性能
            const navObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.recordNavigationMetrics(entry);
                });
            });
            navObserver.observe({ entryTypes: ['navigation'] });
            
            // 观察资源加载性能
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.recordResourceMetrics(entry);
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            
            // 观察长任务
            if ('longtask' in PerformanceObserver.supportedEntryTypes) {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.recordLongTask(entry);
                    });
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            }
        }
    }
    
    /**
     * 记录导航性能指标
     */
    recordNavigationMetrics(entry) {
        this.metrics.navigation = {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            ssl: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
            ttfb: entry.responseStart - entry.requestStart,
            download: entry.responseEnd - entry.responseStart,
            domParse: entry.domContentLoadedEventStart - entry.responseEnd,
            domReady: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            total: entry.loadEventEnd - entry.navigationStart
        };
    }
    
    /**
     * 记录资源性能指标
     */
    recordResourceMetrics(entry) {
        if (!this.metrics.resources) {
            this.metrics.resources = [];
        }
        
        this.metrics.resources.push({
            name: entry.name,
            type: this.getResourceType(entry.name),
            size: entry.transferSize,
            duration: entry.duration,
            startTime: entry.startTime
        });
    }
    
    /**
     * 记录长任务
     */
    recordLongTask(entry) {
        if (!this.metrics.longTasks) {
            this.metrics.longTasks = [];
        }
        
        this.metrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution
        });
    }
    
    /**
     * 记录错误
     */
    recordError(error) {
        if (!this.metrics.errors) {
            this.metrics.errors = [];
        }
        
        this.metrics.errors.push(error);
        
        // 触发错误处理器
        this.errorHandlers.forEach(handler => {
            try {
                handler(error);
            } catch (e) {
                console.error('Error in error handler:', e);
            }
        });
    }
    
    /**
     * 获取资源类型
     */
    getResourceType(url) {
        const extension = url.split('.').pop().toLowerCase();
        const typeMap = {
            'js': 'script',
            'css': 'stylesheet',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'gif': 'image',
            'svg': 'image',
            'woff': 'font',
            'woff2': 'font',
            'ttf': 'font'
        };
        return typeMap[extension] || 'other';
    }
    
    /**
     * 添加错误处理器
     */
    onError(handler) {
        this.errorHandlers.push(handler);
    }
    
    /**
     * 获取所有性能指标
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * 清除指标
     */
    clearMetrics() {
        this.metrics = {};
    }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor();

/**
 * 获取页面性能指标
 * @returns {Object}
 */
export function getPagePerformance() {
    return performanceMonitor.getMetrics();
}

/**
 * 监听错误
 * @param {Function} handler - 错误处理函数
 */
export function onError(handler) {
    performanceMonitor.onError(handler);
}

/**
 * 记录用户行为
 * @param {string} action - 行为类型
 * @param {Object} data - 行为数据
 */
export function trackUserAction(action, data = {}) {
    const event = {
        action,
        data,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    // 存储到本地或发送到服务器
    const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
    actions.push(event);
    
    // 只保留最近1000条记录
    if (actions.length > 1000) {
        actions.splice(0, actions.length - 1000);
    }
    
    localStorage.setItem('userActions', JSON.stringify(actions));
}

/**
 * 获取用户行为记录
 * @returns {Array}
 */
export function getUserActions() {
    return JSON.parse(localStorage.getItem('userActions') || '[]');
}

/**
 * 清除用户行为记录
 */
export function clearUserActions() {
    localStorage.removeItem('userActions');
}

/**
 * 测量函数执行时间
 * @param {Function} fn - 要测量的函数
 * @param {string} name - 测量名称
 * @returns {any}
 */
export function measureFunction(fn, name = 'function') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} execution time: ${end - start} milliseconds`);
    
    if (result instanceof Promise) {
        return result.then(res => {
            const asyncEnd = performance.now();
            console.log(`${name} async completion time: ${asyncEnd - start} milliseconds`);
            return res;
        });
    }
    
    return result;
}

/**
 * 获取内存使用情况
 * @returns {Object|null}
 */
export function getMemoryUsage() {
    if ('memory' in performance) {
        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };
    }
    return null;
}

/**
 * FPS 监控器
 */
class FPSMonitor {
    constructor() {
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();
        this.isRunning = false;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.tick();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    tick() {
        if (!this.isRunning) return;
        
        this.frames++;
        const currentTime = performance.now();
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
            this.frames = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.tick());
    }
    
    getFPS() {
        return this.fps;
    }
}

/**
 * 开始 FPS 监控
 * @returns {FPSMonitor}
 */
export function startFPSMonitor() {
    const monitor = new FPSMonitor();
    monitor.start();
    return monitor;
}

export { PerformanceMonitor };