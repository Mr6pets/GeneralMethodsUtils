/**
 * 高级安全工具模块
 * 提供加密解密、安全验证、防护机制等功能
 */

/**
 * 高级加密工具
 */
class AdvancedCrypto {
  /**
   * AES加密（使用Web Crypto API）
   * @param {string} plaintext 明文
   * @param {string} password 密码
   * @returns {Promise<string>} 加密后的数据
   */
  static async aesEncrypt(plaintext, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // 生成密钥
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    // 生成盐值
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 派生密钥
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // 生成IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // 加密
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // 组合结果
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  /**
   * AES解密
   * @param {string} encryptedData 加密的数据
   * @param {string} password 密码
   * @returns {Promise<string>} 解密后的明文
   */
  static async aesDecrypt(encryptedData, password) {
    const encoder = new TextEncoder();
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    
    // 提取盐值、IV和加密数据
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);
    
    // 生成密钥
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    // 派生密钥
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // 解密
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }

  /**
   * RSA密钥对生成
   * @param {number} keySize 密钥长度
   * @returns {Promise<Object>} 密钥对
   */
  static async generateRSAKeyPair(keySize = 2048) {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: keySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    
    return {
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
    };
  }

  /**
   * RSA加密
   * @param {string} plaintext 明文
   * @param {string} publicKeyPem 公钥
   * @returns {Promise<string>} 加密后的数据
   */
  static async rsaEncrypt(plaintext, publicKeyPem) {
    const publicKeyBuffer = new Uint8Array(atob(publicKeyPem).split('').map(c => c.charCodeAt(0)));
    
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      data
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  /**
   * RSA解密
   * @param {string} encryptedData 加密的数据
   * @param {string} privateKeyPem 私钥
   * @returns {Promise<string>} 解密后的明文
   */
  static async rsaDecrypt(encryptedData, privateKeyPem) {
    const privateKeyBuffer = new Uint8Array(atob(privateKeyPem).split('').map(c => c.charCodeAt(0)));
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    );
    
    const encryptedBuffer = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedBuffer
    );
    
    return new TextDecoder().decode(decrypted);
  }

  /**
   * 数字签名
   * @param {string} message 消息
   * @param {string} privateKeyPem 私钥
   * @returns {Promise<string>} 签名
   */
  static async sign(message, privateKeyPem) {
    const privateKeyBuffer = new Uint8Array(atob(privateKeyPem).split('').map(c => c.charCodeAt(0)));
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: 'RSA-PSS', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const signature = await crypto.subtle.sign(
      { name: 'RSA-PSS', saltLength: 32 },
      privateKey,
      data
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  /**
   * 验证签名
   * @param {string} message 消息
   * @param {string} signature 签名
   * @param {string} publicKeyPem 公钥
   * @returns {Promise<boolean>} 验证结果
   */
  static async verify(message, signature, publicKeyPem) {
    const publicKeyBuffer = new Uint8Array(atob(publicKeyPem).split('').map(c => c.charCodeAt(0)));
    
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name: 'RSA-PSS', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signatureBuffer = new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0)));
    
    return await crypto.subtle.verify(
      { name: 'RSA-PSS', saltLength: 32 },
      publicKey,
      signatureBuffer,
      data
    );
  }
}

/**
 * 安全验证工具
 */
class SecurityValidator {
  /**
   * 密码强度检查（增强版）
   * @param {string} password 密码
   * @returns {Object} 检查结果
   */
  static checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      minLength: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !this.isCommonPassword(password),
      noSequential: !this.hasSequentialChars(password),
      noRepeated: !this.hasRepeatedChars(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let level = 'weak';
    if (score >= 7) level = 'strong';
    else if (score >= 5) level = 'medium';
    
    const suggestions = [];
    if (!checks.length) suggestions.push('使用至少8个字符');
    if (!checks.minLength) suggestions.push('建议使用12个或更多字符');
    if (!checks.lowercase) suggestions.push('包含小写字母');
    if (!checks.uppercase) suggestions.push('包含大写字母');
    if (!checks.number) suggestions.push('包含数字');
    if (!checks.special) suggestions.push('包含特殊字符');
    if (!checks.noCommon) suggestions.push('避免使用常见密码');
    if (!checks.noSequential) suggestions.push('避免连续字符');
    if (!checks.noRepeated) suggestions.push('避免重复字符');
    
    return {
      score: Math.round((score / 9) * 100),
      level,
      checks,
      suggestions
    };
  }

