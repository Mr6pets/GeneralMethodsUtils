/**
 * 设备检测相关工具方法
 */

/**
 * 检测设备类型
 * @returns {string} 'android' | 'ios' | 'pc'
 */
export function getDeviceType() {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  
  if (isAndroid) return 'android';
  if (isiOS) return 'ios';
  return 'pc';
}

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
export function isMobile() {
  const deviceType = getDeviceType();
  return deviceType === 'android' || deviceType === 'ios';
}

/**
 * 检测是否为微信浏览器
 * @returns {boolean}
 */
export function isWeChat() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
}

/**
 * 检测是否为支付宝浏览器
 * @returns {boolean}
 */
export function isAlipay() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('alipayclient') !== -1;
}

/**
 * 检测是否为QQ浏览器
 * @returns {boolean}
 */
export function isQQ() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('qq/') !== -1 || ua.indexOf('qqbrowser') !== -1;
}

/**
 * 获取浏览器信息
 * @returns {object} 浏览器信息对象
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
      return {
        name,
        version: match[1]
      };
    }
  }
  
  return { name: 'unknown', version: 'unknown' };
}

/**
 * 获取操作系统信息
 * @returns {string} 操作系统名称
 */
export function getOS() {
  const ua = navigator.userAgent;
  
  if (ua.indexOf('Windows') !== -1) return 'Windows';
  if (ua.indexOf('Mac OS X') !== -1) return 'macOS';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) return 'iOS';
  
  return 'Unknown';
}

/**
 * 检测是否支持触摸
 * @returns {boolean}
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}