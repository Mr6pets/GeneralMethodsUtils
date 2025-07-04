/**
 * Cookie 相关工具方法
 */

/**
 * 设置 Cookie
 * @param {string} name - Cookie 名称
 * @param {string} value - Cookie 值
 * @param {number|object} options - 过期天数或配置对象
 */
export function setCookie(name, value, options = {}) {
  // 兼容旧版本的数字参数
  if (typeof options === 'number') {
    options = { days: options };
  }
  
  const config = {
    days: 30,
    path: '/',
    domain: '',
    secure: false,
    sameSite: 'Lax',
    ...options
  };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (config.days) {
    const exp = new Date();
    exp.setTime(exp.getTime() + config.days * 24 * 60 * 60 * 1000);
    cookieString += `;expires=${exp.toUTCString()}`;
  }
  
  if (config.path) {
    cookieString += `;path=${config.path}`;
  }
  
  if (config.domain) {
    cookieString += `;domain=${config.domain}`;
  }
  
  if (config.secure) {
    cookieString += ';secure';
  }
  
  if (config.sameSite) {
    cookieString += `;samesite=${config.sameSite}`;
  }
  
  document.cookie = cookieString;
}

/**
 * 获取 Cookie
 * @param {string} key - Cookie 名称
 * @returns {string|null} Cookie 值
 */
export function getCookie(key) {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === key) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * 删除 Cookie
 * @param {string} name - Cookie 名称
 * @param {object} options - 删除配置
 */
export function removeCookie(name, options = {}) {
  setCookie(name, '', { ...options, days: -1 });
}

/**
 * 获取所有 Cookie
 * @returns {object} 所有 Cookie 的键值对
 */
export function getAllCookies() {
  const cookies = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(value || '');
    }
  });
  return cookies;
}

/**
 * 检查 Cookie 是否存在
 * @param {string} name - Cookie 名称
 * @returns {boolean} 是否存在
 */
export function hasCookie(name) {
  return getCookie(name) !== null;
}