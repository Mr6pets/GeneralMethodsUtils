import { StorageOptions } from '../types';

/**
 * 设置本地存储（支持过期时间）
 * @param key 键名
 * @param value 值
 * @param options 配置选项
 */
export function setStorage(
  key: string, 
  value: any, 
  options: StorageOptions = {}
): void {
  const { expires, prefix = '' } = options;
  const fullKey = prefix + key;
  
  const data = {
    value,
    expires: expires ? Date.now() + expires : null
  };
  
  try {
    localStorage.setItem(fullKey, JSON.stringify(data));
  } catch (error) {
    console.error('设置本地存储失败:', error);
  }
}

/**
 * 获取本地存储
 * @param key 键名
 * @param prefix 键名前缀
 * @returns 存储的值或null
 */
export function getStorage<T = any>(key: string, prefix: string = ''): T | null {
  const fullKey = prefix + key;
  
  try {
    const item = localStorage.getItem(fullKey);
    if (!item) return null;
    
    const data = JSON.parse(item);
    
    // 检查是否过期
    if (data.expires && Date.now() > data.expires) {
      localStorage.removeItem(fullKey);
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('获取本地存储失败:', error);
    return null;
  }
}

/**
 * 删除本地存储
 * @param key 键名
 * @param prefix 键名前缀
 */
export function removeStorage(key: string, prefix: string = ''): void {
  const fullKey = prefix + key;
  localStorage.removeItem(fullKey);
}

/**
 * 清空本地存储
 * @param prefix 只清空指定前缀的项
 */
export function clearStorage(prefix?: string): void {
  if (!prefix) {
    localStorage.clear();
    return;
  }
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * 获取存储大小
 * @returns 存储大小（字节）
 */
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * 会话存储操作
 */
export const sessionStorage = {
  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('设置会话存储失败:', error);
    }
  },
  
  get<T = any>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('获取会话存储失败:', error);
      return null;
    }
  },
  
  remove(key: string): void {
    window.sessionStorage.removeItem(key);
  },
  
  clear(): void {
    window.sessionStorage.clear();
  }
};