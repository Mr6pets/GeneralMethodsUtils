/**
 * 字符串处理相关工具方法
 */

/**
 * 转换为驼峰命名
 * @param {string} str - 要转换的字符串
 * @returns {string} 驼峰命名字符串
 */
export function toCamelCase(str) {
  return str.replace(/[-_\s]+(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * 转换为短横线命名
 * @param {string} str - 要转换的字符串
 * @returns {string} 短横线命名字符串
 */
export function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * 转换为下划线命名
 * @param {string} str - 要转换的字符串
 * @returns {string} 下划线命名字符串
 */
export function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 字符串截取
 * @param {string} str - 要截取的字符串
 * @param {number} length - 截取长度
 * @param {string} suffix - 后缀
 * @returns {string} 截取后的字符串
 */
export function truncate(str, length, suffix = '...') {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * 模板字符串
 * @param {string} str - 模板字符串
 * @param {object} data - 数据对象
 * @returns {string} 替换后的字符串
 */
export function template(str, data) {
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} chars - 字符集
 * @returns {string} 随机字符串
 */
export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 简单编码
 * @param {string} str - 要编码的字符串
 * @returns {string} 编码后的字符串
 */
export function encode(str) {
  return btoa(encodeURIComponent(str));
}

/**
 * 简单解码
 * @param {string} str - 要解码的字符串
 * @returns {string} 解码后的字符串
 */
export function decode(str) {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    return str;
  }
}