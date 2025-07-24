// 加密与解密工具模块
export default {
    title: '加密与解密工具',
    icon: 'fas fa-lock',
    methods: {
        encrypt: {
            name: 'encrypt',
            description: '使用AES算法加密数据',
            params: [
                { name: 'data', type: 'string', required: true, description: '要加密的数据' },
                { name: 'key', type: 'string', required: true, description: '加密密钥' },
                { name: 'options', type: 'object', required: false, description: '加密选项' }
            ],
            examples: {
                js: `// AES加密\nconst encrypted = encrypt('Hello World', 'mySecretKey');\nconsole.log(encrypted); // 加密后的字符串\n\n// 带选项的加密\nconst result = encrypt('sensitive data', 'key123', {\n  algorithm: 'AES-256-GCM',\n  encoding: 'base64'\n});`,
                ts: `import { encrypt } from 'general-method-utils';\n\nconst encrypted: string = encrypt('Hello World', 'mySecretKey');\nconsole.log(encrypted);\n\nconst result = encrypt('sensitive data', 'key123', {\n  algorithm: 'AES-256-GCM',\n  encoding: 'base64'\n});`
            },
            demo: true
        },
        decrypt: {
            name: 'decrypt',
            description: '使用AES算法解密数据',
            params: [
                { name: 'encryptedData', type: 'string', required: true, description: '加密的数据' },
                { name: 'key', type: 'string', required: true, description: '解密密钥' },
                { name: 'options', type: 'object', required: false, description: '解密选项' }
            ],
            examples: {
                js: `// AES解密\nconst decrypted = decrypt(encryptedData, 'mySecretKey');\nconsole.log(decrypted); // 'Hello World'\n\n// 带选项的解密\nconst result = decrypt(encryptedData, 'key123', {\n  algorithm: 'AES-256-GCM',\n  encoding: 'base64'\n});`,
                ts: `import { decrypt } from 'general-method-utils';\n\nconst decrypted: string = decrypt(encryptedData, 'mySecretKey');\nconsole.log(decrypted);`
            },
            demo: true
        },
        generateHash: {
            name: 'generateHash',
            description: '生成数据的哈希值',
            params: [
                { name: 'data', type: 'string', required: true, description: '要哈希的数据' },
                { name: 'algorithm', type: 'string', required: false, description: '哈希算法，默认SHA-256' }
            ],
            examples: {
                js: `// 生成SHA-256哈希\nconst hash = generateHash('Hello World');\nconsole.log(hash);\n\n// 使用MD5算法\nconst md5Hash = generateHash('data', 'MD5');`,
                ts: `import { generateHash } from 'general-method-utils';\n\nconst hash: string = generateHash('Hello World');\nconst md5Hash: string = generateHash('data', 'MD5');`
            },
            demo: true
        },
        generateSalt: {
            name: 'generateSalt',
            description: '生成随机盐值',
            params: [
                { name: 'length', type: 'number', required: false, description: '盐值长度，默认16' }
            ],
            examples: {
                js: `// 生成默认长度盐值\nconst salt = generateSalt();\nconsole.log(salt);\n\n// 生成指定长度盐值\nconst longSalt = generateSalt(32);`,
                ts: `import { generateSalt } from 'general-method-utils';\n\nconst salt: string = generateSalt();\nconst longSalt: string = generateSalt(32);`
            },
            demo: true
        },
        hashPassword: {
            name: 'hashPassword',
            description: '使用盐值哈希密码',
            params: [
                { name: 'password', type: 'string', required: true, description: '密码' },
                { name: 'salt', type: 'string', required: false, description: '盐值，不提供则自动生成' }
            ],
            examples: {
                js: `// 哈希密码（自动生成盐值）\nconst hashed = hashPassword('myPassword123');\nconsole.log(hashed); // { hash: '...', salt: '...' }\n\n// 使用指定盐值\nconst result = hashPassword('myPassword123', 'mySalt');`,
                ts: `import { hashPassword } from 'general-method-utils';\n\ninterface HashedPassword {\n  hash: string;\n  salt: string;\n}\n\nconst hashed: HashedPassword = hashPassword('myPassword123');`
            },
            demo: true
        },
        verifyPassword: {
            name: 'verifyPassword',
            description: '验证密码是否正确',
            params: [
                { name: 'password', type: 'string', required: true, description: '要验证的密码' },
                { name: 'hash', type: 'string', required: true, description: '存储的哈希值' },
                { name: 'salt', type: 'string', required: true, description: '盐值' }
            ],
            examples: {
                js: `// 验证密码\nconst isValid = verifyPassword('myPassword123', storedHash, storedSalt);\nconsole.log(isValid); // true 或 false\n\n// 登录验证示例\nif (verifyPassword(inputPassword, user.passwordHash, user.salt)) {\n  console.log('登录成功');\n} else {\n  console.log('密码错误');\n}`,
                ts: `import { verifyPassword } from 'general-method-utils';\n\nconst isValid: boolean = verifyPassword('myPassword123', storedHash, storedSalt);\n\nif (verifyPassword(inputPassword, user.passwordHash, user.salt)) {\n  console.log('登录成功');\n}`
            },
            demo: true
        }
    }
};