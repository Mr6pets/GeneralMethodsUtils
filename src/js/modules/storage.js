/**
 * 本地存储相关工具方法
 */

/**
 * 设置 localStorage
 * @param {string} key - 键名
 * @param {any} value - 值
 * @param {number} expire - 过期时间（毫秒）
 */
export function setStorage(key, value, expire) {
  const data = {
    value,
    expire: expire ? Date.now() + expire : null
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage 设置失败:', e);
  }
}

/**
 * 获取 localStorage
 * @param {string} key - 键名
 * @returns {any} 值
 */
export function getStorage(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const data = JSON.parse(item);
    
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data.value;
  } catch (e) {
    console.error('localStorage 获取失败:', e);
    return null;
  }
}

/**
 * 删除 localStorage
 * @param {string} key - 键名
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('localStorage 删除失败:', e);
  }
}

/**
 * 清空 localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('localStorage 清空失败:', e);
  }
}

/**
 * 设置 sessionStorage
 * @param {string} key - 键名
 * @param {any} value - 值
 */
export function setSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('sessionStorage 设置失败:', e);
  }
}

/**
 * 获取 sessionStorage
 * @param {string} key - 键名
 * @returns {any} 值
 */
export function getSession(key) {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('sessionStorage 获取失败:', e);
    return null;
  }
}