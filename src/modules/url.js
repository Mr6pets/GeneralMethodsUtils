/**
 * URL 相关工具方法
 */

/**
 * 获取 URL 参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export function getQueryString(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]**)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 解析 URL 参数为对象
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {object} 参数对象
 */
export function parseUrlParams(url = window.location.href) {
  const params = {};
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const queryString = urlParts[1];
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
  }
  return params;
}