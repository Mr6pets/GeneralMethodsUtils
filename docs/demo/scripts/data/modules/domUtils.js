// DOM操作工具模块
export default {
    title: 'DOM操作工具',
    icon: 'fas fa-code',
    methods: {
        createElement: {
            name: 'createElement',
            description: '创建DOM元素并设置属性',
            params: [
                { name: 'tagName', type: 'string', required: true, description: '元素标签名' },
                { name: 'attributes', type: 'object', required: false, description: '元素属性' },
                { name: 'children', type: 'array', required: false, description: '子元素' }
            ],
            examples: {
                js: `// 创建简单元素\nconst div = createElement('div', {\n  className: 'container',\n  id: 'main-container'\n});\n\n// 创建带子元素的复杂结构\nconst card = createElement('div', {\n  className: 'card'\n}, [\n  createElement('h3', { textContent: '标题' }),\n  createElement('p', { textContent: '内容描述' })\n]);\n\ndocument.body.appendChild(card);`,
                ts: `import { createElement } from 'general-method-utils';\n\nconst div: HTMLElement = createElement('div', {\n  className: 'container',\n  id: 'main-container'\n});\n\nconst card: HTMLElement = createElement('div', {\n  className: 'card'\n}, [\n  createElement('h3', { textContent: '标题' }),\n  createElement('p', { textContent: '内容描述' })\n]);`
            },
            demo: true
        },
        addClass: {
            name: 'addClass',
            description: '为元素添加CSS类',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'className', type: 'string', required: true, description: '要添加的类名' }
            ],
            examples: {
                js: `// 添加单个类\nconst button = document.querySelector('.btn');\naddClass(button, 'active');\n\n// 添加多个类\naddClass(button, 'btn-primary btn-large');\n\n// 条件添加类\nif (isLoggedIn) {\n  addClass(userMenu, 'authenticated');\n}`,
                ts: `import { addClass } from 'general-method-utils';\n\nconst button = document.querySelector('.btn') as HTMLElement;\naddClass(button, 'active');\naddClass(button, 'btn-primary btn-large');`
            },
            demo: true
        },
        removeClass: {
            name: 'removeClass',
            description: '从元素移除CSS类',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'className', type: 'string', required: true, description: '要移除的类名' }
            ],
            examples: {
                js: `// 移除单个类\nconst modal = document.querySelector('.modal');\nremoveClass(modal, 'show');\n\n// 移除多个类\nremoveClass(modal, 'show active');\n\n// 条件移除类\nif (!isVisible) {\n  removeClass(element, 'visible');\n}`,
                ts: `import { removeClass } from 'general-method-utils';\n\nconst modal = document.querySelector('.modal') as HTMLElement;\nremoveClass(modal, 'show');\nremoveClass(modal, 'show active');`
            },
            demo: true
        },
        toggleClass: {
            name: 'toggleClass',
            description: '切换元素的CSS类',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'className', type: 'string', required: true, description: '要切换的类名' }
            ],
            examples: {
                js: `// 切换类\nconst sidebar = document.querySelector('.sidebar');\ntoggleClass(sidebar, 'collapsed');\n\n// 切换主题\nconst themeToggle = document.querySelector('.theme-toggle');\nthemeToggle.addEventListener('click', () => {\n  toggleClass(document.body, 'dark-theme');\n});`,
                ts: `import { toggleClass } from 'general-method-utils';\n\nconst sidebar = document.querySelector('.sidebar') as HTMLElement;\ntoggleClass(sidebar, 'collapsed');\n\nconst themeToggle = document.querySelector('.theme-toggle') as HTMLElement;\nthemeToggle.addEventListener('click', () => {\n  toggleClass(document.body, 'dark-theme');\n});`
            },
            demo: true
        },
        hasClass: {
            name: 'hasClass',
            description: '检查元素是否包含指定CSS类',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'className', type: 'string', required: true, description: '要检查的类名' }
            ],
            examples: {
                js: `// 检查类是否存在\nconst button = document.querySelector('.btn');\nconst isActive = hasClass(button, 'active');\nconsole.log(isActive); // true 或 false\n\n// 条件执行\nif (hasClass(modal, 'show')) {\n  closeModal();\n} else {\n  openModal();\n}`,
                ts: `import { hasClass } from 'general-method-utils';\n\nconst button = document.querySelector('.btn') as HTMLElement;\nconst isActive: boolean = hasClass(button, 'active');\n\nif (hasClass(modal, 'show')) {\n  closeModal();\n}`
            },
            demo: true
        },
        getElementPosition: {
            name: 'getElementPosition',
            description: '获取元素在页面中的位置',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' }
            ],
            examples: {
                js: `// 获取元素位置\nconst header = document.querySelector('header');\nconst position = getElementPosition(header);\nconsole.log(position);\n// { top: 0, left: 0, right: 1920, bottom: 80, width: 1920, height: 80 }\n\n// 检查元素是否在视口内\nconst rect = getElementPosition(element);\nconst inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;`,
                ts: `import { getElementPosition } from 'general-method-utils';\n\ninterface ElementPosition {\n  top: number;\n  left: number;\n  right: number;\n  bottom: number;\n  width: number;\n  height: number;\n}\n\nconst header = document.querySelector('header') as HTMLElement;\nconst position: ElementPosition = getElementPosition(header);`
            },
            demo: true
        },
        isElementVisible: {
            name: 'isElementVisible',
            description: '检查元素是否在视口中可见',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'threshold', type: 'number', required: false, description: '可见阈值，默认0.1' }
            ],
            examples: {
                js: `// 检查元素是否可见\nconst image = document.querySelector('.lazy-image');\nconst visible = isElementVisible(image);\n\nif (visible) {\n  loadImage(image);\n}\n\n// 滚动时检查可见性\nwindow.addEventListener('scroll', () => {\n  const elements = document.querySelectorAll('.animate-on-scroll');\n  elements.forEach(el => {\n    if (isElementVisible(el, 0.5)) {\n      addClass(el, 'animate');\n    }\n  });\n});`,
                ts: `import { isElementVisible } from 'general-method-utils';\n\nconst image = document.querySelector('.lazy-image') as HTMLElement;\nconst visible: boolean = isElementVisible(image);\n\nif (visible) {\n  loadImage(image);\n}`
            },
            demo: true
        }
    }
};