/**
 * DOM 操作相关工具方法
 */

/**
 * 元素选择器
 * @param {string} selector - CSS 选择器
 * @returns {Element|null} DOM 元素
 */
export function $(selector) {
  return document.querySelector(selector);
}

/**
 * 多元素选择器
 * @param {string} selector - CSS 选择器
 * @returns {NodeList} DOM 元素列表
 */
export function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * 添加类名
 * @param {Element} el - DOM 元素
 * @param {string} className - 类名
 */
export function addClass(el, className) {
  if (el && className) {
    el.classList.add(className);
  }
}

/**
 * 移除类名
 * @param {Element} el - DOM 元素
 * @param {string} className - 类名
 */
export function removeClass(el, className) {
  if (el && className) {
    el.classList.remove(className);
  }
}

/**
 * 切换类名
 * @param {Element} el - DOM 元素
 * @param {string} className - 类名
 */
export function toggleClass(el, className) {
  if (el && className) {
    el.classList.toggle(className);
  }
}

/**
 * 绑定事件
 * @param {Element} el - DOM 元素
 * @param {string} event - 事件名
 * @param {Function} handler - 事件处理函数
 */
export function on(el, event, handler) {
  if (el && event && handler) {
    el.addEventListener(event, handler);
  }
}

/**
 * 解绑事件
 * @param {Element} el - DOM 元素
 * @param {string} event - 事件名
 * @param {Function} handler - 事件处理函数
 */
export function off(el, event, handler) {
  if (el && event && handler) {
    el.removeEventListener(event, handler);
  }
}

/**
 * 绑定一次性事件
 * @param {Element} el - DOM 元素
 * @param {string} event - 事件名
 * @param {Function} handler - 事件处理函数
 */
export function once(el, event, handler) {
  if (el && event && handler) {
    el.addEventListener(event, handler, { once: true });
  }
}

/**
 * 显示元素
 * @param {Element} el - DOM 元素
 */
export function show(el) {
  if (el) {
    el.style.display = '';
  }
}

/**
 * 隐藏元素
 * @param {Element} el - DOM 元素
 */
export function hide(el) {
  if (el) {
    el.style.display = 'none';
  }
}

/**
 * 切换元素显示/隐藏
 * @param {Element} el - DOM 元素
 */
export function toggle(el) {
  if (el) {
    const isHidden = el.style.display === 'none' || 
                    getComputedStyle(el).display === 'none';
    el.style.display = isHidden ? '' : 'none';
  }
}

/**
 * 获取元素位置
 * @param {Element} el - DOM 元素
 * @returns {object} 位置信息
 */
export function getOffset(el) {
  if (!el) return { top: 0, left: 0 };
  
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  };
}

/**
 * 平滑滚动到元素
 * @param {Element|string} target - 目标元素或选择器
 * @param {object} options - 滚动选项
 */
export function scrollTo(target, options = {}) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  
  const config = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };
  
  el.scrollIntoView(config);
}