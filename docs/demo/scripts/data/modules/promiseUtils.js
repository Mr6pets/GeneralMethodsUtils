// Promise工具模块
export default {
    title: 'Promise工具',
    icon: 'fas fa-hourglass-half',
    methods: {
        delay: {
            name: 'delay',
            description: '创建延迟Promise',
            params: [
                { name: 'ms', type: 'number', required: true, description: '延迟毫秒数' },
                { name: 'value', type: 'any', required: false, description: '返回值' }
            ],
            examples: {
                js: `// 基本延迟\nawait delay(1000); // 等待1秒\nconsole.log('1秒后执行');\n\n// 带返回值的延迟\nconst result = await delay(2000, 'Hello World');\nconsole.log(result);`,
                ts: `import { delay } from 'general-method-utils';\n\n// 基本延迟\nawait delay(1000);\nconsole.log('1秒后执行');\n\n// 带返回值的延迟\nconst result: string = await delay(2000, 'Hello World');`
            },
            demo: true
        },
        timeout: {
            name: 'timeout',
            description: '为Promise添加超时限制',
            params: [
                { name: 'promise', type: 'Promise', required: true, description: '要限制的Promise' },
                { name: 'ms', type: 'number', required: true, description: '超时毫秒数' },
                { name: 'message', type: 'string', required: false, description: '超时错误信息' }
            ],
            examples: {
                js: `// API调用超时\ntry {\n  const response = await timeout(\n    fetch('/api/data'),\n    5000,\n    'API请求超时'\n  );\n  const data = await response.json();\n} catch (error) {\n  console.error(error.message);\n}`,
                ts: `import { timeout } from 'general-method-utils';\n\ntry {\n  const response: Response = await timeout(\n    fetch('/api/data'),\n    5000,\n    'API请求超时'\n  );\n  const data = await response.json();\n} catch (error) {\n  console.error((error as Error).message);\n}`
            },
            demo: true
        },
        retry: {
            name: 'retry',
            description: '重试失败的Promise',
            params: [
                { name: 'fn', type: 'function', required: true, description: '要重试的函数' },
                { name: 'attempts', type: 'number', required: false, description: '重试次数，默认3' },
                { name: 'delay', type: 'number', required: false, description: '重试间隔，默认1000ms' }
            ],
            examples: {
                js: `// 重试API调用\nconst data = await retry(\n  () => fetch('/api/unstable-endpoint').then(r => r.json()),\n  3,\n  2000\n);`,
                ts: `import { retry } from 'general-method-utils';\n\nconst data = await retry(\n  () => fetch('/api/unstable-endpoint').then(r => r.json()),\n  3,\n  2000\n);`
            },
            demo: true
        },
        parallel: {
            name: 'parallel',
            description: '并行执行多个Promise',
            params: [
                { name: 'promises', type: 'array', required: true, description: 'Promise数组' },
                { name: 'concurrency', type: 'number', required: false, description: '并发数限制' }
            ],
            examples: {
                js: `// 并行执行多个API调用\nconst urls = ['/api/users', '/api/posts', '/api/comments'];\nconst requests = urls.map(url => fetch(url).then(r => r.json()));\nconst results = await parallel(requests);`,
                ts: `import { parallel } from 'general-method-utils';\n\nconst urls: string[] = ['/api/users', '/api/posts', '/api/comments'];\nconst requests: Promise<any>[] = urls.map(url => fetch(url).then(r => r.json()));\nconst results: any[] = await parallel(requests);`
            },
            demo: true
        },
        waterfall: {
            name: 'waterfall',
            description: '串行执行Promise，前一个的结果传递给下一个',
            params: [
                { name: 'tasks', type: 'array', required: true, description: '任务函数数组' },
                { name: 'initialValue', type: 'any', required: false, description: '初始值' }
            ],
            examples: {
                js: `// 数据处理管道\nconst result = await waterfall([\n  (data) => fetchUserData(data.userId),\n  (userData) => enrichUserProfile(userData),\n  (profile) => generateReport(profile)\n], { userId: 123 });`,
                ts: `import { waterfall } from 'general-method-utils';\n\nconst result = await waterfall([\n  (data: { userId: number }) => fetchUserData(data.userId),\n  (userData: any) => enrichUserProfile(userData),\n  (profile: any) => generateReport(profile)\n], { userId: 123 });`
            },
            demo: true
        },
        race: {
            name: 'race',
            description: '竞速执行Promise，返回最快完成的结果',
            params: [
                { name: 'promises', type: 'array', required: true, description: 'Promise数组' }
            ],
            examples: {
                js: `// 多个API源竞速\nconst fastestData = await race([\n  fetch('/api/v1/data').then(r => r.json()),\n  fetch('/api/v2/data').then(r => r.json()),\n  fetch('/backup-api/data').then(r => r.json())\n]);`,
                ts: `import { race } from 'general-method-utils';\n\nconst fastestData: any = await race([\n  fetch('/api/v1/data').then(r => r.json()),\n  fetch('/api/v2/data').then(r => r.json()),\n  fetch('/backup-api/data').then(r => r.json())\n]);`
            },
            demo: true
        },
        allSettled: {
            name: 'allSettled',
            description: '等待所有Promise完成，无论成功或失败',
            params: [
                { name: 'promises', type: 'array', required: true, description: 'Promise数组' }
            ],
            examples: {
                js: `// 批量API调用，收集所有结果\nconst urls = ['/api/users', '/api/posts', '/api/invalid'];\nconst requests = urls.map(url => fetch(url).then(r => r.json()));\nconst results = await allSettled(requests);`,
                ts: `import { allSettled } from 'general-method-utils';\n\nconst urls: string[] = ['/api/users', '/api/posts', '/api/invalid'];\nconst requests: Promise<any>[] = urls.map(url => fetch(url).then(r => r.json()));\nconst results = await allSettled(requests);`
            },
            demo: true
        }
    }
};