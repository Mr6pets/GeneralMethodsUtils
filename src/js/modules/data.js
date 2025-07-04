/**
 * 数据处理相关工具方法
 */

/**
 * 深拷贝
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}

/**
 * 数组去重
 * @param {Array} arr - 要去重的数组
 * @param {string|Function} key - 去重依据的键名或函数
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(arr, key) {
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
 * @param {...object} objects - 要合并的对象
 * @returns {object} 合并后的对象
 */
export function mergeObjects(...objects) {
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = mergeObjects(result[key] || {}, obj[key]);
      } else {
        result[key] = obj[key];
      }
    });
    return result;
  }, {});
}

/**
 * 数据类型判断
 * @param {any} value - 要判断的值
 * @returns {string} 数据类型
 */
export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 数组分组
 * @param {Array} array - 要分组的数组
 * @param {string|Function} key - 分组依据
 * @returns {object} 分组后的对象
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * 数组扁平化
 * @param {Array} arr - 要扁平化的数组
 * @param {number} depth - 扁平化深度
 * @returns {Array} 扁平化后的数组
 */
export function flatten(arr, depth = 1) {
  if (depth === 0) return arr;
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}