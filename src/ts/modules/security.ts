import {
  SecurityScanOptions,
  SecurityRule,
  SecurityScanResult,
  SecurityVulnerability,
  CSPOptions,
  EncryptionOptions,
  EncryptionResult,
  SecurityHeaders,
  RateLimitOptions,
  RateLimitResult
} from '../types';

/**
 * 高级安全工具类
 */
export class SecurityManager {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private securityRules: SecurityRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * 初始化默认安全规则
   */
  private initializeDefaultRules(): void {
    this.securityRules = [
      {
        name: 'XSS Detection',
        pattern: /<script[^>]*>.*?<\/script>/gi,
        severity: 'high',
        description: 'Potential XSS attack detected'
      },
      {
        name: 'SQL Injection',
        pattern: /(union|select|insert|update|delete|drop|create|alter)\s+/gi,
        severity: 'critical',
        description: 'Potential SQL injection detected'
      },
      {
        name: 'Path Traversal',
        pattern: /\.\.[\/\\]/g,
        severity: 'high',
        description: 'Path traversal attempt detected'
      },
      {
        name: 'Command Injection',
        pattern: /[;&|`$(){}\[\]]/g,
        severity: 'critical',
        description: 'Potential command injection detected'
      }
    ];
  }

  /**
   * 安全扫描
   */
  scanContent(content: string, options: SecurityScanOptions = {}): SecurityScanResult {
    const vulnerabilities: SecurityVulnerability[] = [];
    let score = 100;

    // 使用默认规则和自定义规则
    const rulesToCheck = [...this.securityRules, ...(options.customRules || [])];

    rulesToCheck.forEach(rule => {
      if (rule.pattern.test(content)) {
        const vulnerability: SecurityVulnerability = {
          type: rule.name,
          severity: rule.severity,
          description: rule.description,
          recommendation: this.getRecommendation(rule.name)
        };
        vulnerabilities.push(vulnerability);

        // 根据严重程度扣分
        switch (rule.severity) {
          case 'critical':
            score -= 30;
            break;
          case 'high':
            score -= 20;
            break;
          case 'medium':
            score -= 10;
            break;
          case 'low':
            score -= 5;
            break;
        }
      }
    });

    // XSS 检查
    if (options.checkXSS !== false) {
      const xssPatterns = [
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>/gi,
        /<object[^>]*>/gi,
        /<embed[^>]*>/gi
      ];

      xssPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          vulnerabilities.push({
            type: 'XSS',
            severity: 'high',
            description: 'Cross-site scripting vulnerability detected',
            recommendation: 'Sanitize user input and use Content Security Policy'
          });
          score -= 20;
        }
      });
    }

    // CSRF 检查
    if (options.checkCSRF !== false) {
      if (!content.includes('csrf') && !content.includes('token')) {
        vulnerabilities.push({
          type: 'CSRF',
          severity: 'medium',
          description: 'No CSRF protection detected',
          recommendation: 'Implement CSRF tokens for state-changing operations'
        });
        score -= 10;
      }
    }

    score = Math.max(0, score);

    return {
      isSecure: vulnerabilities.length === 0,
      vulnerabilities,
      score,
      recommendations: this.generateRecommendations(vulnerabilities)
    };
  }

  /**
   * 生成内容安全策略
   */
  generateCSP(options: CSPOptions): string {
    const directives: string[] = [];

    if (options.defaultSrc) {
      directives.push(`default-src ${options.defaultSrc.join(' ')}`);
    }
    if (options.scriptSrc) {
      directives.push(`script-src ${options.scriptSrc.join(' ')}`);
    }
    if (options.styleSrc) {
      directives.push(`style-src ${options.styleSrc.join(' ')}`);
    }
    if (options.imgSrc) {
      directives.push(`img-src ${options.imgSrc.join(' ')}`);
    }
    if (options.connectSrc) {
      directives.push(`connect-src ${options.connectSrc.join(' ')}`);
    }
    if (options.fontSrc) {
      directives.push(`font-src ${options.fontSrc.join(' ')}`);
    }
    if (options.objectSrc) {
      directives.push(`object-src ${options.objectSrc.join(' ')}`);
    }
    if (options.mediaSrc) {
      directives.push(`media-src ${options.mediaSrc.join(' ')}`);
    }
    if (options.frameSrc) {
      directives.push(`frame-src ${options.frameSrc.join(' ')}`);
    }
    if (options.reportUri) {
      directives.push(`report-uri ${options.reportUri}`);
    }
    if (options.upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }

    return directives.join('; ');
  }

  /**
   * 加密数据
   */
  async encryptData(data: string, key: CryptoKey, options: EncryptionOptions = {}): Promise<EncryptionResult> {
    try {
      const algorithm = options.algorithm || 'AES-GCM';
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      let iv: Uint8Array;
      if (options.iv) {
        iv = options.iv;
      } else {
        iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
      }

      const encryptedData = await crypto.subtle.encrypt(
        {
          name: algorithm,
          iv: iv,
          additionalData: options.additionalData
        },
        key,
        dataBuffer
      );

      return {
        encryptedData,
        iv
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 解密数据
   */
  async decryptData(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array, options: EncryptionOptions = {}): Promise<string> {
    try {
      const algorithm = options.algorithm || 'AES-GCM';

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: algorithm,
          iv: iv,
          additionalData: options.additionalData
        },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 生成加密密钥
   */
  async generateKey(algorithm: string = 'AES-GCM', keyLength: number = 256): Promise<CryptoKey> {
    try {
      return await crypto.subtle.generateKey(
        {
          name: algorithm,
          length: keyLength
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      throw new Error(`Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 生成安全头部
   */
  generateSecurityHeaders(cspPolicy?: string): SecurityHeaders {
    const headers: SecurityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };

    if (cspPolicy) {
      headers['Content-Security-Policy'] = cspPolicy;
    }

    return headers;
  }

  /**
   * 速率限制
   */
  checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    // 清理过期记录
    for (const [k, v] of this.rateLimitStore.entries()) {
      if (v.resetTime < now) {
        this.rateLimitStore.delete(k);
      }
    }

    const requestKey = options.keyGenerator ? options.keyGenerator({ key }) : key;
    const record = this.rateLimitStore.get(requestKey);

    if (!record || record.resetTime < now) {
      // 新的时间窗口
      this.rateLimitStore.set(requestKey, {
        count: 1,
        resetTime: now + options.windowMs
      });
      
      return {
        allowed: true,
        remaining: options.maxRequests - 1,
        resetTime: now + options.windowMs
      };
    } else {
      // 现有时间窗口
      if (record.count >= options.maxRequests) {
        if (options.onLimitReached) {
          options.onLimitReached(requestKey);
        }
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: record.resetTime,
          retryAfter: record.resetTime - now
        };
      } else {
        record.count++;
        
        return {
          allowed: true,
          remaining: options.maxRequests - record.count,
          resetTime: record.resetTime
        };
      }
    }
  }

  /**
   * 输入净化
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * 验证 URL
   */
  isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * 生成安全的随机字符串
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 获取建议
   */
  private getRecommendation(ruleName: string): string {
    const recommendations: Record<string, string> = {
      'XSS Detection': 'Sanitize user input and implement Content Security Policy',
      'SQL Injection': 'Use parameterized queries and input validation',
      'Path Traversal': 'Validate and sanitize file paths',
      'Command Injection': 'Avoid executing user input as commands'
    };
    
    return recommendations[ruleName] || 'Review and validate the detected pattern';
  }

  /**
   * 生成安全建议
   */
  private generateRecommendations(vulnerabilities: SecurityVulnerability[]): string[] {
    const recommendations = new Set<string>();
    
    vulnerabilities.forEach(vuln => {
      recommendations.add(vuln.recommendation);
    });
    
    if (vulnerabilities.length > 0) {
      recommendations.add('Implement regular security audits');
      recommendations.add('Use HTTPS for all communications');
      recommendations.add('Keep dependencies up to date');
    }
    
    return Array.from(recommendations);
  }

  /**
   * 添加自定义安全规则
   */
  addSecurityRule(rule: SecurityRule): void {
    this.securityRules.push(rule);
  }

  /**
   * 获取所有安全规则
   */
  getSecurityRules(): SecurityRule[] {
    return [...this.securityRules];
  }
}

// 创建默认实例
const securityManager = new SecurityManager();

// 导出工具函数
export const securityUtils = {
  // 安全扫描
  scanContent: (content: string, options?: SecurityScanOptions) => 
    securityManager.scanContent(content, options),
  
  // CSP 生成
  generateCSP: (options: CSPOptions) => securityManager.generateCSP(options),
  
  // 加密解密
  encryptData: (data: string, key: CryptoKey, options?: EncryptionOptions) => 
    securityManager.encryptData(data, key, options),
  decryptData: (encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array, options?: EncryptionOptions) => 
    securityManager.decryptData(encryptedData, key, iv, options),
  generateKey: (algorithm?: string, keyLength?: number) => 
    securityManager.generateKey(algorithm, keyLength),
  
  // 安全头部
  generateSecurityHeaders: (cspPolicy?: string) => 
    securityManager.generateSecurityHeaders(cspPolicy),
  
  // 速率限制
  checkRateLimit: (key: string, options: RateLimitOptions) => 
    securityManager.checkRateLimit(key, options),
  
  // 输入处理
  sanitizeInput: (input: string) => securityManager.sanitizeInput(input),
  isValidURL: (url: string) => securityManager.isValidURL(url),
  
  // 令牌生成
  generateSecureToken: (length?: number) => securityManager.generateSecureToken(length),
  
  // 规则管理
  addSecurityRule: (rule: SecurityRule) => securityManager.addSecurityRule(rule),
  getSecurityRules: () => securityManager.getSecurityRules(),
  
  // 创建新实例
  createManager: () => new SecurityManager()
};

export default securityUtils;