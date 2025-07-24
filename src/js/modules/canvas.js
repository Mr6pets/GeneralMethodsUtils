/**
 * Canvas绘图工具模块
 * 提供Canvas 2D绘图的常用功能
 */

/**
 * 创建Canvas元素
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {HTMLElement} container - 容器元素
 * @returns {Object} 包含canvas和context的对象
 */
export function createCanvas(width = 800, height = 600, container = null) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    if (container) {
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    
    return {
        canvas,
        ctx,
        width,
        height
    };
}

/**
 * 绘制矩形
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {Object} options - 绘制选项
 */
export function drawRect(ctx, x, y, width, height, options = {}) {
    const {
        fillColor = '#000000',
        strokeColor = null,
        lineWidth = 1,
        fill = true,
        stroke = false
    } = options;
    
    ctx.save();
    
    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, width, height);
    }
    
    if (stroke) {
        ctx.strokeStyle = strokeColor || fillColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
    
    ctx.restore();
}

/**
 * 绘制圆形
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 圆心X坐标
 * @param {number} y - 圆心Y坐标
 * @param {number} radius - 半径
 * @param {Object} options - 绘制选项
 */
export function drawCircle(ctx, x, y, radius, options = {}) {
    const {
        fillColor = '#000000',
        strokeColor = null,
        lineWidth = 1,
        fill = true,
        stroke = false
    } = options;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    
    if (stroke) {
        ctx.strokeStyle = strokeColor || fillColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
    
    ctx.restore();
}

/**
 * 绘制线条
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {Array} points - 点数组 [{x, y}, ...]
 * @param {Object} options - 绘制选项
 */
export function drawLine(ctx, points, options = {}) {
    const {
        strokeColor = '#000000',
        lineWidth = 1,
        lineCap = 'round',
        lineJoin = 'round'
    } = options;
    
    if (points.length < 2) return;
    
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
    ctx.restore();
}

/**
 * 绘制文本
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} text - 文本内容
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {Object} options - 绘制选项
 */
export function drawText(ctx, text, x, y, options = {}) {
    const {
        font = '16px Arial',
        fillColor = '#000000',
        strokeColor = null,
        textAlign = 'left',
        textBaseline = 'top',
        maxWidth = null,
        fill = true,
        stroke = false
    } = options;
    
    ctx.save();
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    
    if (fill) {
        ctx.fillStyle = fillColor;
        if (maxWidth) {
            ctx.fillText(text, x, y, maxWidth);
        } else {
            ctx.fillText(text, x, y);
        }
    }
    
    if (stroke) {
        ctx.strokeStyle = strokeColor || fillColor;
        if (maxWidth) {
            ctx.strokeText(text, x, y, maxWidth);
        } else {
            ctx.strokeText(text, x, y);
        }
    }
    
    ctx.restore();
}

/**
 * 清空画布
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 */
export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}

/**
 * 保存Canvas为图片
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {string} filename - 文件名
 * @param {string} type - 图片类型
 */
export function saveCanvasAsImage(canvas, filename = 'canvas.png', type = 'image/png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(type);
    link.click();
}

/**
 * 获取Canvas图片数据
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {string} type - 图片类型
 * @param {number} quality - 图片质量(0-1)
 * @returns {string} Base64图片数据
 */
export function getCanvasImageData(canvas, type = 'image/png', quality = 0.92) {
    return canvas.toDataURL(type, quality);
}

/**
 * 绘制图片到Canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string|HTMLImageElement} image - 图片源
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {Promise} 绘制完成的Promise
 */
export function drawImage(ctx, image, x = 0, y = 0, width = null, height = null) {
    return new Promise((resolve, reject) => {
        let img;
        
        if (typeof image === 'string') {
            img = new Image();
            img.onload = () => {
                const drawWidth = width || img.width;
                const drawHeight = height || img.height;
                ctx.drawImage(img, x, y, drawWidth, drawHeight);
                resolve();
            };
            img.onerror = reject;
            img.src = image;
        } else if (image instanceof HTMLImageElement) {
            const drawWidth = width || image.width;
            const drawHeight = height || image.height;
            ctx.drawImage(image, x, y, drawWidth, drawHeight);
            resolve();
        } else {
            reject(new Error('Invalid image source'));
        }
    });
}

/**
 * 创建渐变
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {string} type - 渐变类型 'linear' | 'radial'
 * @param {Object} config - 渐变配置
 * @returns {CanvasGradient} 渐变对象
 */
export function createGradient(ctx, type, config) {
    let gradient;
    
    if (type === 'linear') {
        const { x0, y0, x1, y1 } = config;
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    } else if (type === 'radial') {
        const { x0, y0, r0, x1, y1, r1 } = config;
        gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }
    
    if (gradient && config.colorStops) {
        config.colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color);
        });
    }
    
    return gradient;
}

export default {
    createCanvas,
    drawRect,
    drawCircle,
    drawLine,
    drawText,
    clearCanvas,
    saveCanvasAsImage,
    getCanvasImageData,
    drawImage,
    createGradient
};