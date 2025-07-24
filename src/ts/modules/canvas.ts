/**
 * Canvas绘图工具模块
 * 提供Canvas 2D绘图的常用功能
 */

// 类型定义
export interface CanvasConfig {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export interface DrawOptions {
    fillColor?: string;
    strokeColor?: string;
    lineWidth?: number;
    fill?: boolean;
    stroke?: boolean;
}

export interface LineOptions {
    strokeColor?: string;
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
}

export interface TextOptions {
    font?: string;
    fillColor?: string;
    strokeColor?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    maxWidth?: number;
    fill?: boolean;
    stroke?: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface ColorStop {
    offset: number;
    color: string;
}

export interface LinearGradientConfig {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    colorStops: ColorStop[];
}

export interface RadialGradientConfig {
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
    colorStops: ColorStop[];
}

/**
 * 创建Canvas元素
 * @param width - 画布宽度
 * @param height - 画布高度
 * @param container - 容器元素
 * @returns 包含canvas和context的对象
 */
export function createCanvas(
    width: number = 800,
    height: number = 600,
    container: HTMLElement | null = null
): CanvasConfig {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    if (container) {
        container.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D context');
    }
    
    return {
        canvas,
        ctx,
        width,
        height
    };
}

/**
 * 绘制矩形
 * @param ctx - Canvas上下文
 * @param x - X坐标
 * @param y - Y坐标
 * @param width - 宽度
 * @param height - 高度
 * @param options - 绘制选项
 */
export function drawRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    options: DrawOptions = {}
): void {
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
 * @param ctx - Canvas上下文
 * @param x - 圆心X坐标
 * @param y - 圆心Y坐标
 * @param radius - 半径
 * @param options - 绘制选项
 */
export function drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    options: DrawOptions = {}
): void {
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
 * @param ctx - Canvas上下文
 * @param points - 点数组
 * @param options - 绘制选项
 */
export function drawLine(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    options: LineOptions = {}
): void {
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
 * @param ctx - Canvas上下文
 * @param text - 文本内容
 * @param x - X坐标
 * @param y - Y坐标
 * @param options - 绘制选项
 */
export function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    options: TextOptions = {}
): void {
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
 * @param ctx - Canvas上下文
 * @param width - 画布宽度
 * @param height - 画布高度
 */
export function clearCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): void {
    ctx.clearRect(0, 0, width, height);
}

/**
 * 保存Canvas为图片
 * @param canvas - Canvas元素
 * @param filename - 文件名
 * @param type - 图片类型
 */
export function saveCanvasAsImage(
    canvas: HTMLCanvasElement,
    filename: string = 'canvas.png',
    type: string = 'image/png'
): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(type);
    link.click();
}

/**
 * 获取Canvas图片数据
 * @param canvas - Canvas元素
 * @param type - 图片类型
 * @param quality - 图片质量(0-1)
 * @returns Base64图片数据
 */
export function getCanvasImageData(
    canvas: HTMLCanvasElement,
    type: string = 'image/png',
    quality: number = 0.92
): string {
    return canvas.toDataURL(type, quality);
}

/**
 * 绘制图片到Canvas
 * @param ctx - Canvas上下文
 * @param image - 图片源
 * @param x - X坐标
 * @param y - Y坐标
 * @param width - 宽度
 * @param height - 高度
 * @returns 绘制完成的Promise
 */
export function drawImage(
    ctx: CanvasRenderingContext2D,
    image: string | HTMLImageElement,
    x: number = 0,
    y: number = 0,
    width: number | null = null,
    height: number | null = null
): Promise<void> {
    return new Promise((resolve, reject) => {
        let img: HTMLImageElement;
        
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
 * @param ctx - Canvas上下文
 * @param type - 渐变类型
 * @param config - 渐变配置
 * @returns 渐变对象
 */
export function createGradient(
    ctx: CanvasRenderingContext2D,
    type: 'linear',
    config: LinearGradientConfig
): CanvasGradient;
export function createGradient(
    ctx: CanvasRenderingContext2D,
    type: 'radial',
    config: RadialGradientConfig
): CanvasGradient;
export function createGradient(
    ctx: CanvasRenderingContext2D,
    type: 'linear' | 'radial',
    config: LinearGradientConfig | RadialGradientConfig
): CanvasGradient {
    let gradient: CanvasGradient;
    
    if (type === 'linear') {
        const { x0, y0, x1, y1 } = config as LinearGradientConfig;
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    } else if (type === 'radial') {
        const { x0, y0, r0, x1, y1, r1 } = config as RadialGradientConfig;
        gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    } else {
        throw new Error('Invalid gradient type');
    }
    
    if (config.colorStops) {
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