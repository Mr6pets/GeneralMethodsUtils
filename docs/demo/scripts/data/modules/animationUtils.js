// 动画与过渡效果工具模块
export default {
    title: '动画与过渡效果工具',
    icon: 'fas fa-magic',
    methods: {
        fadeIn: {
            name: 'fadeIn',
            description: '为元素添加淡入动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认300' }
            ],
            examples: {
                js: `// 淡入动画\nconst element = document.getElementById('myElement');\nconst animation = fadeIn(element, 500);\n\n// 监听动画完成\nanimation.addEventListener('finish', () => {\n  console.log('淡入动画完成');\n});`,
                ts: `import { fadeIn } from 'general-method-utils';\n\n// 淡入动画\nconst element = document.getElementById('myElement') as HTMLElement;\nconst animation: Animation = fadeIn(element, 500);\n\n// 监听动画完成\nanimation.addEventListener('finish', () => {\n  console.log('淡入动画完成');\n});`
            },
            demo: true
        },
        fadeOut: {
            name: 'fadeOut',
            description: '为元素添加淡出动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认300' }
            ],
            examples: {
                js: `// 淡出动画\nconst element = document.getElementById('myElement');\nfadeOut(element, 400);`,
                ts: `import { fadeOut } from 'general-method-utils';\n\nconst element = document.getElementById('myElement') as HTMLElement;\nfadeOut(element, 400);`
            },
            demo: true
        },
        slideIn: {
            name: 'slideIn',
            description: '为元素添加滑入动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'direction', type: 'string', required: false, description: '滑入方向：left, right, up, down，默认left' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认300' }
            ],
            examples: {
                js: `// 从左侧滑入\nslideIn(element, 'left', 300);\n\n// 从上方滑入\nslideIn(element, 'up', 500);`,
                ts: `import { slideIn } from 'general-method-utils';\n\n// 从左侧滑入\nslideIn(element, 'left', 300);\n\n// 从上方滑入\nslideIn(element, 'up', 500);`
            },
            demo: true
        },
        slideOut: {
            name: 'slideOut',
            description: '为元素添加滑出动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'direction', type: 'string', required: false, description: '滑出方向：left, right, up, down，默认left' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认300' }
            ],
            examples: {
                js: `// 向左滑出\nslideOut(element, 'left', 300);\n\n// 向下滑出\nslideOut(element, 'down', 400);`,
                ts: `import { slideOut } from 'general-method-utils';\n\n// 向左滑出\nslideOut(element, 'left', 300);\n\n// 向下滑出\nslideOut(element, 'down', 400);`
            },
            demo: true
        },
        scale: {
            name: 'scale',
            description: '为元素添加缩放动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'fromScale', type: 'number', required: false, description: '起始缩放比例，默认0' },
                { name: 'toScale', type: 'number', required: false, description: '结束缩放比例，默认1' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认300' }
            ],
            examples: {
                js: `// 从0缩放到1\nscale(element, 0, 1, 400);\n\n// 从1缩放到1.2\nscale(element, 1, 1.2, 200);`,
                ts: `import { scale } from 'general-method-utils';\n\n// 从0缩放到1\nscale(element, 0, 1, 400);\n\n// 从1缩放到1.2\nscale(element, 1, 1.2, 200);`
            },
            demo: true
        },
        bounce: {
            name: 'bounce',
            description: '为元素添加弹跳动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认600' }
            ],
            examples: {
                js: `// 弹跳动画\nbounce(element, 600);\n\n// 快速弹跳\nbounce(element, 300);`,
                ts: `import { bounce } from 'general-method-utils';\n\n// 弹跳动画\nbounce(element, 600);\n\n// 快速弹跳\nbounce(element, 300);`
            },
            demo: true
        },
        shake: {
            name: 'shake',
            description: '为元素添加摇摆动画效果',
            params: [
                { name: 'element', type: 'HTMLElement', required: true, description: '目标元素' },
                { name: 'duration', type: 'number', required: false, description: '动画时长（毫秒），默认500' }
            ],
            examples: {
                js: `// 摇摆动画\nshake(element, 500);\n\n// 表单验证失败时的摇摆提示\nconst input = document.getElementById('email');\nif (!isValidEmail(input.value)) {\n  shake(input, 300);\n}`,
                ts: `import { shake } from 'general-method-utils';\n\n// 摇摆动画\nshake(element, 500);\n\n// 表单验证失败时的摇摆提示\nconst input = document.getElementById('email') as HTMLInputElement;\nif (!isValidEmail(input.value)) {\n  shake(input, 300);\n}`
            },
            demo: true
        }
    }
};