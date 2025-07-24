// 网络请求工具模块
export default {
    title: '网络请求工具',
    icon: 'fas fa-exchange-alt',
    methods: {
        request: {
            name: 'request',
            description: '通用HTTP请求方法',
            params: [
                { name: 'url', type: 'string', required: true, description: '请求URL' },
                { name: 'options', type: 'object', required: false, description: '请求选项' }
            ],
            examples: {
                js: `// GET请求\nconst data = await request('/api/users');\nconsole.log(data);\n\n// POST请求\nconst newUser = await request('/api/users', {\n  method: 'POST',\n  body: JSON.stringify({\n    name: 'John Doe',\n    email: 'john@example.com'\n  }),\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});\n\n// 带认证的请求\nconst protectedData = await request('/api/protected', {\n  headers: {\n    'Authorization': \`Bearer \${token}\`\n  }\n});\n\n// 文件上传\nconst formData = new FormData();\nformData.append('file', fileInput.files[0]);\nconst uploadResult = await request('/api/upload', {\n  method: 'POST',\n  body: formData\n});`,
                ts: `import { request } from 'general-method-utils';\n\ninterface RequestOptions {\n  method?: string;\n  headers?: Record<string, string>;\n  body?: string | FormData;\n  timeout?: number;\n}\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// GET请求\nconst data: User[] = await request('/api/users');\n\n// POST请求\nconst newUser: User = await request('/api/users', {\n  method: 'POST',\n  body: JSON.stringify({\n    name: 'John Doe',\n    email: 'john@example.com'\n  }),\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});`
            },
            demo: true
        },
        get: {
            name: 'get',
            description: 'GET请求',
            params: [
                { name: 'url', type: 'string', required: true, description: '请求URL' },
                { name: 'params', type: 'object', required: false, description: '查询参数' },
                { name: 'options', type: 'object', required: false, description: '请求选项' }
            ],
            examples: {
                js: `// 简单GET请求\nconst users = await get('/api/users');\n\n// 带查询参数\nconst filteredUsers = await get('/api/users', {\n  page: 1,\n  limit: 10,\n  status: 'active'\n});\n// 实际请求: /api/users?page=1&limit=10&status=active\n\n// 带请求头\nconst data = await get('/api/data', null, {\n  headers: {\n    'Authorization': \`Bearer \${token}\`,\n    'Accept': 'application/json'\n  }\n});\n\n// 超时设置\nconst result = await get('/api/slow-endpoint', null, {\n  timeout: 5000\n});`,
                ts: `import { get } from 'general-method-utils';\n\ninterface QueryParams {\n  page?: number;\n  limit?: number;\n  status?: string;\n}\n\n// 简单GET请求\nconst users: User[] = await get('/api/users');\n\n// 带查询参数\nconst filteredUsers: User[] = await get('/api/users', {\n  page: 1,\n  limit: 10,\n  status: 'active'\n} as QueryParams);\n\n// 带请求头\nconst data: any = await get('/api/data', null, {\n  headers: {\n    'Authorization': \`Bearer \${token}\`,\n    'Accept': 'application/json'\n  }\n});`
            },
            demo: true
        },
        post: {
            name: 'post',
            description: 'POST请求',
            params: [
                { name: 'url', type: 'string', required: true, description: '请求URL' },
                { name: 'data', type: 'object', required: false, description: '请求数据' },
                { name: 'options', type: 'object', required: false, description: '请求选项' }
            ],
            examples: {
                js: `// 创建用户\nconst newUser = await post('/api/users', {\n  name: 'Jane Doe',\n  email: 'jane@example.com',\n  role: 'user'\n});\n\n// 登录\nconst loginResult = await post('/api/auth/login', {\n  username: 'john@example.com',\n  password: 'password123'\n});\n\n// 文件上传\nconst fileData = new FormData();\nfileData.append('avatar', avatarFile);\nfileData.append('userId', '123');\n\nconst uploadResult = await post('/api/upload/avatar', fileData);\n\n// 带自定义头部\nconst result = await post('/api/data', requestData, {\n  headers: {\n    'Content-Type': 'application/json',\n    'X-API-Key': apiKey\n  }\n});`,
                ts: `import { post } from 'general-method-utils';\n\ninterface CreateUserData {\n  name: string;\n  email: string;\n  role: string;\n}\n\ninterface LoginData {\n  username: string;\n  password: string;\n}\n\ninterface LoginResult {\n  token: string;\n  user: User;\n}\n\n// 创建用户\nconst newUser: User = await post('/api/users', {\n  name: 'Jane Doe',\n  email: 'jane@example.com',\n  role: 'user'\n} as CreateUserData);\n\n// 登录\nconst loginResult: LoginResult = await post('/api/auth/login', {\n  username: 'john@example.com',\n  password: 'password123'\n} as LoginData);`
            },
            demo: true
        },
        put: {
            name: 'put',
            description: 'PUT请求',
            params: [
                { name: 'url', type: 'string', required: true, description: '请求URL' },
                { name: 'data', type: 'object', required: false, description: '请求数据' },
                { name: 'options', type: 'object', required: false, description: '请求选项' }
            ],
            examples: {
                js: `// 更新用户信息\nconst updatedUser = await put(\`/api/users/\${userId}\`, {\n  name: 'John Smith',\n  email: 'john.smith@example.com',\n  phone: '+1234567890'\n});\n\n// 更新设置\nconst settings = await put('/api/user/settings', {\n  theme: 'dark',\n  notifications: true,\n  language: 'zh-CN'\n});\n\n// 替换整个资源\nconst product = await put(\`/api/products/\${productId}\`, {\n  name: 'Updated Product',\n  price: 99.99,\n  description: 'New description',\n  category: 'electronics'\n});`,
                ts: `import { put } from 'general-method-utils';\n\ninterface UpdateUserData {\n  name?: string;\n  email?: string;\n  phone?: string;\n}\n\ninterface UserSettings {\n  theme: 'light' | 'dark';\n  notifications: boolean;\n  language: string;\n}\n\n// 更新用户信息\nconst updatedUser: User = await put(\`/api/users/\${userId}\`, {\n  name: 'John Smith',\n  email: 'john.smith@example.com',\n  phone: '+1234567890'\n} as UpdateUserData);\n\n// 更新设置\nconst settings: UserSettings = await put('/api/user/settings', {\n  theme: 'dark',\n  notifications: true,\n  language: 'zh-CN'\n} as UserSettings);`
            },
            demo: true
        },
        del: {
            name: 'del',
            description: 'DELETE请求',
            params: [
                { name: 'url', type: 'string', required: true, description: '请求URL' },
                { name: 'options', type: 'object', required: false, description: '请求选项' }
            ],
            examples: {
                js: `// 删除用户\nconst result = await del(\`/api/users/\${userId}\`);\nconsole.log('用户已删除');\n\n// 删除文件\nconst deleteResult = await del(\`/api/files/\${fileId}\`, {\n  headers: {\n    'Authorization': \`Bearer \${token}\`\n  }\n});\n\n// 批量删除\nconst deleteMultiple = await del('/api/posts/batch', {\n  body: JSON.stringify({\n    ids: [1, 2, 3, 4, 5]\n  }),\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});\n\n// 软删除\nconst softDelete = await del(\`/api/posts/\${postId}/soft\`);`,
                ts: `import { del } from 'general-method-utils';\n\ninterface DeleteResult {\n  success: boolean;\n  message: string;\n}\n\n// 删除用户\nconst result: DeleteResult = await del(\`/api/users/\${userId}\`);\n\n// 删除文件\nconst deleteResult: DeleteResult = await del(\`/api/files/\${fileId}\`, {\n  headers: {\n    'Authorization': \`Bearer \${token}\`\n  }\n});\n\n// 批量删除\nconst deleteMultiple: DeleteResult = await del('/api/posts/batch', {\n  body: JSON.stringify({\n    ids: [1, 2, 3, 4, 5]\n  }),\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});`
            },
            demo: true
        },
        interceptors: {
            name: 'interceptors',
            description: '请求和响应拦截器',
            params: [
                { name: 'type', type: 'string', required: true, description: '拦截器类型：request、response' },
                { name: 'handler', type: 'function', required: true, description: '拦截器处理函数' }
            ],
            examples: {
                js: `// 请求拦截器\ninterceptors('request', (config) => {\n  // 添加认证头\n  const token = localStorage.getItem('token');\n  if (token) {\n    config.headers = {\n      ...config.headers,\n      'Authorization': \`Bearer \${token}\`\n    };\n  }\n  \n  // 添加时间戳\n  config.headers['X-Timestamp'] = Date.now().toString();\n  \n  console.log('发送请求:', config);\n  return config;\n});\n\n// 响应拦截器\ninterceptors('response', (response) => {\n  // 统一错误处理\n  if (response.status === 401) {\n    localStorage.removeItem('token');\n    window.location.href = '/login';\n    return;\n  }\n  \n  // 记录响应时间\n  const responseTime = Date.now() - parseInt(response.headers['X-Timestamp']);\n  console.log(\`响应时间: \${responseTime}ms\`);\n  \n  return response;\n});\n\n// 错误拦截器\ninterceptors('error', (error) => {\n  console.error('请求错误:', error);\n  \n  if (error.code === 'NETWORK_ERROR') {\n    showNotification('网络连接失败，请检查网络设置');\n  }\n  \n  return Promise.reject(error);\n});`,
                ts: `import { interceptors } from 'general-method-utils';\n\ninterface RequestConfig {\n  url: string;\n  method: string;\n  headers: Record<string, string>;\n  body?: any;\n}\n\ninterface ResponseData {\n  status: number;\n  headers: Record<string, string>;\n  data: any;\n}\n\n// 请求拦截器\ninterceptors('request', (config: RequestConfig) => {\n  const token = localStorage.getItem('token');\n  if (token) {\n    config.headers = {\n      ...config.headers,\n      'Authorization': \`Bearer \${token}\`\n    };\n  }\n  \n  console.log('发送请求:', config);\n  return config;\n});\n\n// 响应拦截器\ninterceptors('response', (response: ResponseData) => {\n  if (response.status === 401) {\n    localStorage.removeItem('token');\n    window.location.href = '/login';\n    return;\n  }\n  \n  return response;\n});`
            },
            demo: true
        },
        downloadFile: {
            name: 'downloadFile',
            description: '下载文件',
            params: [
                { name: 'url', type: 'string', required: true, description: '文件URL' },
                { name: 'filename', type: 'string', required: false, description: '文件名' },
                { name: 'onProgress', type: 'function', required: false, description: '进度回调' }
            ],
            examples: {
                js: `// 下载文件\ndownloadFile('/api/files/report.pdf', 'monthly-report.pdf');\n\n// 带进度的下载\ndownloadFile('/api/files/large-file.zip', 'data.zip', (progress) => {\n  console.log(\`下载进度: \${progress.percentage}%\`);\n  updateProgressBar(progress.percentage);\n});\n\n// 下载并处理\ndownloadFile('/api/export/users.csv')\n  .then(() => {\n    showNotification('文件下载完成');\n  })\n  .catch(error => {\n    showError('下载失败: ' + error.message);\n  });\n\n// 批量下载\nconst files = [\n  { url: '/api/files/1.pdf', name: 'file1.pdf' },\n  { url: '/api/files/2.pdf', name: 'file2.pdf' }\n];\n\nfiles.forEach(file => {\n  downloadFile(file.url, file.name);\n});`,
                ts: `import { downloadFile } from 'general-method-utils';\n\ninterface DownloadProgress {\n  loaded: number;\n  total: number;\n  percentage: number;\n}\n\n// 下载文件\ndownloadFile('/api/files/report.pdf', 'monthly-report.pdf');\n\n// 带进度的下载\ndownloadFile('/api/files/large-file.zip', 'data.zip', (progress: DownloadProgress) => {\n  console.log(\`下载进度: \${progress.percentage}%\`);\n  updateProgressBar(progress.percentage);\n});\n\n// 下载并处理\ndownloadFile('/api/export/users.csv')\n  .then(() => {\n    showNotification('文件下载完成');\n  })\n  .catch((error: Error) => {\n    showError('下载失败: ' + error.message);\n  });`
            },
            demo: true
        }
    }
};