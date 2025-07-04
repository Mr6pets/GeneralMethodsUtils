/**
 * Promise 相关工具方法
 */

/**
 * 延迟执行
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} Promise 对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 超时控制
 * @param {Promise} promise - 原始 Promise
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise} 带超时控制的 Promise
 */
export function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), timeout)
    )
  ]);
}

/**
 * 重试机制
 * @param {Function} fn - 要重试的函数
 * @param {number} retries - 重试次数
 * @param {number} delay - 重试间隔（毫秒）
 * @returns {Promise} Promise 对象
 */
export async function retry(fn, retries = 3, delayMs = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await delay(delayMs);
      return retry(fn, retries - 1, delayMs);
    }
    throw error;
  }
}

/**
 * 并发控制
 * @param {Array} tasks - 任务数组
 * @param {number} limit - 并发限制
 * @returns {Promise} Promise 对象
 */
export async function concurrentLimit(tasks, limit = 3) {
  const results = [];
  const executing = [];
  
  for (const [index, task] of tasks.entries()) {
    const promise = Promise.resolve().then(() => task()).then(
      result => ({ status: 'fulfilled', value: result, index }),
      error => ({ status: 'rejected', reason: error, index })
    );
    
    results.push(promise);
    
    if (tasks.length >= limit) {
      executing.push(promise);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }
  }
  
  return Promise.all(results);
}

/**
 * 缓存 Promise 结果
 * @param {Function} fn - 要缓存的函数
 * @param {number} ttl - 缓存时间（毫秒）
 * @returns {Function} 缓存包装函数
 */
export function memoizePromise(fn, ttl = 60000) {
  const cache = new Map();
  
  return async function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }
    
    try {
      const result = await fn.apply(this, args);
      cache.set(key, { value: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  };
}