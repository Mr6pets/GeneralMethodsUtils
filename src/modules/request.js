/**
 * HTTP 请求相关工具方法
 */

/**
 * 封装的 fetch 请求
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export async function request(url, options = {}) {
  const defaultOptions = {
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
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export function get(url, params = {}, options = {}) {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return request(fullUrl, { ...options, method: 'GET' });
}

/**
 * POST 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export function post(url, data = {}, options = {}) {
  return request(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT 请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export function put(url, data = {}, options = {}) {
  return request(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE 请求
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' });
}