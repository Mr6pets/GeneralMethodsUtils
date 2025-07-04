/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * 驼峰命名转换
 * @param str 字符串
 * @returns 驼峰命名字符串
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * 短横线命名转换
 * @param str 字符串
 * @returns 短横线命名字符串
 */
export function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

/**
 * 下划线命名转换
 * @param str 字符串
 * @returns 下划线命名字符串
 */
export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * 截断字符串
 * @param str 字符串
 * @param length 最大长度
 * @param suffix 后缀
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 移除HTML标签
 * @param str 包含HTML的字符串
 * @returns 纯文本字符串
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 转义HTML字符
 * @param str 字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 反转义HTML字符
 * @param str 字符串
 * @returns 反转义后的字符串
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  return str.replace(/&(amp|lt|gt|quot|#39);/g, (m, p) => map[m]);
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param chars 字符集
 * @returns 随机字符串
 */
export function randomString(
  length: number, 
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}