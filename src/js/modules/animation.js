/**
 * 动画与过渡效果工具方法
 */

/**
 * 淡入动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function fadeIn(element, duration = 300) {
  return element.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], {
    duration,
    fill: 'forwards',
    easing: 'ease-in-out'
  });
}

/**
 * 淡出动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function fadeOut(element, duration = 300) {
  return element.animate([
    { opacity: 1 },
    { opacity: 0 }
  ], {
    duration,
    fill: 'forwards',
    easing: 'ease-in-out'
  });
}

/**
 * 滑入动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} direction - 滑入方向：'left', 'right', 'up', 'down'
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function slideIn(element, direction = 'left', duration = 300) {
  const transforms = {
    left: ['translateX(-100%)', 'translateX(0)'],
    right: ['translateX(100%)', 'translateX(0)'],
    up: ['translateY(-100%)', 'translateY(0)'],
    down: ['translateY(100%)', 'translateY(0)']
  };
  
  return element.animate([
    { transform: transforms[direction][0] },
    { transform: transforms[direction][1] }
  ], {
    duration,
    fill: 'forwards',
    easing: 'ease-out'
  });
}

/**
 * 滑出动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} direction - 滑出方向：'left', 'right', 'up', 'down'
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function slideOut(element, direction = 'left', duration = 300) {
  const transforms = {
    left: ['translateX(0)', 'translateX(-100%)'],
    right: ['translateX(0)', 'translateX(100%)'],
    up: ['translateY(0)', 'translateY(-100%)'],
    down: ['translateY(0)', 'translateY(100%)']
  };
  
  return element.animate([
    { transform: transforms[direction][0] },
    { transform: transforms[direction][1] }
  ], {
    duration,
    fill: 'forwards',
    easing: 'ease-in'
  });
}

/**
 * 缩放动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} fromScale - 起始缩放比例
 * @param {number} toScale - 结束缩放比例
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function scale(element, fromScale = 0, toScale = 1, duration = 300) {
  return element.animate([
    { transform: `scale(${fromScale})` },
    { transform: `scale(${toScale})` }
  ], {
    duration,
    fill: 'forwards',
    easing: 'ease-out'
  });
}

/**
 * 弹跳动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function bounce(element, duration = 600) {
  return element.animate([
    { transform: 'translateY(0)' },
    { transform: 'translateY(-20px)', offset: 0.25 },
    { transform: 'translateY(0)', offset: 0.5 },
    { transform: 'translateY(-10px)', offset: 0.75 },
    { transform: 'translateY(0)' }
  ], {
    duration,
    easing: 'ease-out'
  });
}

/**
 * 摇摆动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画时长（毫秒）
 * @returns {Animation} 动画对象
 */
export function shake(element, duration = 500) {
  return element.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)', offset: 0.1 },
    { transform: 'translateX(10px)', offset: 0.2 },
    { transform: 'translateX(-10px)', offset: 0.3 },
    { transform: 'translateX(10px)', offset: 0.4 },
    { transform: 'translateX(-10px)', offset: 0.5 },
    { transform: 'translateX(10px)', offset: 0.6 },
    { transform: 'translateX(-10px)', offset: 0.7 },
    { transform: 'translateX(10px)', offset: 0.8 },
    { transform: 'translateX(-10px)', offset: 0.9 },
    { transform: 'translateX(0)' }
  ], {
    duration,
    easing: 'ease-in-out'
  });
}