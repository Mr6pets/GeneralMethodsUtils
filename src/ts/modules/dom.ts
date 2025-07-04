/**
 * 添加CSS类
 * @param element 元素
 * @param className 类名
 */
export function addClass(element: Element, className: string): void {
  element.classList.add(className);
}

/**
 * 移除CSS类
 * @param element 元素
 * @param className 类名
 */
export function removeClass(element: Element, className: string): void {
  element.classList.remove(className);
}

/**
 * 切换CSS类
 * @param element 元素
 * @param className 类名
 * @returns 是否包含该类
 */
export function toggleClass(element: Element, className: string): boolean {
  return element.classList.toggle(className);
}

/**
 * 检查是否包含CSS类
 * @param element 元素
 * @param className 类名
 * @returns 是否包含
 */
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * 获取元素位置信息
 * @param element 元素
 * @returns 位置信息
 */
export function getElementPosition(element: Element): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
}

/**
 * 平滑滚动到元素
 * @param element 目标元素或选择器
 * @param offset 偏移量
 */
export function scrollToElement(
  element: Element | string, 
  offset: number = 0
): void {
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
    
  if (!target) return;
  
  const elementPosition = getElementPosition(target);
  const offsetPosition = elementPosition.top - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * 检查元素是否在视口中
 * @param element 元素
 * @param threshold 阈值（0-1）
 * @returns 是否在视口中
 */
export function isElementInViewport(
  element: Element, 
  threshold: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                     ((rect.top + rect.height) >= windowHeight * threshold);
  const horInView = (rect.left <= windowWidth * (1 - threshold)) && 
                    ((rect.left + rect.width) >= windowWidth * threshold);
  
  return vertInView && horInView;
}

/**
 * 创建元素
 * @param tagName 标签名
 * @param attributes 属性
 * @param children 子元素
 * @returns 创建的元素
 */
export function createElement(
  tagName: string,
  attributes: Record<string, string> = {},
  children: (Element | string)[] = []
): Element {
  const element = document.createElement(tagName);
  
  // 设置属性
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key]);
  });
  
  // 添加子元素
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * 全屏显示
 * @param element 要全屏的元素
 */
export function requestFullscreen(element: Element = document.documentElement): void {
  const elem = element as any;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

/**
 * 退出全屏
 */
export function exitFullscreen(): void {
  const doc = document as any;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  }
}

/**
 * 检查是否全屏
 * @returns 是否全屏
 */
export function isFullscreen(): boolean {
  const doc = document as any;
  return !!(doc.fullscreenElement || 
           doc.webkitFullscreenElement || 
           doc.msFullscreenElement);
}