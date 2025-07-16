/**
 * 地理位置相关工具方法
 */

/**
 * 获取当前位置
 * @param {object} options - 位置选项
 * @returns {Promise<GeolocationPosition>} 位置信息
 */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
      ...options
    };
    
    navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
  });
}

/**
 * 监听位置变化
 * @param {Function} callback - 回调函数
 * @param {object} options - 位置选项
 * @returns {number} 监听器ID
 */
export function watchPosition(callback, options = {}) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser');
  }
  
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };
  
  return navigator.geolocation.watchPosition(callback, null, defaultOptions);
}

/**
 * 停止监听位置变化
 * @param {number} watchId - 监听器ID
 */
export function clearWatch(watchId) {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * 计算两点之间的距离（使用Haversine公式）
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lon1 - 第一个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @param {number} lon2 - 第二个点的经度
 * @returns {number} 距离（千米）
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径（千米）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 * @param {number} radians - 弧度
 * @returns {number} 角度
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * 计算两点之间的方位角
 * @param {number} lat1 - 起点纬度
 * @param {number} lon1 - 起点经度
 * @param {number} lat2 - 终点纬度
 * @param {number} lon2 - 终点经度
 * @returns {number} 方位角（度）
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * 检查点是否在指定半径内
 * @param {number} centerLat - 中心点纬度
 * @param {number} centerLon - 中心点经度
 * @param {number} pointLat - 检查点纬度
 * @param {number} pointLon - 检查点经度
 * @param {number} radius - 半径（千米）
 * @returns {boolean} 是否在范围内
 */
export function isWithinRadius(centerLat, centerLon, pointLat, pointLon, radius) {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radius;
}