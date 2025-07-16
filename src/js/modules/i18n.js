/**
 * 国际化与本地化工具方法
 */

/**
 * 格式化数字
 * @param {number} number - 要格式化的数字
 * @param {string} locale - 地区代码，默认为中文
 * @returns {string} 格式化后的数字
 */
export function formatNumber(number, locale = 'zh-CN') {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * 格式化货币
 * @param {number} number - 金额
 * @param {string} currency - 货币代码，默认为人民币
 * @param {string} locale - 地区代码
 * @returns {string} 格式化后的货币
 */
export function formatCurrency(number, currency = 'CNY', locale = 'zh-CN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(number);
}

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {object} options - 格式化选项
 * @param {string} locale - 地区代码
 * @returns {string} 格式化后的日期
 */
export function formatDate(date, options = {}, locale = 'zh-CN') {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * 格式化相对时间
 * @param {Date|string|number} date - 日期
 * @param {string} locale - 地区代码
 * @returns {string} 相对时间描述
 */
export function formatRelativeTime(date, locale = 'zh-CN') {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
}

/**
 * 格式化百分比
 * @param {number} number - 数值（0-1之间）
 * @param {string} locale - 地区代码
 * @param {number} minimumFractionDigits - 最小小数位数
 * @returns {string} 格式化后的百分比
 */
export function formatPercent(number, locale = 'zh-CN', minimumFractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits
  }).format(number);
}