import { Position, GeolocationOptions, DistanceOptions } from '../types';

/**
 * 获取当前位置
 * @param options 地理位置选项
 * @returns Promise<Position> 位置信息
 */
export function getCurrentPosition(
  options: GeolocationOptions = {}
): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
        ...options
      }
    );
  });
}

/**
 * 监听位置变化
 * @param callback 位置变化回调
 * @param options 地理位置选项
 * @returns 监听器ID
 */
export function watchPosition(
  callback: (position: Position) => void,
  options: GeolocationOptions = {}
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser');
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error) => {
      console.error('Geolocation error:', error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
      ...options
    }
  );
}

/**
 * 清除位置监听
 * @param watchId 监听器ID
 */
export function clearWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * 计算两点间距离
 * @param pos1 位置1
 * @param pos2 位置2
 * @param options 距离选项
 * @returns 距离值
 */
export function calculateDistance(
  pos1: Position,
  pos2: Position,
  options: DistanceOptions = {}
): number {
  const { unit = 'km' } = options;
  
  const R = unit === 'miles' ? 3959 : 6371; // 地球半径
  const dLat = toRadians(pos2.latitude - pos1.latitude);
  const dLon = toRadians(pos2.longitude - pos1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(pos1.latitude)) * Math.cos(toRadians(pos2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return unit === 'meters' ? distance * 1000 : distance;
}

/**
 * 角度转弧度
 * @param degrees 角度
 * @returns 弧度
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 * @param radians 弧度
 * @returns 角度
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * 计算方位角
 * @param pos1 起始位置
 * @param pos2 目标位置
 * @returns 方位角（度）
 */
export function calculateBearing(pos1: Position, pos2: Position): number {
  const dLon = toRadians(pos2.longitude - pos1.longitude);
  const lat1 = toRadians(pos1.latitude);
  const lat2 = toRadians(pos2.latitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * 判断位置是否在指定半径内
 * @param center 中心位置
 * @param target 目标位置
 * @param radius 半径
 * @param options 距离选项
 * @returns 是否在半径内
 */
export function isWithinRadius(
  center: Position,
  target: Position,
  radius: number,
  options: DistanceOptions = {}
): boolean {
  const distance = calculateDistance(center, target, options);
  return distance <= radius;
}