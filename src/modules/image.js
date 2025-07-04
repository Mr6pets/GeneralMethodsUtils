/**
 * 图片处理相关工具方法
 */

/**
 * 图片加载
 * @param {string} src - 图片地址
 * @returns {Promise<HTMLImageElement>} 图片元素
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 图片预览
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 预览 URL
 */
export function previewImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('不是有效的图片文件'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 图片裁剪
 * @param {File|HTMLImageElement} source - 图片源
 * @param {object} options - 裁剪选项
 * @returns {Promise<Blob>} 裁剪后的图片
 */
export function cropImage(source, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        quality: 0.9,
        format: 'image/jpeg',
        ...options
      };
      
      let img;
      if (source instanceof File) {
        const url = await previewImage(source);
        img = await loadImage(url);
      } else {
        img = source;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = config.width;
      canvas.height = config.height;
      
      ctx.drawImage(
        img,
        config.x, config.y, config.width, config.height,
        0, 0, config.width, config.height
      );
      
      canvas.toBlob(resolve, config.format, config.quality);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 添加水印
 * @param {HTMLImageElement|string} image - 图片或图片URL
 * @param {string} watermark - 水印文字
 * @param {object} options - 水印选项
 * @returns {Promise<string>} 带水印的图片 URL
 */
export function addWatermark(image, watermark, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const config = {
        position: 'bottom-right',
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        ...options
      };
      
      let img;
      if (typeof image === 'string') {
        img = await loadImage(image);
      } else {
        img = image;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 设置水印样式
      ctx.font = `${config.fontSize}px Arial`;
      ctx.fillStyle = config.color;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // 计算水印位置
      let x, y;
      switch (config.position) {
        case 'top-left':
          x = config.padding;
          y = config.fontSize + config.padding;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          break;
        case 'top-right':
          x = canvas.width - config.padding;
          y = config.fontSize + config.padding;
          ctx.textBaseline = 'top';
          break;
        case 'bottom-left':
          x = config.padding;
          y = canvas.height - config.padding;
          ctx.textAlign = 'left';
          break;
        default: // bottom-right
          x = canvas.width - config.padding;
          y = canvas.height - config.padding;
      }
      
      // 绘制水印
      ctx.fillText(watermark, x, y);
      
      resolve(canvas.toDataURL());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 图片转 Base64
 * @param {File} file - 图片文件
 * @returns {Promise<string>} Base64 字符串
 */
export function imageToBase64(file) {
  return previewImage(file);
}

/**
 * Base64 转 Blob
 * @param {string} base64 - Base64 字符串
 * @returns {Blob} Blob 对象
 */
export function base64ToBlob(base64) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * 获取图片信息
 * @param {File|string} source - 图片文件或URL
 * @returns {Promise<object>} 图片信息
 */
export function getImageInfo(source) {
  return new Promise(async (resolve, reject) => {
    try {
      let img;
      if (source instanceof File) {
        const url = await previewImage(source);
        img = await loadImage(url);
      } else {
        img = await loadImage(source);
      }
      
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        ratio: img.naturalWidth / img.naturalHeight,
        size: source instanceof File ? source.size : null,
        type: source instanceof File ? source.type : null
      });
    } catch (error) {
      reject(error);
    }
  });
}