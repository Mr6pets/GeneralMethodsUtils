// 完整的模块数据配置
const moduleData = {
    // Cookie 工具
    cookieUtils: {
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
                    js: `// 设置基础 Cookie
setCookie('username', 'john');

// 设置带过期时间的 Cookie
setCookie('token', 'abc123', {
  expires: 7, // 7天后过期
  path: '/',
  secure: true
});

// 设置会话 Cookie
setCookie('sessionId', 'xyz789', {
  httpOnly: true,
  sameSite: 'strict'
});`,
                    ts: `import { setCookie } from 'general-method-utils';

// 设置基础 Cookie
setCookie('username', 'john');

// 设置带过期时间的 Cookie
setCookie('token', 'abc123', {
  expires: 7, // 7天后过期
  path: '/',
  secure: true
});

// 设置会话 Cookie
setCookie('sessionId', 'xyz789', {
  httpOnly: true,
  sameSite: 'strict'
});`
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
                    js: `// 获取 Cookie 值
const username = getCookie('username');
console.log(username); // 'john'

// 获取不存在的 Cookie
const nonExistent = getCookie('notFound');
console.log(nonExistent); // null

// 获取不存在的 Cookie
const nonExistent = getCookie('notFound');
console.log(nonExistent); // null`,
                    ts: `import { getCookie } from 'general-method-utils';

// 获取 Cookie 值
const username: string | null = getCookie('username');
console.log(username); // 'john'

// 获取不存在的 Cookie
const nonExistent: string | null = getCookie('notFound');
console.log(nonExistent); // null`
                },
                demo: true
            }
        }
    },
    
    // URL 工具
    urlUtils: {
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
                    js: `// 当前 URL: https://example.com?name=john&age=25

// 获取查询参数
const name = getQueryString('name');
console.log(name); // 'john'

const age = getQueryString('age');
console.log(age); // '25'

// 从指定 URL 获取参数
const id = getQueryString('id', 'https://api.com?id=123');
console.log(id); // '123'

// 获取查询参数
const name: string | null = getQueryString('name');
console.log(name); // 'john'

const age: string | null = getQueryString('age');
console.log(age); // '25'

// 从指定 URL 获取参数
const id: string | null = getQueryString('id', 'https://api.com?id=123');
console.log(id); // '123'`,
                    ts: `import { getQueryString } from 'general-method-utils';

// 当前 URL: https://example.com?name=john&age=25

// 获取查询参数
const name: string | null = getQueryString('name');
console.log(name); // 'john'

const age: string | null = getQueryString('age');
console.log(age); // '25'

// 从指定 URL 获取参数
const id: string | null = getQueryString('id', 'https://api.com?id=123');
console.log(id); // '123'`
                },
                demo: true
            }
        }
    },
    
    // AI/ML 工具
    aimlUtils: {
        title: 'AI/ML 集成工具',
        icon: 'fas fa-robot',
        methods: {
            chat: {
                name: 'chat',
                description: 'AI 聊天对话，支持多种模型和配置',
                params: [
                    { name: 'messages', type: 'Array<ChatMessage>', required: true, description: '对话消息数组' },
                    { name: 'options', type: 'AIModelOptions', required: false, description: '模型配置选项' }
                ],
                examples: {
                    js: `// 基础聊天对话
const response = await aimlUtils.chat([\n  { role: 'user', content: '你好，请介绍一下人工智能' }\n], {\n  model: 'gpt-3.5-turbo',\n  temperature: 0.7,\n  maxTokens: 1000\n});\n\nconsole.log(response.content);\n\n// 多轮对话\nconst conversation = [\n  { role: 'user', content: '什么是机器学习？' },\n  { role: 'assistant', content: '机器学习是人工智能的一个分支...' },\n  { role: 'user', content: '能举个例子吗？' }\n];\n\nconst reply = await aimlUtils.chat(conversation);`,
                    ts: `import { aimlUtils, ChatMessage, AIModelOptions } from 'general-method-utils';

// 基础聊天对话
const messages: ChatMessage[] = [\n  { role: 'user', content: '你好，请介绍一下人工智能' }\n];\n\nconst options: AIModelOptions = {\n  model: 'gpt-3.5-turbo',\n  temperature: 0.7,\n  maxTokens: 1000\n};\n\nconst response = await aimlUtils.chat(messages, options);\nconsole.log(response.content);`
                },
                demo: true
            },
            analyzeImage: {
                name: 'analyzeImage',
                description: '图像分析，识别对象、文本、人脸等',
                params: [
                    { name: 'imageData', type: 'File | string | ArrayBuffer', required: true, description: '图像数据' },
                    { name: 'options', type: 'ImageAnalysisOptions', required: false, description: '分析选项' }
                ],
                examples: {
                    js: `// 分析上传的图片
const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];

const analysis = await aimlUtils.analyzeImage(file, {\n  features: ['objects', 'text', 'faces'],\n  confidence: 0.8\n});\n\nconsole.log('检测到的对象:', analysis.objects);\nconsole.log('识别的文本:', analysis.text);\nconsole.log('人脸信息:', analysis.faces);\n\n// 分析网络图片
const webImageAnalysis = await aimlUtils.analyzeImage(\n  'https://example.com/image.jpg',\n  { features: ['objects'] }\n);`,
                    ts: `import { aimlUtils, ImageAnalysisOptions } from 'general-method-utils';

// 分析上传的图片
const fileInput = document.getElementById('imageInput') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const options: ImageAnalysisOptions = {\n    features: ['objects', 'text', 'faces'],\n    confidence: 0.8\n  };\n  \n  const analysis = await aimlUtils.analyzeImage(file, options);\n  console.log('检测到的对象:', analysis.objects);\n}`
                },
                demo: true
            }
        }
    },
    
    // 安全工具
    securityUtils: {
        title: '高级安全工具',
        icon: 'fas fa-shield-alt',
        methods: {
            scanSecurity: {
                name: 'scanSecurity',
                description: '执行安全扫描，检测常见安全问题',
                params: [
                    { name: 'options', type: 'SecurityScanOptions', required: false, description: '扫描配置选项' }
                ],
                examples: {
                    js: `// 执行全面安全扫描
const scanResult = await securityUtils.scanSecurity({\n  checkXSS: true,\n  checkCSRF: true,\n  checkHeaders: true,\n  checkCookies: true\n});\n\nconsole.log('安全评分:', scanResult.score);\nconsole.log('发现的问题:', scanResult.issues);\nconsole.log('安全建议:', scanResult.recommendations);\n\n// 检查特定安全问题
const xssCheck = await securityUtils.scanSecurity({\n  checkXSS: true,\n  checkCSRF: false\n});`,
                    ts: `import { securityUtils, SecurityScanOptions } from 'general-method-utils';

// 执行全面安全扫描
const options: SecurityScanOptions = {\n  checkXSS: true,\n  checkCSRF: true,\n  checkHeaders: true,\n  checkCookies: true\n};\n\nconst scanResult = await securityUtils.scanSecurity(options);\nconsole.log('安全评分:', scanResult.score);\nconsole.log('发现的问题:', scanResult.issues);`
                },
                demo: true
            },
            encrypt: {
                name: 'encrypt',
                description: '数据加密，支持多种加密算法',
                params: [
                    { name: 'data', type: 'string', required: true, description: '要加密的数据' },
                    { name: 'options', type: 'EncryptionOptions', required: false, description: '加密选项' }
                ],
                examples: {
                    js: `// 基础数据加密
const encrypted = await securityUtils.encrypt('敏感数据', {\n  algorithm: 'AES-GCM',\n  keyLength: 256\n});\n\nconsole.log('加密数据:', encrypted.data);\nconsole.log('密钥:', encrypted.key);\nconsole.log('初始向量:', encrypted.iv);\n\n// 解密数据
const decrypted = await securityUtils.decrypt(encrypted.data, {\n  key: encrypted.key,\n  iv: encrypted.iv\n});\n\nconsole.log('解密结果:', decrypted);

// 解密数据
const decrypted = await securityUtils.decrypt(encrypted.data, {\n  key: encrypted.key,\n  iv: encrypted.iv\n});`
                },
                demo: false
            }
        }
    },
    
    // WebRTC 工具
    webrtcUtils: {
        title: 'WebRTC 通信工具',
        icon: 'fas fa-video',
        methods: {
            createConnection: {
                name: 'createConnection',
                description: '创建 WebRTC 连接，支持音视频通话',
                params: [
                    { name: 'options', type: 'WebRTCOptions', required: false, description: 'WebRTC 配置选项' }
                ],
                examples: {
                    js: `// 创建 WebRTC 连接
const rtc = await webrtcUtils.createConnection({\n  iceServers: [\n    { urls: 'stun:stun.l.google.com:19302' }\n  ],\n  video: true,\n  audio: true\n});\n\n// 获取本地视频流
const localVideo = document.getElementById('localVideo');\nlocalVideo.srcObject = rtc.localStream;\n\n// 处理远程视频流
rtc.onRemoteStream = (stream) => {\n  const remoteVideo = document.getElementById('remoteVideo');\n  remoteVideo.srcObject = stream;\n};\n\n// 发起通话
const call = await rtc.startCall('user2');`,
                    ts: `import { webrtcUtils, WebRTCOptions } from 'general-method-utils';

// 创建 WebRTC 连接
const options: WebRTCOptions = {\n  iceServers: [\n    { urls: 'stun:stun.l.google.com:19302' }\n  ],\n  video: true,\n  audio: true\n};\n\nconst rtc = await webrtcUtils.createConnection(options);\n\n// 获取本地视频流
const localVideo = document.getElementById('localVideo') as HTMLVideoElement;\nlocalVideo.srcObject = rtc.localStream;`
                },
                demo: true
            },
            startScreenShare: {
                name: 'startScreenShare',
                description: '开始屏幕共享',
                params: [
                    { name: 'options', type: 'ScreenShareOptions', required: false, description: '屏幕共享选项' }
                ],
                examples: {
                    js: `// 开始屏幕共享
const screenShare = await webrtcUtils.startScreenShare({\n  video: true,\n  audio: true,\n  onStream: (stream) => {\n    const screenVideo = document.getElementById('screenVideo');\n    screenVideo.srcObject = stream;\n  },\n  onEnd: () => {\n    console.log('屏幕共享已结束');\n  }\n});\n\n// 停止屏幕共享
screenShare.stop();`,
                    ts: `import { webrtcUtils, ScreenShareOptions } from 'general-method-utils';

// 开始屏幕共享
const options: ScreenShareOptions = {\n  video: true,\n  audio: true,\n  onStream: (stream: MediaStream) => {\n    const screenVideo = document.getElementById('screenVideo') as HTMLVideoElement;\n    screenVideo.srcObject = stream;\n  }\n};\n\nconst screenShare = await webrtcUtils.startScreenShare(options);`
                },
                demo: true
            }
        }
    },
    
    // 区块链工具
    blockchainUtils: {
        title: '区块链工具',
        icon: 'fas fa-cube',
        methods: {
            connectWallet: {
                name: 'connectWallet',
                description: '连接加密货币钱包',
                params: [
                    { name: 'options', type: 'WalletOptions', required: false, description: '钱包连接选项' }
                ],
                examples: {
                    js: `// 连接 MetaMask 钱包
const wallet = await blockchainUtils.connectWallet({\n  provider: 'metamask',\n  chainId: 1 // 以太坊主网\n});\n\nconsole.log('钱包地址:', wallet.address);\nconsole.log('余额:', wallet.balance);\nconsole.log('网络:', wallet.network);\n\n// 连接 WalletConnect
const wcWallet = await blockchainUtils.connectWallet({\n  provider: 'walletconnect',\n  projectId: 'your-project-id'\n});`,
                    ts: `import { blockchainUtils, WalletOptions } from 'general-method-utils';

// 连接 MetaMask 钱包
const options: WalletOptions = {\n  provider: 'metamask',\n  chainId: 1 // 以太坊主网\n};\n\nconst wallet = await blockchainUtils.connectWallet(options);\nconsole.log('钱包地址:', wallet.address);\nconsole.log('余额:', wallet.balance);`
                },
                demo: false
            },
            callContract: {
                name: 'callContract',
                description: '调用智能合约方法',
                params: [
                    { name: 'contractAddress', type: 'string', required: true, description: '合约地址' },
                    { name: 'abi', type: 'any[]', required: true, description: '合约 ABI' },
                    { name: 'method', type: 'string', required: true, description: '方法名称' },
                    { name: 'params', type: 'any[]', required: false, description: '方法参数' }
                ],
                examples: {
                    js: `// 调用 ERC-20 代币合约
const tokenBalance = await blockchainUtils.callContract(\n  '0x1234...', // 代币合约地址\n  tokenABI,\n  'balanceOf',\n  [wallet.address]\n);\n\nconsole.log('代币余额:', tokenBalance);\n\n// 调用自定义合约
const result = await blockchainUtils.callContract(\n  '0x5678...',\n  contractABI,\n  'getUserInfo',\n  [userId]\n);`,
                    ts: `import { blockchainUtils } from 'general-method-utils';

// 调用 ERC-20 代币合约
const tokenBalance = await blockchainUtils.callContract(\n  '0x1234...', // 代币合约地址\n  tokenABI,\n  'balanceOf',\n  [wallet.address]\n);\n\nconsole.log('代币余额:', tokenBalance);`
                },
                demo: false
            }
        }
    },
    
    // 微前端工具
    microfrontendUtils: {
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
                    js: `// 注册用户中心应用
nmicrofrontendUtils.registerApp({\n  name: 'user-center',\n  entry: 'http://localhost:3001',\n  container: '#user-app',\n  activeWhen: '/user',\n  props: {\n    token: 'abc123',\n    theme: 'dark'\n  }\n});\n\n// 注册订单系统
nmicrofrontendUtils.registerApp({\n  name: 'order-system',\n  entry: 'http://localhost:3002',\n  container: '#order-app',\n  activeWhen: ['/order', '/cart']\n});`,
                    ts: `import { microfrontendUtils, MicrofrontendConfig } from 'general-method-utils';

// 注册用户中心应用
const userAppConfig: MicrofrontendConfig = {\n  name: 'user-center',\n  entry: 'http://localhost:3001',\n  container: '#user-app',\n  activeWhen: '/user',\n  props: {\n    token: 'abc123',\n    theme: 'dark'\n  }\n};\n\nmicrofrontendUtils.registerApp(userAppConfig);`
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
                    js: `// 发送用户登录消息
nmicrofrontendUtils.sendMessage('user-center', {\n  type: 'USER_LOGIN',\n  data: { userId: 123, username: 'john' }\n});\n\n// 发送导航消息
nmicrofrontendUtils.sendMessage('order-system', {\n  type: 'NAVIGATE',\n  path: '/order/123'\n});\n\n// 监听消息
nmicrofrontendUtils.onMessage((message) => {\n  console.log('收到消息:', message);\n  if (message.type === 'USER_LOGOUT') {\n    handleUserLogout();\n  }\n});`,
                    ts: `import { microfrontendUtils } from 'general-method-utils';

// 发送用户登录消息
nmicrofrontendUtils.sendMessage('user-center', {\n  type: 'USER_LOGIN',\n  data: { userId: 123, username: 'john' }\n});\n\n// 监听消息
nmicrofrontendUtils.onMessage((message: any) => {\n  console.log('收到消息:', message);\n  if (message.type === 'USER_LOGOUT') {\n    handleUserLogout();\n  }\n});`
                },
                demo: false
            }
        }
    }
};

