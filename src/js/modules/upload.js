/**
 * 文件上传相关工具方法
 */

/**
 * 文件上传
 * @param {string} url - 上传地址
 * @param {File|FileList} files - 文件对象
 * @param {object} options - 上传配置
 * @returns {Promise} 上传结果
 */
export function uploadFile(url, files, options = {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    const config = {
      fieldName: 'file',
      onProgress: null,
      headers: {},
      ...options
    };
    
    // 处理单个文件或多个文件
    if (files instanceof FileList) {
      Array.from(files).forEach((file, index) => {
        formData.append(`${config.fieldName}${index}`, file);
      });
    } else {
      formData.append(config.fieldName, files);
    }
    
    // 添加额外的表单数据
    if (config.data) {
      Object.keys(config.data).forEach(key => {
        formData.append(key, config.data[key]);
      });
    }
    
    const xhr = new XMLHttpRequest();
    
    // 上传进度监听
    if (config.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          config.onProgress(percentComplete, e);
        }
      });
    }
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('POST', url);
    
    // 设置请求头
    Object.keys(config.headers).forEach(key => {
      xhr.setRequestHeader(key, config.headers[key]);
    });
    
    xhr.send(formData);
  });
}

/**
 * 图片压缩上传
 * @param {File} file - 图片文件
 * @param {object} options - 压缩配置
 * @returns {Promise<File>} 压缩后的文件
 */
export function compressImage(file, options = {}) {
  return new Promise((resolve, reject) => {
    const config = {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      ...options
    };
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img;
      
      if (width > config.maxWidth) {
        height = (height * config.maxWidth) / width;
        width = config.maxWidth;
      }
      
      if (height > config.maxHeight) {
        width = (width * config.maxHeight) / height;
        height = config.maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为 Blob
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, file.type, config.quality);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 文件类型验证
 * @param {File} file - 文件对象
 * @param {Array} allowedTypes - 允许的文件类型
 * @returns {boolean} 是否通过验证
 */
export function validateFileType(file, allowedTypes = []) {
  if (!allowedTypes.length) return true;
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.includes(type);
  });
}

/**
 * 文件大小验证
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大文件大小（字节）
 * @returns {boolean} 是否通过验证
 */
export function validateFileSize(file, maxSize) {
  return file.size <= maxSize;
}