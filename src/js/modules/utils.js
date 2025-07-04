/**
 * 通用工具函数
 */

/**
 * 生成 UUID
 * @returns {string} UUID 字符串
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 十六进制转 RGB
 * @param {string} hex - 十六进制颜色
 * @returns {object} RGB 对象
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * RGB 转十六进制
 * @param {number} r - 红色值
 * @param {number} g - 绿色值
 * @param {number} b - 蓝色值
 * @returns {string} 十六进制颜色
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 下载文件
 * @param {string} url - 文件 URL
 * @param {string} filename - 文件名
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 读取文件为文本
 * @param {File} file - 文件对象
 * @returns {Promise<string>} 文件内容
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * 复制到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyToClipboard(text) {
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
 * @returns {Promise<string>} 剪贴板内容
 */
export async function readFromClipboard() {
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
 * 全屏显示
 * @param {Element} element - 要全屏的元素
 */
export function requestFullscreen(element = document.documentElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

/**
 * 退出全屏
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * 检查是否全屏
 * @returns {boolean} 是否全屏
 */
export function isFullscreen() {
  return !!(document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.msFullscreenElement);
}

/**
 * 获取浏览器信息
 * @returns {object} 浏览器信息
 */
export function getBrowserInfo() {
  const ua = navigator.userAgent;
  const browsers = {
    chrome: /Chrome\/(\d+)/.exec(ua),
    firefox: /Firefox\/(\d+)/.exec(ua),
    safari: /Safari\/(\d+)/.exec(ua),
    edge: /Edge\/(\d+)/.exec(ua),
    ie: /MSIE (\d+)/.exec(ua) || /Trident.*rv:(\d+)/.exec(ua)
  };
  
  for (const [name, match] of Object.entries(browsers)) {
    if (match) {
      return { name, version: match[1] };
    }
  }
  
  return { name: 'unknown', version: 'unknown' };
}

/**
 * 睡眠函数
 * @param {number} ms - 睡眠时间（毫秒）
 * @returns {Promise} Promise 对象
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}