import { HashAlgorithm, CryptoOptions } from '../types';

/**
 * 生成哈希值
 * @param data 要哈希的数据
 * @param algorithm 哈希算法
 * @returns Promise<string> 哈希值
 */
export async function hash(
  data: string,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Failed to generate hash');
  }
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param charset 字符集
 * @returns 随机字符串
 */
export function generateRandomString(
  length: number = 16,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(array[i] % charset.length);
  }
  
  return result;
}

/**
 * 生成 UUID v4
 * @returns UUID v4 字符串
 */
export function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Base64 编码
 * @param data 要编码的字符串
 * @returns Base64 编码字符串
 */
export function encodeBase64(data: string): string {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (error) {
    console.error('Base64 encoding error:', error);
    throw new Error('Failed to encode Base64');
  }
}

/**
 * Base64 解码
 * @param data Base64 编码字符串
 * @returns 解码后的字符串
 */
export function decodeBase64(data: string): string {
  try {
    return decodeURIComponent(escape(atob(data)));
  } catch (error) {
    console.error('Base64 decoding error:', error);
    throw new Error('Failed to decode Base64');
  }
}

/**
 * 生成安全随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 安全随机数
 */
export function secureRandom(min: number = 0, max: number = 1): number {
  const range = max - min;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] / (0xFFFFFFFF + 1)) * range;
}