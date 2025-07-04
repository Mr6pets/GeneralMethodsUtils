/**
 * 数字格式化（千分位）
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @param decimals 小数位数
 * @returns 随机数
 */
export function randomNumber(min: number, max: number, decimals: number = 0): number {
  const random = Math.random() * (max - min) + min;
  return decimals > 0 ? Number(random.toFixed(decimals)) : Math.floor(random);
}

/**
 * 数字范围限制
 * @param num 数字
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数字
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 数字转中文
 * @param num 数字
 * @returns 中文数字
 */
export function numberToChinese(num: number): string {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
  
  if (num === 0) return '零';
  
  let result = '';
  let unitIndex = 0;
  
  while (num > 0) {
    const digit = num % 10;
    if (digit !== 0) {
      result = digits[digit] + units[unitIndex] + result;
    } else if (result && !result.startsWith('零')) {
      result = '零' + result;
    }
    num = Math.floor(num / 10);
    unitIndex++;
  }
  
  return result;
}

/**
 * 字节单位转换
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}