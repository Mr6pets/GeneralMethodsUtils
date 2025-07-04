/**
 * URL 相关工具方法
 */

/**
 * 获取 URL 参数
 * @param {string} name - 参数名
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {string|null} 参数值
 */
export function getQueryString(name, url = window.location.href) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(name);
}

/**
 * 解析 URL 参数为对象
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {object} 参数对象
 */
export function parseUrlParams(url = window.location.href) {
  const params = {};
  const urlObj = new URL(url);
  
  for (const [key, value] of urlObj.searchParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * 构建 URL 查询字符串
 * @param {object} params - 参数对象
 * @returns {string} 查询字符串
 */
export function buildQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 更新 URL 参数
 * @param {object} params - 要更新的参数
 * @param {string} url - 目标 URL，默认为当前页面 URL
 * @returns {string} 更新后的 URL
 */
export function updateUrlParams(params, url = window.location.href) {
  const urlObj = new URL(url);
  
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      urlObj.searchParams.delete(key);
    } else {
      urlObj.searchParams.set(key, params[key]);
    }
  });
  
  return urlObj.toString();
}

/**
 * 移除 URL 参数
 * @param {string|Array} keys - 要移除的参数名
 * @param {string} url - 目标 URL，默认为当前页面 URL
 * @returns {string} 移除参数后的 URL
 */
export function removeUrlParams(keys, url = window.location.href) {
  const urlObj = new URL(url);
  const keysArray = Array.isArray(keys) ? keys : [keys];
  
  keysArray.forEach(key => {
    urlObj.searchParams.delete(key);
  });
  
  return urlObj.toString();
}

/**
 * 获取 URL 的基础部分（不包含查询参数和哈希）
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {string} 基础 URL
 */
export function getBaseUrl(url = window.location.href) {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
}