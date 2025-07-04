import { RequestOptions, URLParams } from '../types';

/**
 * 封装的 fetch 请求
 * @param url 请求地址
 * @param options 请求配置
 * @returns 请求结果
 */
export async function request<T = any>(
  url: string, 
  options: RequestOptions = {}
): Promise<T> {
  const defaultOptions: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 查询参数
 * @param options 请求配置
 * @returns 请求结果
 */
export function get<T = any>(
  url: string, 
  params: URLParams = {}, 
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
  
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return request<T>(fullUrl, { ...options, method: 'GET' });
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param options 请求配置
 * @returns 请求结果
 */
export function post<T = any>(
  url: string, 
  data: any = {}, 
  options: Omit<RequestOptions, 'method'> = {}
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param options 请求配置
 * @returns 请求结果
 */
export function put<T = any>(
  url: string, 
  data: any = {}, 
  options: Omit<RequestOptions, 'method'> = {}
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param options 请求配置
 * @returns 请求结果
 */
export function del<T = any>(
  url: string, 
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  return request<T>(url, { ...options, method: 'DELETE' });
}