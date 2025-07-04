/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  const map: Record<string, string> = {
    'YYYY': d.getFullYear().toString(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'DD': String(d.getDate()).padStart(2, '0'),
    'HH': String(d.getHours()).padStart(2, '0'),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'ss': String(d.getSeconds()).padStart(2, '0')
  };
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
}

/**
 * 获取相对时间
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | number): string {
  const now = new Date();
  const target = typeof date === 'number' ? new Date(date) : date;
  const diff = now.getTime() - target.getTime();
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;
  
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < month) return `${Math.floor(diff / day)}天前`;
  if (diff < year) return `${Math.floor(diff / month)}个月前`;
  return `${Math.floor(diff / year)}年前`;
}

/**
 * 判断是否为今天
 * @param date 日期对象或时间戳
 * @returns 是否为今天
 */
export function isToday(date: Date | number): boolean {
  const today = new Date();
  const target = typeof date === 'number' ? new Date(date) : date;
  
  return today.getFullYear() === target.getFullYear() &&
         today.getMonth() === target.getMonth() &&
         today.getDate() === target.getDate();
}

/**
 * 获取月份天数
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 添加时间
 * @param date 日期对象
 * @param amount 数量
 * @param unit 单位
 * @returns 新的日期对象
 */
export function addTime(
  date: Date, 
  amount: number, 
  unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
): Date {
  const result = new Date(date);
  
  switch (unit) {
    case 'year':
      result.setFullYear(result.getFullYear() + amount);
      break;
    case 'month':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'day':
      result.setDate(result.getDate() + amount);
      break;
    case 'hour':
      result.setHours(result.getHours() + amount);
      break;
    case 'minute':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'second':
      result.setSeconds(result.getSeconds() + amount);
      break;
  }
  
  return result;
}