  /**
   * 检查是否为常见密码
   * @param {string} password 密码
   * @returns {boolean} 是否为常见密码
   */
  static isCommonPassword(password) {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '1234567890', 'password1', '123123', 'qwerty123'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * 检查是否有连续字符
   * @param {string} password 密码
   * @returns {boolean} 是否有连续字符
   */
  static hasSequentialChars(password) {
    const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop'];
    
    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        if (password.toLowerCase().includes(seq.substr(i, 3))) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * 检查是否有重复字符
   * @param {string} password 密码
   * @returns {boolean} 是否有重复字符
   */
  static hasRepeatedChars(password) {
    return /(..).*\1/.test(password);
  }

  /**
   * SQL注入检测
   * @param {string} input 输入字符串
   * @returns {boolean} 是否包含SQL注入
   */
  static detectSQLInjection(input) {
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * XSS检测
   * @param {string} input 输入字符串
   * @returns {boolean} 是否包含XSS
   */
  static detectXSS(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]+src[\s]*=[\s]*["']?[\s]*javascript:/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * 输入清理
   * @param {string} input 输入字符串
   * @returns {string} 清理后的字符串
   */
  static sanitizeInput(input) {
    return input
      .replace(/[<>"'&]/g, (match) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match];
      })
      .trim();
  }
}

/**
 * 访问控制和权限管理
 */
class AccessControl {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
    this.userRoles = new Map();
  }

  /**
   * 定义角色
   * @param {string} roleName 角色名称
   * @param {Array} permissions 权限列表
   */
  defineRole(roleName, permissions = []) {
    this.roles.set(roleName, new Set(permissions));
  }

  /**
   * 添加权限到角色
   * @param {string} roleName 角色名称
   * @param {string} permission 权限
   */
  addPermissionToRole(roleName, permission) {
    if (this.roles.has(roleName)) {
      this.roles.get(roleName).add(permission);
    }
  }

  /**
   * 分配角色给用户
   * @param {string} userId 用户ID
   * @param {string} roleName 角色名称
   */
  assignRole(userId, roleName) {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId).add(roleName);
  }

  /**
   * 检查用户权限
   * @param {string} userId 用户ID
   * @param {string} permission 权限
   * @returns {boolean} 是否有权限
   */
  hasPermission(userId, permission) {
    const userRoles = this.userRoles.get(userId);
    if (!userRoles) return false;
    
    for (const roleName of userRoles) {
      const rolePermissions = this.roles.get(roleName);
      if (rolePermissions && rolePermissions.has(permission)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 获取用户所有权限
   * @param {string} userId 用户ID
   * @returns {Set} 权限集合
   */
  getUserPermissions(userId) {
    const allPermissions = new Set();
    const userRoles = this.userRoles.get(userId);
    
    if (userRoles) {
      for (const roleName of userRoles) {
        const rolePermissions = this.roles.get(roleName);
        if (rolePermissions) {
          rolePermissions.forEach(permission => allPermissions.add(permission));
        }
      }
    }
    
    return allPermissions;
  }
}

/**
 * 安全会话管理
 */
class SecureSession {
  constructor(options = {}) {
    this.sessions = new Map();
    this.options = {
      maxAge: options.maxAge || 30 * 60 * 1000, // 30分钟
      secure: options.secure || false,
      httpOnly: options.httpOnly || true,
      sameSite: options.sameSite || 'strict'
    };
  }

  /**
   * 创建会话
   * @param {string} userId 用户ID
   * @param {Object} data 会话数据
   * @returns {string} 会话ID
   */
  createSession(userId, data = {}) {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      userId,
      data,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    this.sessions.set(sessionId, session);
    this.setSessionCookie(sessionId);
    
    return sessionId;
  }

  /**
   * 获取会话
   * @param {string} sessionId 会话ID
   * @returns {Object|null} 会话对象
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) return null;
    
    // 检查会话是否过期
    if (Date.now() - session.lastAccessed > this.options.maxAge) {
      this.destroySession(sessionId);
      return null;
    }
    
    // 更新最后访问时间
    session.lastAccessed = Date.now();
    
    return session;
  }

  /**
   * 更新会话数据
   * @param {string} sessionId 会话ID
   * @param {Object} data 新数据
   */
  updateSession(sessionId, data) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.data = { ...session.data, ...data };
      session.lastAccessed = Date.now();
    }
  }

  /**
   * 销毁会话
   * @param {string} sessionId 会话ID
   */
  destroySession(sessionId) {
    this.sessions.delete(sessionId);
    this.clearSessionCookie();
  }

  /**
   * 清理过期会话
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastAccessed > this.options.maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * 生成会话ID
   * @returns {string} 会话ID
   */
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 设置会话Cookie
   * @param {string} sessionId 会话ID
   */
  setSessionCookie(sessionId) {
    const cookieOptions = [
      `sessionId=${sessionId}`,
      `Max-Age=${Math.floor(this.options.maxAge / 1000)}`,
      `SameSite=${this.options.sameSite}`
    ];
    
    if (this.options.secure) {
      cookieOptions.push('Secure');
    }
    
    if (this.options.httpOnly) {
      cookieOptions.push('HttpOnly');
    }
    
    document.cookie = cookieOptions.join('; ');
  }

  /**
   * 清除会话Cookie
   */
  clearSessionCookie() {
    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  /**
   * 获取客户端IP（模拟）
   * @returns {string} IP地址
   */
  getClientIP() {
    // 在实际应用中，这应该从服务器端获取
    return '127.0.0.1';
  }
}

/**
 * 内容安全策略（CSP）助手
 */
class CSPHelper {
  /**
   * 生成CSP头
   * @param {Object} policy CSP策略
   * @returns {string} CSP头字符串
   */
  static generateCSPHeader(policy = {}) {
    const defaultPolicy = {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'frame-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
    
    const mergedPolicy = { ...defaultPolicy, ...policy };
    
    return Object.entries(mergedPolicy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  /**
   * 设置CSP头
   * @param {Object} policy CSP策略
   */
  static setCSPHeader(policy) {
    const cspHeader = this.generateCSPHeader(policy);
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspHeader;
    document.head.appendChild(meta);
  }
}

// 导出所有类和函数
export {
  AdvancedCrypto,
  SecurityValidator,
  AccessControl,
  SecureSession,
  CSPHelper
};

// 便捷函数
export async function encryptAES(plaintext, password) {
  return await AdvancedCrypto.aesEncrypt(plaintext, password);
}

export async function decryptAES(encryptedData, password) {
  return await AdvancedCrypto.aesDecrypt(encryptedData, password);
}

export async function generateRSAKeys(keySize) {
  return await AdvancedCrypto.generateRSAKeyPair(keySize);
}

export function checkPasswordSecurity(password) {
  return SecurityValidator.checkPasswordStrength(password);
}

export function sanitizeUserInput(input) {
  return SecurityValidator.sanitizeInput(input);
}

export function detectSecurityThreats(input) {
  return {
    sqlInjection: SecurityValidator.detectSQLInjection(input),
    xss: SecurityValidator.detectXSS(input)
  };
}

export function createAccessControl() {
  return new AccessControl();
}

export function createSecureSession(options) {
  return new SecureSession(options);
}

export function generateCSP(policy) {
  return CSPHelper.generateCSPHeader(policy);
}