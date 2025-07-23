# general-method-utils

> 一个功能丰富的 JavaScript/TypeScript 工具库，提供 Cookie 操作、URL 处理、设备检测、HTTP 请求等常用功能。

[![npm version](https://badge.fury.io/js/general-method-utils.svg)](https://badge.fury.io/js/general-method-utils)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Mr6pets/General-method-encapsulation/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/general-method-utils.svg)](https://www.npmjs.com/package/general-method-utils)

## ✨ 特性

- 🚀 **模块化设计** - 支持按需导入，减少包体积
- 📦 **多格式支持** - 支持 ES6 模块、CommonJS 和 UMD
- 🔧 **TypeScript 支持** - 完整的类型定义
- 📱 **移动端友好** - 针对移动端优化
- 🌐 **浏览器兼容** - 支持现代浏览器

## 📦 安装

```bash
npm install general-method-utils
# 或
yarn add general-method-utils
# 或
pnpm add general-method-utils
```

## 🚀 快速开始

### ES6 模块
```javascript
// 导入所有方法
import utils from 'general-method-utils';

// 按需导入
import { setCookie, getCookie, getDeviceType, request } from 'general-method-utils';

// 使用示例
setCookie('username', 'john', { days: 7 });
const username = getCookie('username');
const deviceType = getDeviceType(); // 'mobile' | 'tablet' | 'desktop'
```

### CommonJS
```javascript
const utils = require('general-method-utils');
const { setCookie, getCookie } = require('general-method-utils');
```

### TypeScript
```typescript
import { setCookie, CookieOptions } from 'general-method-utils';

const options: CookieOptions = {
  days: 7,
  secure: true,
  sameSite: 'Strict'
};
setCookie('token', 'abc123', options);
```

## 🛠️ 主要功能

| 模块 | 功能 | 示例 |
|------|------|------|
| 🍪 **Cookie** | Cookie 操作 | `setCookie()`, `getCookie()` |
| 🔗 **URL** | URL 参数处理 | `getQueryString()`, `parseUrlParams()` |
| 📱 **Device** | 设备检测 | `getDeviceType()`, `isMobile()` |
| 🌐 **Request** | HTTP 请求 | `get()`, `post()`, `put()`, `del()` |
| 📁 **Upload** | 文件上传 | `uploadFile()`, `compressImage()` |
| ✅ **Validate** | 表单验证 | `isEmail()`, `isPhone()`, `checkPasswordStrength()` |
| 🔤 **String** | 字符串处理 | `toCamelCase()`, `truncate()`, `template()` |
| 📅 **Date** | 日期时间 | `formatDate()`, `timeAgo()`, `addDays()` |
| 🔢 **Number** | 数字处理 | `formatNumber()`, `formatCurrency()` |
| 💾 **Storage** | 本地存储 | `setStorage()`, `getStorage()` (支持过期时间) |
| 🎨 **DOM** | DOM 操作 | `$()`, `addClass()`, `on()` |
| 🖼️ **Image** | 图片处理 | `loadImage()`, `cropImage()`, `addWatermark()` |
| ⚡ **Performance** | 性能工具 | `debounce()`, `throttle()`, `startTimer()` |
| 🛠️ **Utils** | 通用工具 | `generateUUID()`, `copyToClipboard()`, `sleep()` |

## 📖 完整文档

### 中文文档
- 📚 **[完整中文文档](./docs/README.full.md)** - 详细的 API 说明和使用示例
- 🌐 **[在线中文文档](https://mr6pets.github.io/GeneralMethodsUtils/zh/)**

### English Documentation
- 📚 **[Full English Documentation](./docs/README.en.md)** - Detailed API reference and examples
- 🌐 **[Online English Documentation](https://mr6pets.github.io/GeneralMethodsUtils/en/)**

### 其他资源
- 📝 **[更新日志](./CHANGELOG.md)**
- 🐛 **[问题反馈](https://github.com/Mr6pets/GeneralMethodsUtils/issues)**
- 💡 **[功能建议](https://github.com/Mr6pets/GeneralMethodsUtils/discussions)**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](https://github.com/Mr6pets/GeneralMethodsUtils/blob/main/LICENSE) © 2025