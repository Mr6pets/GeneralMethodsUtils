# GeneralMethodUtils

> 一个功能丰富的 JavaScript 工具库，提供 Cookie 操作、URL 处理、设备检测、HTTP 请求、文件上传、Promise 工具、社交分享等常用功能。

[![npm version](https://badge.fury.io/js/general-method-utils.svg)](https://badge.fury.io/js/general-method-utils)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Mr6pets/General-method-encapsulation/blob/main/LICENSE)

## 特性

- 🚀 模块化设计，支持按需导入
- 📦 支持 ES6 模块和 CommonJS
- 🔧 TypeScript 支持
- 📱 移动端友好
- 🌐 浏览器兼容性良好

## 安装

```
npm install general-method-utils

yarn add general-method-utils

pnpm add general-method-utils

```

## 🚀 快速开始

### ES6 模块导入
```
// 导入所有方法
import utils from 'general-method-utils';

// 按需导入特定方法
import { 
  setCookie, 
  getCookie, 
  getDeviceType,
  request,
  uploadFile 
} from 'general-method-utils';

// 导入特定模块
import { 
  cookieUtils, 
  deviceUtils, 
  requestUtils 
} from 'general-method-utils';

```
### CommonJS 导入
```
// 导入所有方法
const utils = require('general-method-utils');

// 按需导入
const { setCookie, getCookie } = require('general-method-utils');

```
### 浏览器直接引入
```
<script src="https://unpkg.com/general-method-utils/dist/index.umd.js"></script>
<script>
  // 使用全局变量 GeneralUtils
  GeneralUtils.setCookie('username', 'john');
  console.log(GeneralUtils.getCookie('username'));
</script>

```
## 📚 API 文档
### ### 🍪 Cookie 工具 (cookieUtils) setCookie(name, value, options)

设置 Cookie，支持完整的配置选项。

```
import { setCookie } from 'general-method-utils';

// 基础用法
setCookie('username', 'john');

// 完整配置
setCookie('token', 'abc123', {
  days: 7,
  path: '/',
  domain: '.example.com',
  secure: true,
  sameSite: 'Strict'
});

// 兼容旧版本（第三个参数为天数）
setCookie('oldStyle', 'value', 30);

```
### 🔗 URL 工具 (urlUtils) getQueryString(name, url)
获取 URL 参数。
 parseUrlParams(url)
解析 URL 参数为对象。
 buildQueryString(params)
构建查询字符串。
 updateUrlParams(params, url)
更新 URL 参数。
 removeUrlParams(keys, url)
移除 URL 参数。
 getBaseUrl(url)
获取基础 URL。

### 📱 设备检测 (deviceUtils) getDeviceType()
检测设备类型。
 isMobile()
检测是否为移动设备。
 isWeChat() / isAlipay() / isQQ()
检测特定应用浏览器。
 getBrowserInfo()
获取浏览器信息。
 getOS()
获取操作系统。
 isTouchDevice()
检测是否支持触摸。

### 🌐 HTTP 请求 (requestUtils) request(url, options)
基础请求方法。
 get(url, params, options)
GET 请求。
 post(url, data, options)
POST 请求。
 put(url, data, options) / del(url, options)
PUT 和 DELETE 请求。

### 📁 文件上传 (uploadUtils) uploadFile(url, files, options)
文件上传。
 compressImage(file, options)
图片压缩。
 validateFileType(file, allowedTypes)
文件类型验证。
 validateFileSize(file, maxSize)
文件大小验证。

### ⚡ Promise 工具 (promiseUtils) delay(ms)
延迟执行。
 withTimeout(promise, timeout)
超时控制。
 retry(fn, retries, delay)
重试机制。
 concurrentLimit(tasks, limit)
并发控制。
 memoizePromise(fn, ttl)
缓存 Promise 结果。

### 📤 社交分享 (shareUtils) shareToQQ(options)
分享到 QQ。
 shareToQZone(options)
分享到 QQ 空间。
 shareToWeibo(options)
分享到新浪微博。











## 完善项目文档
我看到你已经创建了所有必要的模块文件！现在让我们更新 README.md 文档，使其更加规范和完整：

## 🚀 快速开始
### ES6 模块导入
### CommonJS 导入
### 浏览器直接引入
## 📚 API 文档
### 🍪 Cookie 工具 (cookieUtils) setCookie(name, value, options)
设置 Cookie，支持完整的配置选项。

参数：

- name (string): Cookie 名称
- value (string): Cookie 值
- options (object|number): 配置对象或过期天数
  - days (number): 过期天数，默认 30
  - path (string): 路径，默认 '/'
  - domain (string): 域名
  - secure (boolean): 是否仅 HTTPS
  - sameSite (string): SameSite 策略 getCookie(key)
获取 Cookie 值。
 removeCookie(name, options)
删除 Cookie。
 getAllCookies()
获取所有 Cookie。
 hasCookie(name)
检查 Cookie 是否存在。

### 🔗 URL 工具 (urlUtils) getQueryString(name, url)
获取 URL 参数。
 parseUrlParams(url)
解析 URL 参数为对象。
 buildQueryString(params)
构建查询字符串。
 updateUrlParams(params, url)
更新 URL 参数。
 removeUrlParams(keys, url)
移除 URL 参数。
 getBaseUrl(url)
获取基础 URL。

### 📱 设备检测 (deviceUtils) getDeviceType()
检测设备类型。
 isMobile()
检测是否为移动设备。
 isWeChat() / isAlipay() / isQQ()
检测特定应用浏览器。
 getBrowserInfo()
获取浏览器信息。
 getOS()
获取操作系统。
 isTouchDevice()
检测是否支持触摸。

### 🌐 HTTP 请求 (requestUtils) request(url, options)
基础请求方法。
 get(url, params, options)
GET 请求。
 post(url, data, options)
POST 请求。
 put(url, data, options) / del(url, options)
PUT 和 DELETE 请求。

### 📁 文件上传 (uploadUtils) uploadFile(url, files, options)
文件上传。
 compressImage(file, options)
图片压缩。
 validateFileType(file, allowedTypes)
文件类型验证。
 validateFileSize(file, maxSize)
文件大小验证。

### ⚡ Promise 工具 (promiseUtils) delay(ms)
延迟执行。
 withTimeout(promise, timeout)
超时控制。
 retry(fn, retries, delay)
重试机制。
 concurrentLimit(tasks, limit)
并发控制。
 memoizePromise(fn, ttl)
缓存 Promise 结果。

### 📤 社交分享 (shareUtils) shareToQQ(options)
分享到 QQ。
 shareToQZone(options)
分享到 QQ 空间。
 shareToWeibo(options)
分享到新浪微博。

## 🔧 完整示例
```
import { 
  setCookie, 
  getCookie, 
  getDeviceType, 
  isMobile, 
  getQueryString,
  post,
  uploadFile,
  delay,
  shareToQQ 
} from 'general-method-utils';

// 用户登录示例
async function handleLogin(username, 
password) {
  try {
    // 发送登录请求
    const result = await post('/api/
    login', {
      username,
      password,
      deviceType: getDeviceType()
    });
    
    // 保存登录状态
    setCookie('token', result.token, { 
    days: 7 });
    setCookie('user', JSON.stringify
    (result.user));
    
    return result;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 文件上传示例
async function handleFileUpload(file) {
  // 验证文件
  if (!validateFileType(file, ['.jpg', 
  '.png', '.gif'])) {
    throw new Error('请选择图片文件');
  }
  
  if (!validateFileSize(file, 5 * 1024 
  * 1024)) {
    throw new Error('文件大小不能超过 
    5MB');
  }
  
  // 压缩图片
  const compressedFile = await 
  compressImage(file, {
    quality: 0.8,
    maxWidth: 1920
  });
  
  // 上传文件
  const result = await uploadFile('/api/
  upload', compressedFile, {
    onProgress: (percent) => {
      console.log(`上传进度: ${percent}
      %`);
    }
  });
  
  return result;
}

// 移动端适配示例
function initApp() {
  const deviceType = getDeviceType();
  
  if (isMobile()) {
    // 移动端特殊处理
    document.body.classList.add
    ('mobile');
    
    if (isWeChat()) {
      // 微信浏览器特殊处理
      initWeChatShare();
    }
  }
  
  // 获取 URL 参数
  const userId = getQueryString
  ('userId');
  if (userId) {
    loadUserData(userId);
  }
}

// 分享功能示例
function handleShare() {
  const shareData = {
    title: document.title,
    url: window.location.href,
    pic: document.querySelector('meta
    [property="og:image"]')?.content,
    desc: document.querySelector('meta
    [name="description"]')?.content
  };
  
  shareToQQ(shareData);
}

// 初始化应用
initApp();
```
## 📋 开发指南
### 构建项目
```
npm run build
```
### 开发模式
```
npm run dev
```
### 代码检查
```
npm run lint
```
### 代码格式化
```
npm run format
```
### 运行测试
```
npm test
```

## 🌍 浏览器兼容性
浏览器 版本 Chrome >= 60 Firefox >= 60 Safari >= 12 Edge >= 79 IE >= 11 (部分功能)

## 📦 包大小
- 完整包: ~15KB (gzipped)
- 按需导入: 根据使用的模块而定
## 🤝 贡献指南
欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 ( git checkout -b feature/AmazingFeature )
3. 提交更改 ( git commit -m 'Add some AmazingFeature' )
4. 推送到分支 ( git push origin feature/AmazingFeature )
5. 打开 Pull Request
## 📄 许可证
MIT License

## 🙏 致谢
感谢所有贡献者的支持！

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！








