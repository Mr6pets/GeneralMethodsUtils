/**
 * Cookie 相关工具方法
 */

/**
 * 设置 Cookie
 * @param {string} name - Cookie 名称
 * @param {string} value - Cookie 值
 * @param {number} days - 过期天数，默认30天
 */
export function setCookie(name, value, days = 30) {
  const exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
}

/**
 * 获取 Cookie
 * @param {string} key - Cookie 名称
 * @returns {string|null} Cookie 值
 */
export function getCookie(key) {
  const getCookie = document.cookie.replace(/[ ]/g, "");
  const arrCookie = getCookie.split(";");
  
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].trim().split("=");
    if (key === arr[0]) {
      return arr[1];
    }
  }
  return null;
}

/**
 * 删除 Cookie
 * @param {string} name - Cookie 名称
 */
export function removeCookie(name) {
  setCookie(name, '', -1);
}