/**
 * 加密与安全相关工具方法
 */

/**
 * 生成哈希值
 * @param {string} text - 要哈希的文本
 * @param {string} algorithm - 哈希算法，默认为SHA-256
 * @returns {Promise<string>} 哈希值
 */
export async function hash(text, algorithm = 'SHA-256') {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} charset - 字符集
 * @returns {string} 随机字符串
 */
export function generateRandomString(length = 16, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  randomValues.forEach(value => {
    result += charset.charAt(value % charset.length);
  });
  
  return result;
}

/**
 * 生成UUID v4
 * @returns {string} UUID字符串
 */
export function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 简单的文本加密（Base64编码）
 * @param {string} text - 要加密的文本
 * @returns {string} 加密后的文本
 */
export function encodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

/**
 * 简单的文本解密（Base64解码）
 * @param {string} encodedText - 要解密的文本
 * @returns {string} 解密后的文本
 */
export function decodeBase64(encodedText) {
  return decodeURIComponent(escape(atob(encodedText)));
}

/**
 * 生成安全的随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机数
 */
export function secureRandom(min = 0, max = 1) {
  const range = max - min;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return min + (randomBuffer[0] / (0xFFFFFFFF + 1)) * range;
}