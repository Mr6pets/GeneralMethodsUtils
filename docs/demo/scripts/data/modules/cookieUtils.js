// Cookie 工具模块
export default {
    title: 'Cookie 工具',
    icon: 'fas fa-cookie-bite',
    methods: {
        setCookie: {
            name: 'setCookie',
            description: '设置 Cookie，支持过期时间、路径、域名等配置',
            params: [
                { name: 'name', type: 'string', required: true, description: 'Cookie 名称' },
                { name: 'value', type: 'string', required: true, description: 'Cookie 值' },
                { name: 'options', type: 'object', required: false, description: '配置选项' }
            ],
            examples: {
                js: `// 设置基础 Cookie\nsetCookie('username', 'john');\n\n// 设置带过期时间的 Cookie\nsetCookie('token', 'abc123', {\n  expires: 7, // 7天后过期\n  path: '/',\n  secure: true\n});\n\n// 设置会话 Cookie\nsetCookie('sessionId', 'xyz789', {\n  httpOnly: true,\n  sameSite: 'strict'\n});`,
                ts: `import { setCookie } from 'general-method-utils';\n\n// 设置基础 Cookie\nsetCookie('username', 'john');\n\n// 设置带过期时间的 Cookie\nsetCookie('token', 'abc123', {\n  expires: 7, // 7天后过期\n  path: '/',\n  secure: true\n});\n\n// 设置会话 Cookie\nsetCookie('sessionId', 'xyz789', {\n  httpOnly: true,\n  sameSite: 'strict'\n});`
            },
            demo: true
        },
        getCookie: {
            name: 'getCookie',
            description: '获取指定名称的 Cookie 值',
            params: [
                { name: 'name', type: 'string', required: true, description: 'Cookie 名称' }
            ],
            examples: {
                js: `// 获取 Cookie 值\nconst username = getCookie('username');\nconsole.log(username); // 'john'\n\n// 获取不存在的 Cookie\nconst nonExistent = getCookie('notFound');\nconsole.log(nonExistent); // null`,
                ts: `import { getCookie } from 'general-method-utils';\n\n// 获取 Cookie 值\nconst username: string | null = getCookie('username');\nconsole.log(username); // 'john'\n\n// 获取不存在的 Cookie\nconst nonExistent: string | null = getCookie('notFound');\nconsole.log(nonExistent); // null`
            },
            demo: true
        },
        deleteCookie: {
            name: 'deleteCookie',
            description: '删除指定名称的 Cookie',
            params: [
                { name: 'name', type: 'string', required: true, description: 'Cookie 名称' },
                { name: 'options', type: 'object', required: false, description: '删除选项（路径、域名等）' }
            ],
            examples: {
                js: `// 删除 Cookie\ndeleteCookie('username');\n\n// 删除指定路径的 Cookie\ndeleteCookie('token', {\n  path: '/',\n  domain: '.example.com'\n});`,
                ts: `import { deleteCookie } from 'general-method-utils';\n\n// 删除 Cookie\ndeleteCookie('username');\n\n// 删除指定路径的 Cookie\ndeleteCookie('token', {\n  path: '/',\n  domain: '.example.com'\n});`
            },
            demo: true
        },
        getAllCookies: {
            name: 'getAllCookies',
            description: '获取所有 Cookie 的键值对对象',
            params: [],
            examples: {
                js: `// 获取所有 Cookie\nconst cookies = getAllCookies();\nconsole.log(cookies);\n// { username: 'john', theme: 'dark', lang: 'zh' }\n\n// 遍历所有 Cookie\nObject.entries(cookies).forEach(([name, value]) => {\n  console.log(\`\${name}: \${value}\`);\n});`,
                ts: `import { getAllCookies } from 'general-method-utils';\n\n// 获取所有 Cookie\nconst cookies: Record<string, string> = getAllCookies();\nconsole.log(cookies);\n\n// 遍历所有 Cookie\nObject.entries(cookies).forEach(([name, value]: [string, string]) => {\n  console.log(\`\${name}: \${value}\`);\n});`
            },
            demo: true
        }
    }
};