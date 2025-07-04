import { PerformanceMetrics } from '../types';

/**
 * 获取页面性能指标
 * @returns 性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics | null {
  if (!window.performance || !window.performance.timing) {
    return null;
  }
  
  const timing = window.performance.timing;
  const navigation = timing.navigationStart;
  
  return {
    loadTime: timing.loadEventEnd - navigation,
    domReady: timing.domContentLoadedEventEnd - navigation,
    firstPaint: getFirstPaint(),
    firstContentfulPaint: getFirstContentfulPaint()
  };
}

/**
 * 获取首次绘制时间
 * @returns 首次绘制时间
 */
function getFirstPaint(): number {
  const paintEntries = performance.getEntriesByType('paint');
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
  return firstPaint ? firstPaint.startTime : 0;
}

/**
 * 获取首次内容绘制时间
 * @returns 首次内容绘制时间
 */
function getFirstContentfulPaint(): number {
  const paintEntries = performance.getEntriesByType('paint');
  const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();
  
  /**
   * 标记时间点
   * @param name 标记名称
   */
  mark(name: string): void {
    const time = performance.now();
    this.marks.set(name, time);
    performance.mark(name);
  }
  
  /**
   * 测量两个时间点之间的时间
   * @param name 测量名称
   * @param startMark 开始标记
   * @param endMark 结束标记
   * @returns 时间差（毫秒）
   */
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    
    if (startTime === undefined) {
      throw new Error(`标记 "${startMark}" 不存在`);
    }
    
    const duration = (endTime || performance.now()) - startTime;
    this.measures.set(name, duration);
    
    if (endMark) {
      performance.measure(name, startMark, endMark);
    } else {
      performance.measure(name, startMark);
    }
    
    return duration;
  }
  
  /**
   * 获取所有测量结果
   * @returns 测量结果
   */
  getMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }
  
  /**
   * 清除所有标记和测量
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * 函数执行时间测量
 * @param fn 要测量的函数
 * @param name 测量名称
 * @returns 包装后的函数
 */
export function measureFunction<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  const measureName = name || fn.name || 'anonymous';
  
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    console.log(`${measureName} 执行时间: ${endTime - startTime}ms`);
    
    return result;
  }) as T;
}

/**
 * 异步函数执行时间测量
 * @param fn 要测量的异步函数
 * @param name 测量名称
 * @returns 包装后的函数
 */
export function measureAsyncFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name?: string
): T {
  const measureName = name || fn.name || 'anonymous';
  
  return (async (...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = await fn(...args);
    const endTime = performance.now();
    
    console.log(`${measureName} 执行时间: ${endTime - startTime}ms`);
    
    return result;
  }) as T;
}