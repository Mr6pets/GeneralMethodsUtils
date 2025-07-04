import { DeepPartial, ArrayElement } from '../types';

/**
 * 深拷贝
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  
  return obj;
}

/**
 * 数组去重
 * @param arr 要去重的数组
 * @param key 去重依据的键名或函数
 * @returns 去重后的数组
 */
export function uniqueArray<T>(
  arr: T[], 
  key?: keyof T | ((item: T) => any)
): T[] {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 对象合并
 * @param objects 要合并的对象
 * @returns 合并后的对象
 */
export function mergeObjects<T extends Record<string, any>>(...objects: T[]): T {
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = mergeObjects(result[key] || {}, obj[key]);
      } else {
        result[key] = obj[key];
      }
    });
    return result;
  }, {} as T);
}

/**
 * 数据类型判断
 * @param value 要判断的值
 * @returns 数据类型
 */
export function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 数组分组
 * @param array 要分组的数组
 * @param key 分组依据
 * @returns 分组后的对象
 */
export function groupBy<T>(
  array: T[], 
  key: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 数组扁平化
 * @param arr 要扁平化的数组
 * @param depth 扁平化深度
 * @returns 扁平化后的数组
 */
export function flatten<T>(arr: (T | T[])[], depth: number = 1): T[] {
  if (depth === 0) return arr as T[];
  return arr.reduce((acc: T[], val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}