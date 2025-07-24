// 高级安全工具模块
export default {
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
                js: `// 执行全面安全扫描\nconst scanResult = await securityUtils.scanSecurity({\n  checkXSS: true,\n  checkCSRF: true,\n  checkHeaders: true,\n  checkCookies: true\n});\n\nconsole.log('安全评分:', scanResult.score);\nconsole.log('发现的问题:', scanResult.issues);\nconsole.log('安全建议:', scanResult.recommendations);\n\n// 检查特定安全问题\nconst xssCheck = await securityUtils.scanSecurity({\n  checkXSS: true,\n  checkCSRF: false\n});`,
                ts: `import { securityUtils, SecurityScanOptions } from 'general-method-utils';\n\n// 执行全面安全扫描\nconst options: SecurityScanOptions = {\n  checkXSS: true,\n  checkCSRF: true,\n  checkHeaders: true,\n  checkCookies: true\n};\n\nconst scanResult = await securityUtils.scanSecurity(options);\nconsole.log('安全评分:', scanResult.score);\nconsole.log('发现的问题:', scanResult.issues);`
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
                js: `// 基础数据加密\nconst encrypted = await securityUtils.encrypt('敏感数据', {\n  algorithm: 'AES-GCM',\n  keyLength: 256\n});\n\nconsole.log('加密数据:', encrypted.data);\nconsole.log('密钥:', encrypted.key);\nconsole.log('初始向量:', encrypted.iv);\n\n// 解密数据\nconst decrypted = await securityUtils.decrypt(encrypted.data, {\n  key: encrypted.key,\n  iv: encrypted.iv\n});\n\nconsole.log('解密结果:', decrypted);`,
                ts: `import { securityUtils, EncryptionOptions } from 'general-method-utils';\n\n// 基础数据加密\nconst options: EncryptionOptions = {\n  algorithm: 'AES-GCM',\n  keyLength: 256\n};\n\nconst encrypted = await securityUtils.encrypt('敏感数据', options);\nconsole.log('加密数据:', encrypted.data);\n\n// 解密数据\nconst decrypted = await securityUtils.decrypt(encrypted.data, {\n  key: encrypted.key,\n  iv: encrypted.iv\n});`
            },
            demo: false
        },
        hashPassword: {
            name: 'hashPassword',
            description: '安全的密码哈希处理',
            params: [
                { name: 'password', type: 'string', required: true, description: '原始密码' },
                { name: 'options', type: 'HashOptions', required: false, description: '哈希选项' }
            ],
            examples: {
                js: `// 哈希密码\nconst hashedPassword = await securityUtils.hashPassword('myPassword123', {\n  algorithm: 'bcrypt',\n  saltRounds: 12\n});\nconsole.log('哈希密码:', hashedPassword);\n\n// 验证密码\nconst isValid = await securityUtils.verifyPassword(\n  'myPassword123',\n  hashedPassword\n);\nconsole.log('密码正确:', isValid);\n\n// 使用 Argon2\nconst argonHash = await securityUtils.hashPassword('myPassword123', {\n  algorithm: 'argon2',\n  memoryCost: 65536,\n  timeCost: 3\n});`,
                ts: `import { securityUtils, HashOptions } from 'general-method-utils';\n\n// 哈希密码\nconst options: HashOptions = {\n  algorithm: 'bcrypt',\n  saltRounds: 12\n};\n\nconst hashedPassword: string = await securityUtils.hashPassword(\n  'myPassword123',\n  options\n);\nconsole.log('哈希密码:', hashedPassword);\n\n// 验证密码\nconst isValid: boolean = await securityUtils.verifyPassword(\n  'myPassword123',\n  hashedPassword\n);`
            },
            demo: true
        },
        sanitizeInput: {
            name: 'sanitizeInput',
            description: '清理和验证用户输入，防止XSS攻击',
            params: [
                { name: 'input', type: 'string', required: true, description: '用户输入' },
                { name: 'options', type: 'SanitizeOptions', required: false, description: '清理选项' }
            ],
            examples: {
                js: `// 清理HTML输入\nconst userInput = '<script>alert("XSS")</script><p>正常内容</p>';\nconst sanitized = securityUtils.sanitizeInput(userInput, {\n  allowedTags: ['p', 'br', 'strong', 'em'],\n  allowedAttributes: ['class', 'id']\n});\nconsole.log(sanitized); // '<p>正常内容</p>'\n\n// 清理SQL注入\nconst sqlInput = "'; DROP TABLE users; --";\nconst safeSql = securityUtils.sanitizeInput(sqlInput, {\n  type: 'sql',\n  escapeQuotes: true\n});\n\n// 清理文件路径\nconst filePath = '../../../etc/passwd';\nconst safePath = securityUtils.sanitizeInput(filePath, {\n  type: 'filepath',\n  allowTraversal: false\n});`,
                ts: `import { securityUtils, SanitizeOptions } from 'general-method-utils';\n\n// 清理HTML输入\nconst options: SanitizeOptions = {\n  allowedTags: ['p', 'br', 'strong', 'em'],\n  allowedAttributes: ['class', 'id']\n};\n\nconst userInput = '<script>alert("XSS")</script><p>正常内容</p>';\nconst sanitized: string = securityUtils.sanitizeInput(userInput, options);\nconsole.log(sanitized);`
            },
            demo: true
        },
        generateToken: {
            name: 'generateToken',
            description: '生成安全的随机令牌',
            params: [
                { name: 'options', type: 'TokenOptions', required: false, description: '令牌生成选项' }
            ],
            examples: {
                js: `// 生成随机令牌\nconst token = securityUtils.generateToken({\n  length: 32,\n  type: 'hex'\n});\nconsole.log('令牌:', token);\n\n// 生成JWT令牌\nconst jwtToken = securityUtils.generateToken({\n  type: 'jwt',\n  payload: { userId: 123, role: 'admin' },\n  secret: 'your-secret-key',\n  expiresIn: '1h'\n});\n\n// 生成API密钥\nconst apiKey = securityUtils.generateToken({\n  type: 'apikey',\n  prefix: 'sk_',\n  length: 48\n});\nconsole.log('API密钥:', apiKey);`,
                ts: `import { securityUtils, TokenOptions } from 'general-method-utils';\n\n// 生成随机令牌\nconst options: TokenOptions = {\n  length: 32,\n  type: 'hex'\n};\n\nconst token: string = securityUtils.generateToken(options);\nconsole.log('令牌:', token);\n\n// JWT令牌类型\ninterface JWTPayload {\n  userId: number;\n  role: string;\n}\n\nconst jwtOptions: TokenOptions = {\n  type: 'jwt',\n  payload: { userId: 123, role: 'admin' },\n  secret: 'your-secret-key',\n  expiresIn: '1h'\n};`
            },
            demo: true
        }
    }
};