// Cookie 相关类型
export interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// 设备类型
export type DeviceType = 'android' | 'ios' | 'pc';
export type OSType = 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';

// 浏览器信息
export interface BrowserInfo {
  name: string;
  version: string;
}

// HTTP 请求配置
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  body?: string;
  signal?: AbortSignal;
}

// URL 参数类型
export type URLParams = Record<string, string | number | boolean>;

// 验证规则
export interface ValidationRule {
  required?: boolean;
  validator?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type ValidationRules = Record<string, ValidationRule>;

// 密码强度检查结果
export interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
  suggestions: string[];
}

// RGB 颜色
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// 文件上传相关
export interface UploadOptions {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  data?: Record<string, any>;
  onProgress?: (progress: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Promise 工具类型
export interface RetryOptions {
  times: number;
  delay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

// 存储相关类型
export interface StorageOptions {
  expires?: number; // 过期时间（毫秒）
  prefix?: string;  // 键名前缀
}

// 分享相关类型
export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

// 性能监控类型
export interface PerformanceMetrics {
  loadTime: number;
  domReady: number;
  firstPaint: number;
  firstContentfulPaint: number;
}

// 数据处理类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// 工具函数类型
export type Debounced<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel(): void;
};

export type Throttled<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel(): void;
};