// 用户状态管理
const userState = {
    isLoggedIn: false,
    isPremium: false,
    username: '',
    
    login(username) {
        this.isLoggedIn = true;
        this.username = username;
        this.updateUI();
    },
    
    logout() {
        this.isLoggedIn = false;
        this.isPremium = false;
        this.username = '';
        this.updateUI();
    },
    
    upgrade() {
        this.isPremium = true;
        this.updateUI();
    },
    
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const upgradeBtn = document.getElementById('upgradeBtn');
        const premiumOverlay = document.getElementById('premiumOverlay');
        
        if (this.isLoggedIn) {
            loginBtn.textContent = `${this.username} (退出)`;
            loginBtn.onclick = () => this.logout();
        } else {
            loginBtn.textContent = '登录';
            // 移除这行，让events.js处理点击事件
            // loginBtn.onclick = () => showModal('loginModal');
        }
        
        if (this.isPremium) {
            upgradeBtn.style.display = 'none';
            if (premiumOverlay) {
                premiumOverlay.style.display = 'none';
            }
        } else {
            upgradeBtn.style.display = 'block';
            if (premiumOverlay) {
                premiumOverlay.style.display = 'flex';
            }
        }
    }
};

// 演示数据生成器
const demoGenerators = {
    setCookie: () => {
        return `
            <div class="demo-form">
                <div class="form-group">
                    <label>Cookie 名称:</label>
                    <input type="text" id="cookieName" value="testCookie" />
                </div>
                <div class="form-group">
                    <label>Cookie 值:</label>
                    <input type="text" id="cookieValue" value="testValue" />
                </div>
                <div class="form-group">
                    <label>过期天数:</label>
                    <input type="number" id="cookieExpires" value="7" />
                </div>
                <button class="btn btn-primary" onclick="demoSetCookie()">设置 Cookie</button>
                <button class="btn btn-outline" onclick="demoGetCookie()">获取 Cookie</button>
                <div id="cookieResult" class="demo-result"></div>
            </div>
            <script>
                function demoSetCookie() {
                    const name = document.getElementById('cookieName').value;
                    const value = document.getElementById('cookieValue').value;
                    const expires = parseInt(document.getElementById('cookieExpires').value);
                    
                    // 模拟 setCookie 函数
                    const date = new Date();
                    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
                    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
                    
                    document.getElementById('cookieResult').innerHTML = 
                        '<div class="success">Cookie 设置成功！</div>';
                }
                
                function demoGetCookie() {
                    const name = document.getElementById('cookieName').value;
                    const value = document.cookie
                        .split('; ')
                        .find(row => row.startsWith(name + '='))
                        ?.split('=')[1];
                    
                    document.getElementById('cookieResult').innerHTML = 
                        '<div class="info">Cookie 值: ' + (value || '未找到') + '</div>';
                }
            </script>
        `;
    },
    
    getQueryString: () => {
        return `
            <div class="demo-form">
                <div class="form-group">
                    <label>测试 URL:</label>
                    <input type="text" id="testUrl" value="https://example.com?name=john&age=25&city=beijing" style="width: 100%;" />
                </div>
                <div class="form-group">
                    <label>参数名称:</label>
                    <input type="text" id="paramName" value="name" />
                </div>
                <button class="btn btn-primary" onclick="demoGetQueryString()">获取参数</button>
                <div id="queryResult" class="demo-result"></div>
            </div>
            <script>
                function demoGetQueryString() {
                    const url = document.getElementById('testUrl').value;
                    const paramName = document.getElementById('paramName').value;
                    
                    try {
                        const urlObj = new URL(url);
                        const value = urlObj.searchParams.get(paramName);
                        
                        document.getElementById('queryResult').innerHTML = 
                            '<div class="info">参数值: ' + (value || '未找到') + '</div>';
                    } catch (error) {
                        document.getElementById('queryResult').innerHTML = 
                            '<div class="error">URL 格式错误</div>';
                    }
                }
            </script>
        `;
    },
    
    chat: () => {
        return `
            <div class="demo-form">
                <div class="chat-container" id="chatContainer" style="height: 300px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; overflow-y: auto; margin-bottom: 16px; background: #f8fafc;">
                    <div class="chat-message assistant">
                        <strong>AI助手:</strong> 你好！我是AI助手，有什么可以帮助你的吗？
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" id="chatInput" placeholder="输入你的问题..." style="width: calc(100% - 80px);" />
                    <button class="btn btn-primary" onclick="demoChat()" style="width: 70px; margin-left: 10px;">发送</button>
                </div>
            </div>
            <script>
                function demoChat() {
                    const input = document.getElementById('chatInput');
                    const container = document.getElementById('chatContainer');
                    const message = input.value.trim();
                    
                    if (!message) return;
                    
                    // 添加用户消息
                    const userMsg = document.createElement('div');
                    userMsg.className = 'chat-message user';
                    userMsg.innerHTML = '<strong>你:</strong> ' + message;
                    userMsg.style.marginBottom = '12px';
                    userMsg.style.textAlign = 'right';
                    container.appendChild(userMsg);
                    
                    // 模拟AI回复
                    setTimeout(() => {
                        const aiMsg = document.createElement('div');
                        aiMsg.className = 'chat-message assistant';
                        aiMsg.innerHTML = '<strong>AI助手:</strong> 这是一个模拟回复。在实际应用中，这里会调用真实的AI API。';
                        aiMsg.style.marginBottom = '12px';
                        container.appendChild(aiMsg);
                        container.scrollTop = container.scrollHeight;
                    }, 1000);
                    
                    input.value = '';
                    container.scrollTop = container.scrollHeight;
                }
                
                document.getElementById('chatInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        demoChat();
                    }
                });
            </script>
        `;
    }
};

// 导出到全局作用域
window.moduleData = moduleData;
window.userState = userState;
window.demoGenerators = demoGenerators;