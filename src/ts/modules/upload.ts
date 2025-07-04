import { UploadOptions, UploadResult } from '../types';

/**
 * 文件上传
 * @param file 文件对象
 * @param options 上传配置
 * @returns 上传结果
 */
export function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const {
      url,
      method = 'POST',
      headers = {},
      data = {},
      onProgress,
      onSuccess,
      onError
    } = options;
    
    const formData = new FormData();
    formData.append('file', file);
    
    // 添加额外数据
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    const xhr = new XMLHttpRequest();
    
    // 上传进度
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });
    
    // 上传完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const result: UploadResult = { success: true, data: response };
          onSuccess?.(response);
          resolve(result);
        } catch (error) {
          const result: UploadResult = { 
            success: false, 
            error: '响应解析失败' 
          };
          onError?.(new Error('响应解析失败'));
          resolve(result);
        }
      } else {
        const result: UploadResult = { 
          success: false, 
          error: `HTTP ${xhr.status}: ${xhr.statusText}` 
        };
        onError?.(new Error(result.error));
        resolve(result);
      }
    });
    
    // 上传错误
    xhr.addEventListener('error', () => {
      const result: UploadResult = { 
        success: false, 
        error: '网络错误' 
      };
      onError?.(new Error('网络错误'));
      resolve(result);
    });
    
    // 设置请求头
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    
    xhr.open(method, url);
    xhr.send(formData);
  });
}

/**
 * 多文件上传
 * @param files 文件数组
 * @param options 上传配置
 * @returns 上传结果数组
 */
export function uploadMultipleFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const promises = files.map(file => uploadFile(file, options));
  return Promise.all(promises);
}

/**
 * 分片上传
 * @param file 文件对象
 * @param options 上传配置
 * @param chunkSize 分片大小（字节）
 * @returns 上传结果
 */
export function uploadFileInChunks(
  file: File,
  options: UploadOptions,
  chunkSize: number = 1024 * 1024 // 1MB
): Promise<UploadResult> {
  return new Promise(async (resolve) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedChunks = 0;
    
    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        const chunkData = {
          ...options.data,
          chunkIndex: i,
          totalChunks,
          fileName: file.name
        };
        
        const result = await uploadFile(chunk as File, {
          ...options,
          data: chunkData
        });
        
        if (!result.success) {
          resolve(result);
          return;
        }
        
        uploadedChunks++;
        const progress = (uploadedChunks / totalChunks) * 100;
        options.onProgress?.(progress);
      }
      
      const result: UploadResult = { success: true };
      options.onSuccess?.(result);
      resolve(result);
    } catch (error) {
      const result: UploadResult = { 
        success: false, 
        error: error instanceof Error ? error.message : '分片上传失败' 
      };
      options.onError?.(error as Error);
      resolve(result);
    }
  });
}