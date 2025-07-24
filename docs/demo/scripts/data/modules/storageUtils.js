// 存储工具模块
export default {
    title: '存储工具',
    icon: 'fas fa-database',
    methods: {
        setItem: {
            name: 'setItem',
            description: '设置存储项',
            params: [
                { name: 'key', type: 'string', required: true, description: '存储键名' },
                { name: 'value', type: 'any', required: true, description: '存储值' },
                { name: 'options', type: 'object', required: false, description: '存储选项' }
            ],
            examples: {
                js: `// 存储字符串\nsetItem('username', 'john_doe');\n\n// 存储对象\nsetItem('user', {\n  id: 123,\n  name: 'John Doe',\n  email: 'john@example.com'\n});\n\n// 存储数组\nsetItem('favorites', ['item1', 'item2', 'item3']);\n\n// 带过期时间的存储\nsetItem('temp_data', 'temporary value', {\n  expires: Date.now() + 3600000 // 1小时后过期\n});\n\n// 存储到sessionStorage\nsetItem('session_data', 'session value', {\n  storage: 'session'\n});\n\n// 加密存储\nsetItem('sensitive_data', 'secret information', {\n  encrypt: true\n});\n\n// 存储大数据\nsetItem('large_dataset', largeArray, {\n  compress: true\n});`,
                ts: `import { setItem } from 'general-method-utils';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ninterface StorageOptions {\n  expires?: number;\n  storage?: 'local' | 'session';\n  encrypt?: boolean;\n  compress?: boolean;\n}\n\n// 存储字符串\nsetItem('username', 'john_doe');\n\n// 存储对象\nsetItem('user', {\n  id: 123,\n  name: 'John Doe',\n  email: 'john@example.com'\n} as User);\n\n// 带过期时间的存储\nsetItem('temp_data', 'temporary value', {\n  expires: Date.now() + 3600000\n} as StorageOptions);\n\n// 存储到sessionStorage\nsetItem('session_data', 'session value', {\n  storage: 'session'\n} as StorageOptions);`
            },
            demo: true
        },
        getItem: {
            name: 'getItem',
            description: '获取存储项',
            params: [
                { name: 'key', type: 'string', required: true, description: '存储键名' },
                { name: 'defaultValue', type: 'any', required: false, description: '默认值' },
                { name: 'options', type: 'object', required: false, description: '获取选项' }
            ],
            examples: {
                js: `// 获取字符串\nconst username = getItem('username');\nconsole.log(username); // 'john_doe'\n\n// 获取对象\nconst user = getItem('user');\nconsole.log(user.name); // 'John Doe'\n\n// 获取带默认值\nconst theme = getItem('theme', 'light');\nconsole.log(theme); // 如果不存在则返回 'light'\n\n// 从sessionStorage获取\nconst sessionData = getItem('session_data', null, {\n  storage: 'session'\n});\n\n// 获取加密数据\nconst sensitiveData = getItem('sensitive_data', null, {\n  decrypt: true\n});\n\n// 获取压缩数据\nconst largeData = getItem('large_dataset', [], {\n  decompress: true\n});\n\n// 检查是否过期\nconst tempData = getItem('temp_data');\nif (tempData === null) {\n  console.log('数据已过期或不存在');\n}`,
                ts: `import { getItem } from 'general-method-utils';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ninterface GetOptions {\n  storage?: 'local' | 'session';\n  decrypt?: boolean;\n  decompress?: boolean;\n}\n\n// 获取字符串\nconst username: string | null = getItem('username');\n\n// 获取对象\nconst user: User | null = getItem('user');\n\n// 获取带默认值\nconst theme: string = getItem('theme', 'light');\n\n// 从sessionStorage获取\nconst sessionData: any = getItem('session_data', null, {\n  storage: 'session'\n} as GetOptions);\n\n// 获取加密数据\nconst sensitiveData: string | null = getItem('sensitive_data', null, {\n  decrypt: true\n} as GetOptions);`
            },
            demo: true
        },
        removeItem: {
            name: 'removeItem',
            description: '删除存储项',
            params: [
                { name: 'key', type: 'string', required: true, description: '存储键名' },
                { name: 'options', type: 'object', required: false, description: '删除选项' }
            ],
            examples: {
                js: `// 删除localStorage项\nremoveItem('username');\n\n// 删除sessionStorage项\nremoveItem('session_data', {\n  storage: 'session'\n});\n\n// 批量删除\nconst keysToRemove = ['temp1', 'temp2', 'temp3'];\nkeysToRemove.forEach(key => removeItem(key));\n\n// 删除带前缀的所有项\nremoveItem('user_*', {\n  pattern: true\n});\n\n// 安全删除（确认后删除）\nremoveItem('important_data', {\n  confirm: true,\n  confirmMessage: '确定要删除重要数据吗？'\n});\n\n// 删除并清理相关数据\nremoveItem('user_settings', {\n  cleanup: ['user_cache', 'user_temp']\n});`,
                ts: `import { removeItem } from 'general-method-utils';\n\ninterface RemoveOptions {\n  storage?: 'local' | 'session';\n  pattern?: boolean;\n  confirm?: boolean;\n  confirmMessage?: string;\n  cleanup?: string[];\n}\n\n// 删除localStorage项\nremoveItem('username');\n\n// 删除sessionStorage项\nremoveItem('session_data', {\n  storage: 'session'\n} as RemoveOptions);\n\n// 删除带前缀的所有项\nremoveItem('user_*', {\n  pattern: true\n} as RemoveOptions);\n\n// 安全删除\nremoveItem('important_data', {\n  confirm: true,\n  confirmMessage: '确定要删除重要数据吗？'\n} as RemoveOptions);`
            },
            demo: true
        },
        clear: {
            name: 'clear',
            description: '清空存储',
            params: [
                { name: 'options', type: 'object', required: false, description: '清空选项' }
            ],
            examples: {
                js: `// 清空localStorage\nclear();\n\n// 清空sessionStorage\nclear({\n  storage: 'session'\n});\n\n// 清空所有存储\nclear({\n  storage: 'all'\n});\n\n// 保留某些项的清空\nclear({\n  except: ['username', 'theme', 'language']\n});\n\n// 只清空特定前缀的项\nclear({\n  prefix: 'temp_'\n});\n\n// 确认后清空\nclear({\n  confirm: true,\n  confirmMessage: '确定要清空所有存储数据吗？'\n});\n\n// 清空过期项\nclear({\n  expiredOnly: true\n});`,
                ts: `import { clear } from 'general-method-utils';\n\ninterface ClearOptions {\n  storage?: 'local' | 'session' | 'all';\n  except?: string[];\n  prefix?: string;\n  confirm?: boolean;\n  confirmMessage?: string;\n  expiredOnly?: boolean;\n}\n\n// 清空localStorage\nclear();\n\n// 清空sessionStorage\nclear({\n  storage: 'session'\n} as ClearOptions);\n\n// 保留某些项的清空\nclear({\n  except: ['username', 'theme', 'language']\n} as ClearOptions);\n\n// 只清空特定前缀的项\nclear({\n  prefix: 'temp_'\n} as ClearOptions);`
            },
            demo: true
        },
        getAllKeys: {
            name: 'getAllKeys',
            description: '获取所有存储键名',
            params: [
                { name: 'options', type: 'object', required: false, description: '获取选项' }
            ],
            examples: {
                js: `// 获取localStorage所有键名\nconst localKeys = getAllKeys();\nconsole.log(localKeys); // ['username', 'user', 'theme', ...]\n\n// 获取sessionStorage所有键名\nconst sessionKeys = getAllKeys({\n  storage: 'session'\n});\n\n// 获取带前缀的键名\nconst userKeys = getAllKeys({\n  prefix: 'user_'\n});\nconsole.log(userKeys); // ['user_settings', 'user_cache', ...]\n\n// 获取匹配模式的键名\nconst tempKeys = getAllKeys({\n  pattern: /^temp_\\d+$/\n});\n\n// 获取所有存储的键名（包括localStorage和sessionStorage）\nconst allKeys = getAllKeys({\n  storage: 'all'\n});\n\n// 获取非过期的键名\nconst validKeys = getAllKeys({\n  excludeExpired: true\n});`,
                ts: `import { getAllKeys } from 'general-method-utils';\n\ninterface GetKeysOptions {\n  storage?: 'local' | 'session' | 'all';\n  prefix?: string;\n  pattern?: RegExp;\n  excludeExpired?: boolean;\n}\n\n// 获取localStorage所有键名\nconst localKeys: string[] = getAllKeys();\n\n// 获取sessionStorage所有键名\nconst sessionKeys: string[] = getAllKeys({\n  storage: 'session'\n} as GetKeysOptions);\n\n// 获取带前缀的键名\nconst userKeys: string[] = getAllKeys({\n  prefix: 'user_'\n} as GetKeysOptions);\n\n// 获取匹配模式的键名\nconst tempKeys: string[] = getAllKeys({\n  pattern: /^temp_\\d+$/\n} as GetKeysOptions);`
            },
            demo: true
        },
        getStorageSize: {
            name: 'getStorageSize',
            description: '获取存储大小',
            params: [
                { name: 'options', type: 'object', required: false, description: '获取选项' }
            ],
            examples: {
                js: `// 获取localStorage使用大小\nconst localSize = getStorageSize();\nconsole.log(\`localStorage使用: \${localSize.used}KB / \${localSize.total}KB\`);\n\n// 获取sessionStorage使用大小\nconst sessionSize = getStorageSize({\n  storage: 'session'\n});\n\n// 获取特定键的大小\nconst userDataSize = getStorageSize({\n  key: 'user'\n});\nconsole.log(\`用户数据大小: \${userDataSize.bytes} bytes\`);\n\n// 获取所有存储的总大小\nconst totalSize = getStorageSize({\n  storage: 'all'\n});\n\n// 获取详细的存储信息\nconst detailedInfo = getStorageSize({\n  detailed: true\n});\nconsole.log('存储详情:', detailedInfo);\n// 输出: {\n//   localStorage: { used: 150, total: 5120, percentage: 2.93 },\n//   sessionStorage: { used: 50, total: 5120, percentage: 0.98 },\n//   items: [\n//     { key: 'user', size: 120 },\n//     { key: 'settings', size: 30 }\n//   ]\n// }`,
                ts: `import { getStorageSize } from 'general-method-utils';\n\ninterface StorageSizeOptions {\n  storage?: 'local' | 'session' | 'all';\n  key?: string;\n  detailed?: boolean;\n}\n\ninterface StorageSize {\n  used: number;\n  total: number;\n  percentage: number;\n  bytes?: number;\n}\n\n// 获取localStorage使用大小\nconst localSize: StorageSize = getStorageSize();\nconsole.log(\`localStorage使用: \${localSize.used}KB / \${localSize.total}KB\`);\n\n// 获取sessionStorage使用大小\nconst sessionSize: StorageSize = getStorageSize({\n  storage: 'session'\n} as StorageSizeOptions);\n\n// 获取特定键的大小\nconst userDataSize: StorageSize = getStorageSize({\n  key: 'user'\n} as StorageSizeOptions);`
            },
            demo: true
        },
        watchStorage: {
            name: 'watchStorage',
            description: '监听存储变化',
            params: [
                { name: 'callback', type: 'function', required: true, description: '变化回调函数' },
                { name: 'options', type: 'object', required: false, description: '监听选项' }
            ],
            examples: {
                js: `// 监听所有存储变化\nconst unwatch = watchStorage((event) => {\n  console.log('存储变化:', event);\n  console.log(\`键: \${event.key}, 旧值: \${event.oldValue}, 新值: \${event.newValue}\`);\n});\n\n// 监听特定键的变化\nconst unwatchUser = watchStorage((event) => {\n  console.log('用户数据变化:', event.newValue);\n  updateUserInterface(event.newValue);\n}, {\n  key: 'user'\n});\n\n// 监听多个键的变化\nconst unwatchSettings = watchStorage((event) => {\n  console.log('设置变化:', event);\n  applySettings(event.newValue);\n}, {\n  keys: ['theme', 'language', 'notifications']\n});\n\n// 监听sessionStorage变化\nconst unwatchSession = watchStorage((event) => {\n  console.log('会话存储变化:', event);\n}, {\n  storage: 'session'\n});\n\n// 停止监听\nsetTimeout(() => {\n  unwatch(); // 停止监听\n  console.log('已停止监听存储变化');\n}, 60000);\n\n// 监听存储配额变化\nconst unwatchQuota = watchStorage((event) => {\n  if (event.type === 'quota-exceeded') {\n    console.warn('存储配额已满！');\n    showStorageWarning();\n  }\n}, {\n  watchQuota: true\n});`,
                ts: `import { watchStorage } from 'general-method-utils';\n\ninterface StorageEvent {\n  key: string;\n  oldValue: any;\n  newValue: any;\n  storage: 'local' | 'session';\n  type: 'set' | 'remove' | 'clear' | 'quota-exceeded';\n}\n\ninterface WatchOptions {\n  key?: string;\n  keys?: string[];\n  storage?: 'local' | 'session' | 'all';\n  watchQuota?: boolean;\n}\n\ntype StorageCallback = (event: StorageEvent) => void;\ntype UnwatchFunction = () => void;\n\n// 监听所有存储变化\nconst unwatch: UnwatchFunction = watchStorage((event: StorageEvent) => {\n  console.log('存储变化:', event);\n}, {\n  storage: 'all'\n} as WatchOptions);\n\n// 监听特定键的变化\nconst unwatchUser: UnwatchFunction = watchStorage((event: StorageEvent) => {\n  console.log('用户数据变化:', event.newValue);\n}, {\n  key: 'user'\n} as WatchOptions);\n\n// 停止监听\nsetTimeout(() => {\n  unwatch();\n}, 60000);`
            },
            demo: true
        }
    }
};