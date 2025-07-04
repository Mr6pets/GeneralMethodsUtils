import { RGBColor, Debounced, Throttled } from '../types';

/**
 * 生成 UUID
 * @returns UUID 字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 十六进制转 RGB
 * @param hex 十六进制颜色
 * @returns RGB 对象
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * RGB 转十六进制
 * @param r 红色值
 * @param g 绿色值
 * @param b 蓝色值
 * @returns 十六进制颜色
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 下载文件
 * @param url 文件 URL
 * @param filename 文件名
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 读取文件为文本
 * @param file 文件对象
 * @returns 文件内容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * 复制到剪贴板
 * @param text 要复制的文本
 * @returns 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 从剪贴板读取
 * @returns 剪贴板内容
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard) {
      return await navigator.clipboard.readText();
    }
    throw new Error('不支持剪贴板 API');
  } catch (error) {
    console.error('读取剪贴板失败:', error);
    return '';
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): Debounced<T> {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as Debounced<T>;
  
  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): Throttled<T> {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  
  const throttled = function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  } as Throttled<T>;
  
  throttled.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    previous = 0;
  };
  
  return throttled;
}

/**
 * 睡眠函数
 * @param ms 睡眠时间（毫秒）
 * @returns Promise 对象
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}