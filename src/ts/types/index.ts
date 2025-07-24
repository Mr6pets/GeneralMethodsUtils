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


// 国际化相关类型
export interface I18nOptions {
  locale?: string;
  currency?: string;
  timeZone?: string;
}

export interface NumberFormatOptions {
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZone?: string;
}

// 加密相关类型
export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface CryptoOptions {
  algorithm?: HashAlgorithm;
  encoding?: 'hex' | 'base64';
}

// 动画相关类型
export interface AnimationOptions {
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  onComplete?: () => void;
}

export interface TransitionOptions extends AnimationOptions {
  from?: number;
  to?: number;
}

// 地理位置相关类型
export interface Position {
  latitude: number;
  longitude: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface DistanceOptions {
  unit?: 'km' | 'miles' | 'meters';
}

// 表单相关类型
export interface FormData {
  [key: string]: string | number | boolean | File;
}

export interface FormValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  validator?: (value: any) => boolean | string;
}

export interface FormValidationRules {
  [fieldName: string]: FormValidationRule;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

export interface AutoSaveOptions {
  key: string;
  interval?: number;
  storage?: 'localStorage' | 'sessionStorage';
}

// PWA 相关类型
export interface ServiceWorkerOptions {
  scope?: string;
  updateViaCache?: 'imports' | 'all' | 'none';
}

export interface CacheOptions {
  cacheName?: string;
  maxAge?: number;
  maxEntries?: number;
  strategy?: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate';
}

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface InstallPromptOptions {
  deferredPrompt?: any;
  onAccept?: () => void;
  onDecline?: () => void;
}

export interface PWAUpdateOptions {
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
  onUpdateReady?: () => void;
  skipWaiting?: boolean;
}

// 高级数据处理类型
export interface DataTransformOptions {
  keyMapping?: Record<string, string>;
  valueTransforms?: Record<string, (value: any) => any>;
  removeEmpty?: boolean;
  flattenArrays?: boolean;
}

export interface CompressionOptions {
  algorithm?: 'gzip' | 'deflate' | 'lz4';
  level?: number;
}

export interface ExportOptions {
  format?: 'json' | 'csv' | 'xml' | 'excel';
  filename?: string;
  headers?: string[];
  delimiter?: string;
}

export interface ImportOptions {
  format?: 'json' | 'csv' | 'xml';
  delimiter?: string;
  headers?: boolean;
  encoding?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
  type?: 'string' | 'number' | 'date';
}

export interface FilterOptions {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface GroupOptions {
  field: string;
  aggregations?: {
    count?: boolean;
    sum?: string[];
    avg?: string[];
    min?: string[];
    max?: string[];
  };
}

// 高级性能监控类型
export interface AdvancedPerformanceMetrics {
  // 核心 Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  
  // 自定义指标
  customMetrics?: Record<string, number>;
  
  // 资源加载
  resourceTiming?: PerformanceResourceTiming[];
  
