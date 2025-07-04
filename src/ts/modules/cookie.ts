import { CookieOptions } from '../types';

/**
 * 设置 Cookie
 * @param name Cookie 名称
 * @param value Cookie 值
 * @param options Cookie 配置选项
 */
export function setCookie(
  name: string, 
  value: string, 
  options?: CookieOptions | number
): void {
  let opts: CookieOptions = {};
  
  // 兼容旧版本（第三个参数为天数）
  if (typeof options === 'number') {
    opts.days = options;
  } else if (options) {
    opts = options;
  }
  
  let expires = '';
  if (opts.days) {
    const date = new Date();
    date.setTime(date.getTime() + (opts.days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  const path = opts.path ? `; path=${opts.path}` : '';
  const domain = opts.domain ? `; domain=${opts.domain}` : '';
  const secure = opts.secure ? '; secure' : '';
  const sameSite = opts.sameSite ? `; samesite=${opts.sameSite}` : '';
  
  document.cookie = `${name}=${value}${expires}${path}${domain}${secure}${sameSite}`;
}

/**
 * 获取 Cookie 值
 * @param key Cookie 名称
 * @returns Cookie 值或 null
 */
export function getCookie(key: string): string | null {
  const name = key + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/**
 * 删除 Cookie
 * @param name Cookie 名称
 * @param options Cookie 配置选项
 */
export function removeCookie(
  name: string, 
  options?: Pick<CookieOptions, 'path' | 'domain'>
): void {
  setCookie(name, '', { ...options, days: -1 });
}

/**
 * 获取所有 Cookie
 * @returns Cookie 对象
 */
export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  const decodedCookie = decodeURIComponent(document.cookie);
  
  if (decodedCookie) {
    decodedCookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    });
  }
  
  return cookies;
}

/**
 * 检查 Cookie 是否存在
 * @param name Cookie 名称
 * @returns 是否存在
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}