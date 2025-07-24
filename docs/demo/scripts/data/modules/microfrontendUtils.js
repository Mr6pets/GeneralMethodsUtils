// 微前端工具模块
export default {
    title: '微前端工具',
    icon: 'fas fa-puzzle-piece',
    methods: {
        registerApp: {
            name: 'registerApp',
            description: '注册微前端应用',
            params: [
                { name: 'appConfig', type: 'MicrofrontendConfig', required: true, description: '应用配置' }
            ],
            examples: {
                js: `// 注册用户中心应用\nmicrofrontendUtils.registerApp({\n  name: 'user-center',\n  entry: 'http://localhost:3001',\n  container: '#user-app',\n  activeWhen: '/user',\n  props: {\n    token: 'abc123',\n    theme: 'dark'\n  }\n});\n\n// 注册订单系统\nmicrofrontendUtils.registerApp({\n  name: 'order-system',\n  entry: 'http://localhost:3002',\n  container: '#order-app',\n  activeWhen: ['/order', '/cart']\n});`,
                ts: `import { microfrontendUtils, MicrofrontendConfig } from 'general-method-utils';\n\n// 注册用户中心应用\nconst userAppConfig: MicrofrontendConfig = {\n  name: 'user-center',\n  entry: 'http://localhost:3001',\n  container: '#user-app',\n  activeWhen: '/user',\n  props: {\n    token: 'abc123',\n    theme: 'dark'\n  }\n};\n\nmicrofrontendUtils.registerApp(userAppConfig);`
            },
            demo: false
        },
        sendMessage: {
            name: 'sendMessage',
            description: '应用间消息通信',
            params: [
                { name: 'targetApp', type: 'string', required: true, description: '目标应用名称' },
                { name: 'message', type: 'any', required: true, description: '消息内容' }
            ],
            examples: {
                js: `// 发送用户登录消息\nmicrofrontendUtils.sendMessage('user-center', {\n  type: 'USER_LOGIN',\n  data: { userId: 123, username: 'john' }\n});\n\n// 发送导航消息\nmicrofrontendUtils.sendMessage('order-system', {\n  type: 'NAVIGATE',\n  path: '/order/123'\n});\n\n// 监听消息\nmicrofrontendUtils.onMessage((message) => {\n  console.log('收到消息:', message);\n  if (message.type === 'USER_LOGOUT') {\n    handleUserLogout();\n  }\n});`,
                ts: `import { microfrontendUtils } from 'general-method-utils';\n\n// 发送用户登录消息\nmicrofrontendUtils.sendMessage('user-center', {\n  type: 'USER_LOGIN',\n  data: { userId: 123, username: 'john' }\n});\n\n// 监听消息\nmicrofrontendUtils.onMessage((message: any) => {\n  console.log('收到消息:', message);\n  if (message.type === 'USER_LOGOUT') {\n    handleUserLogout();\n  }\n});`
            },
            demo: false
        }
    }
};