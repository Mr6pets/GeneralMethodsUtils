import { RetryOptions } from '../types';

/**
 * Promise重试
 * @param fn 要重试的函数
 * @param options 重试选项
 * @returns Promise结果
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { times, delay = 1000, onRetry } = options;
  let lastError: Error;
  
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < times - 1) {
        onRetry?.(lastError, i + 1);
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  throw lastError!;
}

/**
 * Promise超时
 * @param promise Promise对象
 * @param timeout 超时时间（毫秒）
 * @returns Promise结果
 */
export function timeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Promise timeout')), timeout);
    })
  ]);
}

/**
 * 并发控制
 * @param tasks 任务数组
 * @param limit 并发限制
 * @returns Promise结果数组
 */
export async function concurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const [index, task] of tasks.entries()) {
    const promise = task().then(result => {
      results[index] = result;
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }
  
  await Promise.all(executing);
  return results;
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Promise队列
 */
export class PromiseQueue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;
  
  /**
   * 添加任务到队列
   * @param task 任务函数
   * @returns Promise结果
   */
  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process(): Promise<void> {
    if (this.running || this.queue.length === 0) return;
    
    this.running = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await task();
    }
    
    this.running = false;
  }
}