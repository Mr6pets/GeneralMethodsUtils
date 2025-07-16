import { I18nOptions, NumberFormatOptions, DateFormatOptions } from '../types';

/**
 * 格式化数字
 * @param value 数字值
 * @param options 格式化选项
 * @param locale 语言环境
 * @returns 格式化后的字符串
 */
export function formatNumber(
  value: number,
  options: NumberFormatOptions = {},
  locale: string = 'zh-CN'
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    console.error('Number formatting error:', error);
    return value.toString();
  }
}

/**
 * 格式化货币
 * @param value 金额
 * @param currency 货币代码
 * @param locale 语言环境
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  value: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return formatNumber(value, {
    style: 'currency',
    currency
  }, locale);
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param options 格式化选项
 * @param locale 语言环境
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | number,
  options: DateFormatOptions = {},
  locale: string = 'zh-CN'
): string {
  try {
    const dateObj = typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return new Date(date).toString();
  }
}

/**
 * 格式化相对时间
 * @param date 日期对象或时间戳
 * @param locale 语言环境
 * @returns 相对时间字符串
 */
export function formatRelativeTime(
  date: Date | number,
  locale: string = 'zh-CN'
): string {
  try {
    const now = new Date();
    const targetDate = typeof date === 'number' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
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
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return new Date(date).toString();
  }
}

/**
 * 格式化百分比
 * @param value 数值（0-1之间）
 * @param locale 语言环境
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(
  value: number,
  locale: string = 'zh-CN'
): string {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }, locale);
}