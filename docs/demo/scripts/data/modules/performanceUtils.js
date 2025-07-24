// 性能优化工具模块
export default {
    title: '性能优化工具',
    icon: 'fas fa-tachometer-alt',
    methods: {
        measurePerformance: {
            name: 'measurePerformance',
            description: '测量代码执行性能',
            params: [
                { name: 'fn', type: 'Function', required: true, description: '要测量的函数' },
                { name: 'options', type: 'PerformanceOptions', required: false, description: '性能测量选项' }
            ],
            examples: {
                js: `// 测量函数执行时间\nconst result = await performanceUtils.measurePerformance(\n  () => {\n    // 模拟耗时操作\n    let sum = 0;\n    for (let i = 0; i < 1000000; i++) {\n      sum += i;\n    }\n    return sum;\n  },\n  {\n    iterations: 10,\n    warmup: 3\n  }\n);\n\nconsole.log('平均执行时间:', result.averageTime);\nconsole.log('最小执行时间:', result.minTime);\nconsole.log('最大执行时间:', result.maxTime);\nconsole.log('内存使用:', result.memoryUsage);\n\n// 异步函数性能测试\nconst asyncResult = await performanceUtils.measurePerformance(\n  async () => {\n    const response = await fetch('/api/data');\n    return response.json();\n  }\n);`,
                ts: `import { performanceUtils, PerformanceOptions, PerformanceResult } from 'general-method-utils';\n\n// 测量函数执行时间\nconst options: PerformanceOptions = {\n  iterations: 10,\n  warmup: 3\n};\n\nconst result: PerformanceResult = await performanceUtils.measurePerformance(\n  () => {\n    let sum = 0;\n    for (let i = 0; i < 1000000; i++) {\n      sum += i;\n    }\n    return sum;\n  },\n  options\n);\n\nconsole.log('平均执行时间:', result.averageTime);\nconsole.log('内存使用:', result.memoryUsage);`
            },
            demo: true
        },
        debounce: {
            name: 'debounce',
            description: '防抖函数，延迟执行',
            params: [
                { name: 'fn', type: 'Function', required: true, description: '要防抖的函数' },
                { name: 'delay', type: 'number', required: true, description: '延迟时间(毫秒)' },
                { name: 'options', type: 'DebounceOptions', required: false, description: '防抖选项' }
            ],
            examples: {
                js: `// 搜索输入防抖\nconst searchInput = document.getElementById('search');\nconst debouncedSearch = performanceUtils.debounce(\n  (query) => {\n    console.log('搜索:', query);\n    // 执行搜索请求\n    fetch(\`/api/search?q=\${query}\`)\n      .then(response => response.json())\n      .then(data => console.log(data));\n  },\n  300,\n  {\n    leading: false,\n    trailing: true\n  }\n);\n\nsearchInput.addEventListener('input', (e) => {\n  debouncedSearch(e.target.value);\n});\n\n// 窗口大小调整防抖\nconst debouncedResize = performanceUtils.debounce(\n  () => {\n    console.log('窗口大小改变:', window.innerWidth, window.innerHeight);\n    // 重新计算布局\n  },\n  250\n);\n\nwindow.addEventListener('resize', debouncedResize);`,
                ts: `import { performanceUtils, DebounceOptions } from 'general-method-utils';\n\n// 搜索输入防抖\nconst options: DebounceOptions = {\n  leading: false,\n  trailing: true\n};\n\nconst debouncedSearch = performanceUtils.debounce(\n  (query: string) => {\n    console.log('搜索:', query);\n    fetch(\`/api/search?q=\${query}\`)\n      .then(response => response.json())\n      .then(data => console.log(data));\n  },\n  300,\n  options\n);\n\nconst searchInput = document.getElementById('search') as HTMLInputElement;\nsearchInput.addEventListener('input', (e) => {\n  debouncedSearch((e.target as HTMLInputElement).value);\n});`
            },
            demo: true
        },
        throttle: {
            name: 'throttle',
            description: '节流函数，限制执行频率',
            params: [
                { name: 'fn', type: 'Function', required: true, description: '要节流的函数' },
                { name: 'limit', type: 'number', required: true, description: '时间间隔(毫秒)' },
                { name: 'options', type: 'ThrottleOptions', required: false, description: '节流选项' }
            ],
            examples: {
                js: `// 滚动事件节流\nconst throttledScroll = performanceUtils.throttle(\n  () => {\n    const scrollTop = window.pageYOffset;\n    console.log('滚动位置:', scrollTop);\n    \n    // 更新导航栏状态\n    const navbar = document.querySelector('.navbar');\n    if (scrollTop > 100) {\n      navbar.classList.add('scrolled');\n    } else {\n      navbar.classList.remove('scrolled');\n    }\n  },\n  100,\n  {\n    leading: true,\n    trailing: false\n  }\n);\n\nwindow.addEventListener('scroll', throttledScroll);\n\n// 按钮点击节流\nconst throttledSubmit = performanceUtils.throttle(\n  async () => {\n    console.log('提交表单...');\n    // 提交逻辑\n  },\n  2000\n);\n\ndocument.getElementById('submit').addEventListener('click', throttledSubmit);`,
                ts: `import { performanceUtils, ThrottleOptions } from 'general-method-utils';\n\n// 滚动事件节流\nconst options: ThrottleOptions = {\n  leading: true,\n  trailing: false\n};\n\nconst throttledScroll = performanceUtils.throttle(\n  () => {\n    const scrollTop = window.pageYOffset;\n    console.log('滚动位置:', scrollTop);\n    \n    const navbar = document.querySelector('.navbar') as HTMLElement;\n    if (scrollTop > 100) {\n      navbar.classList.add('scrolled');\n    } else {\n      navbar.classList.remove('scrolled');\n    }\n  },\n  100,\n  options\n);\n\nwindow.addEventListener('scroll', throttledScroll);`
            },
            demo: true
        },
        memoize: {
            name: 'memoize',
            description: '函数记忆化，缓存计算结果',
            params: [
                { name: 'fn', type: 'Function', required: true, description: '要记忆化的函数' },
                { name: 'options', type: 'MemoizeOptions', required: false, description: '记忆化选项' }
            ],
            examples: {
                js: `// 斐波那契数列记忆化\nconst fibonacci = performanceUtils.memoize(\n  (n) => {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n  },\n  {\n    maxSize: 100,\n    ttl: 60000 // 1分钟过期\n  }\n);\n\nconsole.log(fibonacci(40)); // 第一次计算\nconsole.log(fibonacci(40)); // 从缓存获取\n\n// API请求记忆化\nconst memoizedFetch = performanceUtils.memoize(\n  async (url) => {\n    const response = await fetch(url);\n    return response.json();\n  },\n  {\n    keyGenerator: (url) => url,\n    ttl: 300000 // 5分钟缓存\n  }\n);\n\n// 复杂计算记忆化\nconst expensiveCalculation = performanceUtils.memoize(\n  (data) => {\n    // 模拟复杂计算\n    return data.reduce((sum, item) => sum + item.value * item.weight, 0);\n  }\n);`,
                ts: `import { performanceUtils, MemoizeOptions } from 'general-method-utils';\n\n// 斐波那契数列记忆化\nconst options: MemoizeOptions = {\n  maxSize: 100,\n  ttl: 60000\n};\n\nconst fibonacci = performanceUtils.memoize(\n  (n: number): number => {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n  },\n  options\n);\n\nconsole.log(fibonacci(40));\n\n// API请求记忆化\nconst fetchOptions: MemoizeOptions = {\n  keyGenerator: (url: string) => url,\n  ttl: 300000\n};\n\nconst memoizedFetch = performanceUtils.memoize(\n  async (url: string) => {\n    const response = await fetch(url);\n    return response.json();\n  },\n  fetchOptions\n);`
            },
            demo: true
        },
        lazyLoad: {
            name: 'lazyLoad',
            description: '懒加载资源和组件',
            params: [
                { name: 'target', type: 'string | Element', required: true, description: '目标元素或选择器' },
                { name: 'options', type: 'LazyLoadOptions', required: false, description: '懒加载选项' }
            ],
            examples: {
                js: `// 图片懒加载\nperformanceUtils.lazyLoad('.lazy-image', {\n  rootMargin: '50px',\n  threshold: 0.1,\n  onLoad: (element) => {\n    element.classList.add('loaded');\n  },\n  onError: (element) => {\n    element.src = '/images/placeholder.jpg';\n  }\n});\n\n// 组件懒加载\nperformanceUtils.lazyLoad('.lazy-component', {\n  loadFn: async (element) => {\n    const componentName = element.dataset.component;\n    const module = await import(\`./components/\${componentName}.js\`);\n    const component = new module.default();\n    component.render(element);\n  }\n});\n\n// 无限滚动\nperformanceUtils.lazyLoad('.load-more-trigger', {\n  rootMargin: '100px',\n  loadFn: async () => {\n    const nextPage = await fetch('/api/posts?page=' + currentPage);\n    const posts = await nextPage.json();\n    renderPosts(posts);\n    currentPage++;\n  }\n});`,
                ts: `import { performanceUtils, LazyLoadOptions } from 'general-method-utils';\n\n// 图片懒加载\nconst imageOptions: LazyLoadOptions = {\n  rootMargin: '50px',\n  threshold: 0.1,\n  onLoad: (element: Element) => {\n    element.classList.add('loaded');\n  },\n  onError: (element: HTMLImageElement) => {\n    element.src = '/images/placeholder.jpg';\n  }\n};\n\nperformanceUtils.lazyLoad('.lazy-image', imageOptions);\n\n// 组件懒加载\nconst componentOptions: LazyLoadOptions = {\n  loadFn: async (element: Element) => {\n    const componentName = (element as HTMLElement).dataset.component;\n    const module = await import(\`./components/\${componentName}.js\`);\n    const component = new module.default();\n    component.render(element);\n  }\n};\n\nperformanceUtils.lazyLoad('.lazy-component', componentOptions);`
            },
            demo: true
        }
    }
};