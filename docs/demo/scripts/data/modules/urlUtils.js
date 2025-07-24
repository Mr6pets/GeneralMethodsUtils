// URL 工具模块
export default {
    title: 'URL 工具',
    icon: 'fas fa-link',
    methods: {
        getQueryString: {
            name: 'getQueryString',
            description: '获取 URL 查询参数的值',
            params: [
                { name: 'name', type: 'string', required: true, description: '参数名称' },
                { name: 'url', type: 'string', required: false, description: '目标 URL，默认为当前页面' }
            ],
            examples: {
                js: `// 当前 URL: https://example.com?name=john&age=25\n\n// 获取查询参数\nconst name = getQueryString('name');\nconsole.log(name); // 'john'\n\nconst age = getQueryString('age');\nconsole.log(age); // '25'\n\n// 从指定 URL 获取参数\nconst id = getQueryString('id', 'https://api.com?id=123');\nconsole.log(id); // '123'`,
                ts: `import { getQueryString } from 'general-method-utils';\n\n// 当前 URL: https://example.com?name=john&age=25\n\n// 获取查询参数\nconst name: string | null = getQueryString('name');\nconsole.log(name); // 'john'\n\nconst age: string | null = getQueryString('age');\nconsole.log(age); // '25'\n\n// 从指定 URL 获取参数\nconst id: string | null = getQueryString('id', 'https://api.com?id=123');\nconsole.log(id); // '123'`
            },
            demo: true
        },
        parseUrl: {
            name: 'parseUrl',
            description: '解析 URL 并返回各个组成部分',
            params: [
                { name: 'url', type: 'string', required: true, description: '要解析的 URL' }
            ],
            examples: {
                js: `// 解析 URL\nconst parsed = parseUrl('https://user:pass@example.com:8080/path?query=value#hash');\nconsole.log(parsed);\n// {\n//   protocol: 'https:',\n//   hostname: 'example.com',\n//   port: '8080',\n//   pathname: '/path',\n//   search: '?query=value',\n//   hash: '#hash',\n//   username: 'user',\n//   password: 'pass'\n// }`,
                ts: `import { parseUrl } from 'general-method-utils';\n\ninterface ParsedUrl {\n  protocol: string;\n  hostname: string;\n  port: string;\n  pathname: string;\n  search: string;\n  hash: string;\n  username: string;\n  password: string;\n}\n\nconst parsed: ParsedUrl = parseUrl('https://example.com/path?query=value');\nconsole.log(parsed);`
            },
            demo: true
        },
        buildUrl: {
            name: 'buildUrl',
            description: '根据基础 URL 和参数构建完整的 URL',
            params: [
                { name: 'baseUrl', type: 'string', required: true, description: '基础 URL' },
                { name: 'params', type: 'object', required: false, description: '查询参数对象' },
                { name: 'options', type: 'object', required: false, description: '构建选项' }
            ],
            examples: {
                js: `// 构建带参数的 URL\nconst url = buildUrl('https://api.example.com/users', {\n  page: 1,\n  limit: 10,\n  search: 'john'\n});\nconsole.log(url);\n// 'https://api.example.com/users?page=1&limit=10&search=john'\n\n// 处理特殊字符\nconst searchUrl = buildUrl('https://search.com', {\n  q: 'hello world',\n  type: 'web'\n});\nconsole.log(searchUrl);\n// 'https://search.com?q=hello%20world&type=web'`,
                ts: `import { buildUrl } from 'general-method-utils';\n\n// 构建带参数的 URL\nconst params: Record<string, any> = {\n  page: 1,\n  limit: 10,\n  search: 'john'\n};\n\nconst url: string = buildUrl('https://api.example.com/users', params);\nconsole.log(url);`
            },
            demo: true
        },
        getUrlParams: {
            name: 'getUrlParams',
            description: '获取 URL 的所有查询参数',
            params: [
                { name: 'url', type: 'string', required: false, description: '目标 URL，默认为当前页面' }
            ],
            examples: {
                js: `// 当前 URL: https://example.com?name=john&age=25&tags=js&tags=web\n\n// 获取所有参数\nconst params = getUrlParams();\nconsole.log(params);\n// { name: 'john', age: '25', tags: ['js', 'web'] }\n\n// 从指定 URL 获取参数\nconst apiParams = getUrlParams('https://api.com?id=123&type=user');\nconsole.log(apiParams);\n// { id: '123', type: 'user' }`,
                ts: `import { getUrlParams } from 'general-method-utils';\n\n// 获取所有参数\nconst params: Record<string, string | string[]> = getUrlParams();\nconsole.log(params);\n\n// 类型安全的参数访问\nconst name = params.name as string;\nconst tags = params.tags as string[];`
            },
            demo: true
        }
    }
};