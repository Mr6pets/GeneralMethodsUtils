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