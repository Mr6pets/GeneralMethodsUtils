import { URLParams } from '../types';

/**
 * 获取 URL 参数
 * @param name 参数名
 * @param url URL地址，默认为当前页面URL
 * @returns 参数值或null
 */
export function getQueryString(name: string, url?: string): string | null {
  const targetUrl = url || window.location.href;
  const regex = new RegExp(`[?&]${name}=([^&#]*)`);
  const results = regex.exec(targetUrl);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * 解析 URL 参数为对象
 * @param url URL地址，默认为当前页面URL
 * @returns 参数对象
 */
export function parseUrlParams(url?: string): URLParams {
  const targetUrl = url || window.location.href;
  const params: URLParams = {};
  const urlObj = new URL(targetUrl);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * 构建查询字符串
 * @param params 参数对象
 * @returns 查询字符串
 */
export function buildQueryString(params: URLParams): string {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
}

/**
 * 更新 URL 参数
 * @param params 要更新的参数
 * @param url URL地址，默认为当前页面URL
 * @returns 更新后的URL
 */
export function updateUrlParams(params: URLParams, url?: string): string {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.set(key, String(params[key]));
    }
  });
  
  return urlObj.toString();
}

/**
 * 移除 URL 参数
 * @param keys 要移除的参数名
 * @param url URL地址，默认为当前页面URL
 * @returns 移除参数后的URL
 */
export function removeUrlParams(keys: string | string[], url?: string): string {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  const keysArray = Array.isArray(keys) ? keys : [keys];
  
  keysArray.forEach(key => {
    urlObj.searchParams.delete(key);
  });
  
  return urlObj.toString();
}

/**
 * 获取基础 URL
 * @param url URL地址，默认为当前页面URL
 * @returns 基础URL
 */
export function getBaseUrl(url?: string): string {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
}