  // 内存使用
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  
  // 网络信息
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export interface UserBehaviorEvent {
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'custom';
  target?: string;
  timestamp: number;
  data?: any;
  sessionId: string;
  userId?: string;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  customData?: any;
}

export interface PerformanceObserverOptions {
  entryTypes: string[];
  buffered?: boolean;
  callback: (entries: PerformanceEntry[]) => void;
}

export interface FPSMonitorOptions {
  sampleRate?: number;
  threshold?: number;
  onLowFPS?: (fps: number) => void;
}

export interface LongTaskOptions {
  threshold?: number;
  onLongTask?: (task: PerformanceEntry) => void;
}

export interface MemoryMonitorOptions {
  interval?: number;
  threshold?: number;
  onHighMemory?: (usage: any) => void;
}

// WebRTC 相关类型
export interface WebRTCOptions {
  iceServers?: RTCIceServer[];
  dataChannelOptions?: RTCDataChannelInit;
  mediaConstraints?: MediaStreamConstraints;
}

export interface WebRTCConnection {
  id: string;
  pc: RTCPeerConnection;
  dataChannels: Map<string, RTCDataChannel>;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  createdAt: number;
}

export interface WebRTCMessage {
  type: string;
  peerId: string;
  data?: any;
  timestamp: number;
}

export interface ScreenShareOptions {
  video?: MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

export interface WebRTCStats {
  bytesReceived: number;
  bytesSent: number;
  packetsReceived: number;
  packetsSent: number;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
}

// 区块链相关类型
export interface BlockchainOptions {
  defaultNetwork?: string;
  timeout?: number;
}

export interface WalletConnection {
  accounts: string[];
  network: NetworkInfo;
  provider: any;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
}

export interface TransactionOptions {
  to?: string;
  value?: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
  nonce?: number;
}

export interface ContractCallOptions {
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance?: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  status: number;
  gasUsed: string;
  logs: any[];
}

// 微前端相关类型
export interface MicrofrontendOptions {
  sandbox?: boolean;
  prefetch?: boolean;
  timeout?: number;
}

export interface AppConfig {
  name: string;
  entry: string | string[];
  container: string;
  activeRule?: string | RegExp | ((location: string) => boolean);
  props?: Record<string, any>;
}

export interface AppInfo {
  name: string;
  status: AppStatus;
  entry: string | string[];
  container: string;
  activeRule?: string | RegExp | ((location: string) => boolean);
}

export type AppStatus = 'NOT_LOADED' | 'LOADED' | 'MOUNTED' | 'UNMOUNTED' | 'LOAD_ERROR';

export interface AppLifecycle {
  bootstrap?: (props: any) => Promise<void>;
  mount?: (props: any) => Promise<void>;
  unmount?: (props: any) => Promise<void>;
  update?: (props: any) => Promise<void>;
}

export interface AppSandbox {
  name: string;
  proxy: any;
  originalWindow: Record<string, any>;
  modifiedKeys: Set<string>;
}

export interface AppResources {
  scripts: string[];
  styles: string[];
}

export interface AppMessage {
  targetApp: string;
  action: string;
  data: any;
  timestamp: number;
}

export interface GlobalStateChange {
  key: string;
  value: any;
  oldValue: any;
}

export interface BrowserSupport {
  proxy: boolean;
  customElements: boolean;
  shadowDOM: boolean;
  modules: boolean;
}

// AI/ML 集成工具相关类型
export interface AIModelOptions {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export interface ImageAnalysisOptions {
  features?: ('objects' | 'text' | 'faces' | 'landmarks' | 'colors')[];
  maxResults?: number;
  confidence?: number;
}

export interface ImageAnalysisResult {
  objects?: Array<{ name: string; confidence: number; bbox: number[] }>;
  text?: Array<{ text: string; confidence: number; bbox: number[] }>;
  faces?: Array<{ confidence: number; bbox: number[]; emotions?: Record<string, number> }>;
  landmarks?: Array<{ name: string; confidence: number; coordinates: number[] }>;
  colors?: Array<{ color: string; percentage: number }>;
}

export interface TextAnalysisOptions {
  language?: string;
  features?: ('sentiment' | 'entities' | 'keywords' | 'categories')[];
}

export interface TextAnalysisResult {
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  entities?: Array<{ text: string; type: string; confidence: number }>;
  keywords?: Array<{ text: string; relevance: number }>;
  categories?: Array<{ name: string; confidence: number }>;
}

export interface MLModelConfig {
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'nlp' | 'cv';
  inputShape?: number[];
  outputShape?: number[];
  preprocessing?: (data: any) => any;
  postprocessing?: (data: any) => any;
}

export interface PredictionResult {
  predictions: any[];
  confidence?: number[];
  probabilities?: number[][];
  processingTime: number;
}

// 高级安全工具相关类型
export interface SecurityScanOptions {
  checkXSS?: boolean;
  checkSQLInjection?: boolean;
  checkCSRF?: boolean;
  checkClickjacking?: boolean;
  customRules?: SecurityRule[];
}

export interface SecurityRule {
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface SecurityScanResult {
  isSecure: boolean;
  vulnerabilities: SecurityVulnerability[];
  score: number;
  recommendations: string[];
}

export interface SecurityVulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  recommendation: string;
}

export interface CSPOptions {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  reportUri?: string;
  upgradeInsecureRequests?: boolean;
}

export interface EncryptionOptions {
  algorithm?: 'AES-GCM' | 'AES-CBC' | 'RSA-OAEP';
  keyLength?: 128 | 192 | 256;
  iv?: Uint8Array;
  additionalData?: Uint8Array;
}

export interface EncryptionResult {
  encryptedData: ArrayBuffer;
  iv?: Uint8Array;
  authTag?: Uint8Array;
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'X-XSS-Protection'?: string;
  'Strict-Transport-Security'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
}

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: any) => string;
  onLimitReached?: (key: string) => void;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// 实时协作工具相关类型
export interface CollaborationOptions {
  serverUrl?: string;
  roomId?: string;
  userId?: string;
  userName?: string;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  cursor?: CursorPosition;
  selection?: SelectionRange;
  lastSeen: number;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
}

export interface SelectionRange {
  start: number;
  end: number;
  elementId?: string;
}

export interface CollaborationOperation {
  id: string;
  type: 'insert' | 'delete' | 'retain' | 'format';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
  userId: string;
  timestamp: number;
}

export interface OperationTransformResult {
  transformedOp: CollaborationOperation;
  transformedAgainst: CollaborationOperation;
}

export interface DocumentState {
  content: string;
  version: number;
  operations: CollaborationOperation[];
  lastModified: number;
  checksum?: string;
}

export interface ConflictResolution {
  strategy: 'last-write-wins' | 'operational-transform' | 'three-way-merge';
  resolver?: (local: any, remote: any, base?: any) => any;
}

export interface SyncOptions {
  interval?: number;
  batchSize?: number;
  conflictResolution?: ConflictResolution;
  onSync?: (state: DocumentState) => void;
  onConflict?: (conflict: any) => void;
}

export interface CollaborationEvent {
  type: 'user-join' | 'user-leave' | 'operation' | 'cursor-move' | 'selection-change' | 'sync';
  userId?: string;
  data?: any;
  timestamp: number;
}

export interface RealtimeConnection {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastPing: number;
  reconnectAttempts: number;
}

export interface PresenceInfo {
  userId: string;
  userName: string;
  status: 'online' | 'offline' | 'away';
  lastActivity: number;
  metadata?: Record<string, any>;
}