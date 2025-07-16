import { AnimationOptions, TransitionOptions } from '../types';

/**
 * 淡入动画
 * @param element 目标元素
 * @param options 动画选项
 */
export function fadeIn(
  element: HTMLElement,
  options: AnimationOptions = {}
): void {
  const { duration = 300, easing = 'ease', onComplete } = options;
  
  element.style.opacity = '0';
  element.style.display = 'block';
  element.style.transition = `opacity ${duration}ms ${easing}`;
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * 淡出动画
 * @param element 目标元素
 * @param options 动画选项
 */
export function fadeOut(
  element: HTMLElement,
  options: AnimationOptions = {}
): void {
  const { duration = 300, easing = 'ease', onComplete } = options;
  
  element.style.transition = `opacity ${duration}ms ${easing}`;
  element.style.opacity = '0';
  
  setTimeout(() => {
    element.style.display = 'none';
    if (onComplete) onComplete();
  }, duration);
}

/**
 * 滑入动画
 * @param element 目标元素
 * @param direction 滑入方向
 * @param options 动画选项
 */
export function slideIn(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down' = 'down',
  options: AnimationOptions = {}
): void {
  const { duration = 300, easing = 'ease', onComplete } = options;
  
  const transforms = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    up: 'translateY(-100%)',
    down: 'translateY(100%)'
  };
  
  element.style.transform = transforms[direction];
  element.style.transition = `transform ${duration}ms ${easing}`;
  element.style.display = 'block';
  
  requestAnimationFrame(() => {
    element.style.transform = 'translate(0, 0)';
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * 滑出动画
 * @param element 目标元素
 * @param direction 滑出方向
 * @param options 动画选项
 */
export function slideOut(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  options: AnimationOptions = {}
): void {
  const { duration = 300, easing = 'ease', onComplete } = options;
  
  const transforms = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    up: 'translateY(-100%)',
    down: 'translateY(100%)'
  };
  
  element.style.transition = `transform ${duration}ms ${easing}`;
  element.style.transform = transforms[direction];
  
  setTimeout(() => {
    element.style.display = 'none';
    if (onComplete) onComplete();
  }, duration);
}

/**
 * 缩放动画
 * @param element 目标元素
 * @param options 过渡选项
 */
export function scale(
  element: HTMLElement,
  options: TransitionOptions = {}
): void {
  const { duration = 300, easing = 'ease', from = 0, to = 1, onComplete } = options;
  
  element.style.transform = `scale(${from})`;
  element.style.transition = `transform ${duration}ms ${easing}`;
  
  requestAnimationFrame(() => {
    element.style.transform = `scale(${to})`;
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * 弹跳动画
 * @param element 目标元素
 * @param options 动画选项
 */
export function bounce(
  element: HTMLElement,
  options: AnimationOptions = {}
): void {
  const { duration = 600, onComplete } = options;
  
  element.style.animation = `bounce ${duration}ms ease`;
  
  // 添加 CSS 关键帧（如果不存在）
  if (!document.querySelector('#bounce-keyframes')) {
    const style = document.createElement('style');
    style.id = 'bounce-keyframes';
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          transform: translate3d(0, -30px, 0);
        }
        70% {
          transform: translate3d(0, -15px, 0);
        }
        90% {
          transform: translate3d(0, -4px, 0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    element.style.animation = '';
    if (onComplete) onComplete();
  }, duration);
}

/**
 * 摇摆动画
 * @param element 目标元素
 * @param options 动画选项
 */
export function shake(
  element: HTMLElement,
  options: AnimationOptions = {}
): void {
  const { duration = 600, onComplete } = options;
  
  element.style.animation = `shake ${duration}ms ease-in-out`;
  
  // 添加 CSS 关键帧（如果不存在）
  if (!document.querySelector('#shake-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shake-keyframes';
    style.textContent = `
      @keyframes shake {
        0%, 100% {
          transform: translate3d(0, 0, 0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translate3d(-10px, 0, 0);
        }
        20%, 40%, 60%, 80% {
          transform: translate3d(10px, 0, 0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    element.style.animation = '';
    if (onComplete) onComplete();
  }, duration);
}