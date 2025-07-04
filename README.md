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
### 🍪 Cookie 工具 (cookieUtils) setCookie(name, value, options)

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
getCookie(key)
获取 Cookie 值。

```
const username = getCookie('username');
console.log(username); // 'john' 或 null
```

removeCookie(name, options)
删除 Cookie。

```
removeCookie('username');
// 删除特定域名下的 Cookie
removeCookie('token', { domain: '.
example.com' });
```
getAllCookies()
获取所有 Cookie。

```
const allCookies = getAllCookies();
console.log(allCookies); // { username: 
'john', token: 'abc123' }
``` hasCookie(name)
检查 Cookie 是否存在。

```
if (hasCookie('username')) {
  console.log('用户已登录');
}
```

### 🔗 URL 工具 (urlUtils)
getQueryString(name, url)

获取 URL 参数。
 parseUrlParams(url)
解析 URL 参数为对象。
 buildQueryString(params)
构建查询字符串。
 updateUrlParams(params, url)
更新 URL 参数。
 removeUrlParams(keys, url)
移除 URL 参数。

```
// 移除单个参数
const url1 = removeUrlParams('temp');

// 移除多个参数
const url2 = removeUrlParams(['temp', 
'debug']);
``` getBaseUrl(url)
获取基础 URL。

```
const baseUrl = getBaseUrl('https://
example.com/path?query=1#hash');
console.log(baseUrl); // 'https://
example.com/path'
```

### 📱 设备检测 (deviceUtils) 
getDeviceType()
检测设备类型。
 isMobile()
检测是否为移动设备。
 isWeChat() / isAlipay() / isQQ()
检测特定应用浏览器。
 getBrowserInfo()
获取浏览器信息。

```
const browser = getBrowserInfo();
console.log(browser); // { name: 
'chrome', version: '91' }
``` getOS()
获取操作系统。

```
const os = getOS();
console.log(os); // 'Windows' | 
'macOS' | 'Linux' | 'Android' | 'iOS'
``` isTouchDevice()
检测是否支持触摸。

```
if (isTouchDevice()) {
  console.log('支持触摸操作');
}
```

### 🌐 HTTP 请求 (requestUtils) 
request(url, options)
基础请求方法。
 get(url, params, options)
GET 请求。
 post(url, data, options)
POST 请求。

```
const result = await post('/api/users', 
{
  name: 'John',
  email: 'john@example.com'
});
``` put(url, data, options) / del(url, options)
PUT 和 DELETE 请求。

```
// 更新用户
const updated = await put('/api/users/
1', { name: 'Jane' });

// 删除用户
const deleted = await del('/api/users/
1');
```

### 📁 文件上传 (uploadUtils) 
uploadFile(url, files, options)
文件上传。
 compressImage(file, options)
图片压缩。
 validateFileType(file, allowedTypes)
文件类型验证。

```
const isValid = validateFileType(file, 
['.jpg', '.png', 'image/']);
if (!isValid) {
  alert('请选择图片文件');
}
``` validateFileSize(file, maxSize)
文件大小验证。

```
const maxSize = 5 * 1024 * 1024; // 5MB
if (!validateFileSize(file, maxSize)) {
  alert('文件大小不能超过 5MB');
}
```

### ⚡ Promise 工具 (promiseUtils) 
delay(ms)
延迟执行。
 withTimeout(promise, timeout)
超时控制。
 retry(fn, retries, delay)
重试机制。
 concurrentLimit(tasks, limit)
并发控制。
 memoizePromise(fn, ttl)
缓存 Promise 结果。

```
const cachedFetch = memoizePromise(
  (url) => fetch(url).then(r => r.json
  ()),
  60000 // 缓存1分钟
);

const data1 = await cachedFetch('/api/
data'); // 发起请求
const data2 = await cachedFetch('/api/
data'); // 使用缓存
```

### 📤 社交分享 (shareUtils) 
shareToQQ(options)
分享到 QQ。
 shareToQZone(options)
分享到 QQ 空间。

```
shareToQZone({
  title: '精彩内容',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});
``` shareToWeibo(options)
分享到新浪微博。

```
shareToWeibo({
  title: '精彩内容 #话题#',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});
```
🗃️ 数据处理 (dataUtils)
deepClone(obj)
深拷贝对象。

javascript

const original = { a: 1, b: { c: 2 } };const cloned = deepClone(original);cloned.b.c = 3;console.log(original.b.c); // 2 (原对象未被修改)
uniqueArray(arr, key)
数组去重。

javascript

// 基础去重const unique1 = uniqueArray([1, 2, 2, 3]); // [1, 2, 3]// 对象数组去重const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }];const unique2 = uniqueArray(users, 'id'); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
mergeObjects(...objects)
深度合并对象。

javascript

const obj1 = { a: 1, b: { c: 2 } };const obj2 = { b: { d: 3 }, e: 4 };const merged = mergeObjects(obj1, obj2);// { a: 1, b: { c: 2, d: 3 }, e: 4 }
getType(value)
获取数据类型。

javascript

getType([]); // 'array'getType({}); // 'object'getType(null); // 'null'getType(new Date()); // 'date'
groupBy(array, key)
数组分组。

javascript

const users = [  { name: 'John', age: 25 },  { name: 'Jane', age: 25 },  { name: 'Bob', age: 30 }];const grouped = groupBy(users, 'age');// { 25: [{ name: 'John', age: 25 }, { name: 'Jane', age: 25 }], 30: [{ name: 'Bob', age: 30 }] }
flatten(arr, depth)
数组扁平化。

javascript

const nested = [1, [2, [3, [4]]]];const flat1 = flatten(nested, 1); // [1, 2, [3, [4]]]const flat2 = flatten(nested, 2); // [1, 2, 3, [4]]
🔤 字符串处理 (stringUtils)
toCamelCase(str) / toKebabCase(str) / toSnakeCase(str)
字符串命名转换。

javascript

toCamelCase('hello-world'); // 'helloWorld'toKebabCase('helloWorld'); // 'hello-world'toSnakeCase('helloWorld'); // 'hello_world'
truncate(str, length, suffix)
字符串截取。

javascript

truncate('这是一个很长的字符串', 10, '...'); // '这是一个很长的字符...'
template(str, data)
模板字符串替换。

javascript

const result = template('Hello {{name}}, you are {{age}} years old', {  name: 'John',  age: 25});// 'Hello John, you are 25 years old'
randomString(length, chars)
生成随机字符串。

javascript

const random1 = randomString(8); // 'aB3dE7fG'const random2 = randomString(6, '0123456789'); // '123456'
encode(str) / decode(str)
简单编码解码。

javascript

const encoded = encode('Hello World'); // 'SGVsbG8gV29ybGQ='const decoded = decode(encoded); // 'Hello World'
📅 日期时间 (dateUtils)
formatDate(date, format)
日期格式化。

javascript

formatDate(new Date(), 'YYYY-MM-DD'); // '2023-12-25'formatDate(new Date(), 'YYYY年MM月DD日 HH:mm:ss'); // '2023年12月25日 14:30:00'
timeAgo(date)
相对时间。

javascript

timeAgo(new Date(Date.now() - 60000)); // '1分钟前'timeAgo(new Date(Date.now() - 3600000)); // '1小时前'
addDays(date, days)
日期计算。

javascript

const tomorrow = addDays(new Date(), 1);const lastWeek = addDays(new Date(), -7);
diffDays(date1, date2)
计算日期差。

javascript

const days = diffDays('2023-01-01', '2023-01-10'); // 9
isWorkday(date) / getWorkdays(startDate, endDate)
工作日相关。

javascript

if (isWorkday(new Date())) {  console.log('今天是工作日');}const workdays = getWorkdays('2023-01-01', '2023-01-31');console.log(`一月有 ${workdays.length} 个工作日`);
🔢 数字处理 (numberUtils)
formatNumber(num, decimals)
数字格式化。

javascript

formatNumber(1234567.89); // '1,234,567.89'formatNumber(1234567.89, 0); // '1,234,568'
formatCurrency(amount, currency)
货币格式化。

javascript

formatCurrency(1234.56); // '¥1,234.56'formatCurrency(1234.56, '$'); // '$1,234.56'
formatFileSize(bytes)
文件大小格式化。

javascript

formatFileSize(1024); // '1.00 KB'formatFileSize(1048576); // '1.00 MB'formatFileSize(1073741824); // '1.00 GB'
toChineseNumber(num)
数字转中文。

javascript

toChineseNumber(123); // '一百二十三'toChineseNumber(1000); // '一千'
random(min, max) / clamp(value, min, max) / lerp(start, end, factor)
数学工具。

javascript

const randomNum = random(1, 100); // 1-100 的随机整数const clamped = clamp(150, 0, 100); // 100 (限制在 0-100 范围内)const interpolated = lerp(0, 100, 0.5); // 50 (0 和 100 的中间值)
💾 本地存储 (storageUtils)
setStorage(key, value, expire) / getStorage(key)
带过期时间的 localStorage。

javascript

// 设置 1 小时后过期的数据setStorage('user', { name: 'John' }, 3600000);// 获取数据（过期自动删除）const user = getStorage('user');
removeStorage(key) / clearStorage()
删除和清空存储。

javascript

removeStorage('user');clearStorage(); // 清空所有 localStorage
setSession(key, value) / getSession(key)
sessionStorage 操作。

javascript

setSession('tempData', { id: 123 });const tempData = getSession('tempData');
🎨 DOM 操作 (domUtils)
$(selector) / $$(selector)
元素选择。

javascript

const button = $('.btn'); // 单个元素const buttons = $$('.btn'); // 元素列表
addClass(el, className) / removeClass(el, className) / toggleClass(el, className)
类名操作。

javascript

addClass($('.btn'), 'active');removeClass($('.btn'), 'disabled');toggleClass($('.btn'), 'selected');
on(el, event, handler) / off(el, event, handler) / once(el, event, handler)
事件处理。

javascript

const button = $('.btn');const clickHandler = () => console.log('clicked');on(button, 'click', clickHandler);once(button, 'click', () => console.log('只执行一次'));off(button, 'click', clickHandler);
show(el) / hide(el) / toggle(el)
显示隐藏。

javascript

show($('.modal'));hide($('.loading'));toggle($('.sidebar'));
getOffset(el) / scrollTo(target, options)
位置和滚动。

javascript

const offset = getOffset($('.header'));console.log(offset); // { top: 0, left: 0, width: 1200, height: 60 }scrollTo('.section', { behavior: 'smooth' });
✅ 表单验证 (validateUtils)
isEmail(email) / isPhone(phone) / isIdCard(idCard)
常用验证。

javascript

isEmail('test@example.com'); // trueisPhone('13800138000'); // trueisIdCard('110101199001011234'); // true
isCreditCard(cardNumber) / isUrl(url) / isIP(ip)
其他验证。

javascript

isCreditCard('4111111111111111'); // trueisUrl('https://example.com'); // trueisIP('192.168.1.1'); // true
checkPasswordStrength(password)
密码强度检查。

javascript

const result = checkPasswordStrength('MyPassword123!');console.log(result);// {//   score: 5,//   level: 'strong',//   checks: { length: true, lowercase: true, uppercase: true, number: true, special: true },//   suggestions: []// }
createValidator(rules)
创建表单验证器。

javascript

const validator = createValidator({  email: {    required: true,    validator: isEmail,    message: '请输入有效的邮箱地址'  },  password: {    required: true,    validator: (value) => value.length     >= 8,    message: '密码长度至少8位'  }});const result = validator({ email: 'test@example.com', password: '123' });console.log(result);// { isValid: false, errors: { password: '密码长度至少8位' } }
🖼️ 图片处理 (imageUtils)
loadImage(src)
图片加载。

javascript

try {  const img = await loadImage('/path/to/  image.jpg');  console.log('图片加载成功', img.width,   img.height);} catch (error) {  console.log('图片加载失败');}
previewImage(file)
图片预览。

javascript

const file = event.target.files[0];const previewUrl = await previewImage(file);document.getElementById('preview').src = previewUrl;
cropImage(source, options)
图片裁剪。

javascript

const croppedBlob = await cropImage(file, {  x: 0,  y: 0,  width: 200,  height: 200,  quality: 0.9});
addWatermark(image, watermark, options)
添加水印。

javascript

const watermarkedUrl = await addWatermark(img, '© 2023 Company', {  position: 'bottom-right',  fontSize: 16,  color: 'rgba(255, 255, 255, 0.8)'});
imageToBase64(file) / base64ToBlob(base64)
格式转换。

javascript

const base64 = await imageToBase64(file);const blob = base64ToBlob(base64);
getImageInfo(source)
获取图片信息。

javascript

const info = await getImageInfo(file);console.log(info);// { width: 1920, height: 1080, ratio: 1.78, size: 204800, type: 'image/jpeg' }
⚡ 性能监控 (performanceUtils)
startTimer(name) / endTimer(name)
性能计时。

javascript

startTimer('api-request');await fetch('/api/data');const duration = endTimer('api-request'); // 输出: api-request: 245.67ms
debounce(fn, delay) / throttle(fn, delay)
防抖和节流。

javascript

const debouncedSearch = debounce((query) => {  console.log('搜索:', query);}, 300);const throttledScroll = throttle(() => {  console.log('滚动事件');}, 100);window.addEventListener('scroll', throttledScroll);
getMemoryUsage()
内存使用情况。

javascript

const memory = getMemoryUsage();if (memory) {  console.log(`内存使用: ${memory.used}  MB / ${memory.total}MB`);}
startFPSMonitor(callback)
FPS 监控。

javascript

const stopMonitor = startFPSMonitor((fps) => {  console.log(`当前 FPS: ${fps}`);  if (fps < 30) {    console.warn('性能较低');  }});// 停止监控// stopMonitor();
getPagePerformance()
页面性能指标。

javascript

const perf = getPagePerformance();console.log('页面加载性能:', perf);// { dns: 2, tcp: 1, request: 245, response: 123, domParse: 456, resourceLoad: 789, total: 1616 }
observeLongTasks(callback)
长任务监控。

javascript

const observer = observeLongTasks((task) => {  console.warn('检测到长任务:', task);  // { name: 'self', duration: 67.5,   startTime: 1234567890 }});
🛠️ 通用工具 (utils)
generateUUID()
生成 UUID。

javascript

const id = generateUUID(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
hexToRgb(hex) / rgbToHex(r, g, b)
颜色转换。

javascript

const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }const hex = rgbToHex(255, 0, 0); // '#ff0000'
downloadFile(url, filename)
下载文件。

javascript

downloadFile('/api/export/data.xlsx', '数据导出.xlsx');
readFileAsText(file)
读取文件内容。

javascript

const content = await readFileAsText(file);console.log('文件内容:', content);
copyToClipboard(text) / readFromClipboard()
剪贴板操作。

javascript

const success = await copyToClipboard('要复制的文本');if (success) {  console.log('复制成功');}const clipboardText = await readFromClipboard();console.log('剪贴板内容:', clipboardText);
requestFullscreen(element) / exitFullscreen() / isFullscreen()
全屏操作。

javascript

requestFullscreen(); // 全屏显示页面requestFullscreen($('.video')); // 全屏显示视频元素if (isFullscreen()) {  exitFullscreen();}
sleep(ms)
睡眠函数。

javascript

console.log('开始');await sleep(2000);console.log('2秒后执行');

## 🔧 完整示例
```
import { 
  setCookie, 
  getCookie, 
  getDeviceType, 
  isMobile, 
  getQueryString,
  post,
  uploadFile,
  delay,
  shareToQQ,
  deepClone,
  formatDate,
  formatCurrency,
  setStorage,
  getStorage,
  validateUtils,
  debounce
} from 'general-method-utils';

// 用户登录示例
async function handleLogin(username, password) {
  try {
    // 发送登录请求
    const result = await post('/api/login', {
      username,
      password,
      deviceType: getDeviceType()
    });
    
    // 保存登录状态（7天过期）
    setStorage('token', result.token, 7 * 24 * 60 * 60 * 1000);
    setStorage('user', result.user, 7 * 24 * 60 * 60 * 1000);
    
    return result;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 文件上传示例
async function handleFileUpload(file) {
  // 验证文件
  if (!validateUtils.validateFileType(file, ['.jpg', '.png', '.gif'])) {
    throw new Error('请选择图片文件');
  }
  
  if (!validateUtils.validateFileSize(file, 5 * 1024 * 1024)) {
    throw new Error('文件大小不能超过 5MB');
  }
  
  // 压缩图片
  const compressedFile = await compressImage(file, {
    quality: 0.8,
    maxWidth: 1920
  });
  
  // 上传文件
  const result = await uploadFile('/api/upload', compressedFile, {
    onProgress: (percent) => {
      console.log(`上传进度: ${percent}%`);
    }
  });
  
  return result;
}

// 移动端适配示例
function initApp() {
  const deviceType = getDeviceType();
  
  if (isMobile()) {
    // 移动端特殊处理
    document.body.classList.add('mobile');
    
    if (isWeChat()) {
      // 微信浏览器特殊处理
      initWeChatShare();
    }
  }
  
  // 获取 URL 参数
  const userId = getQueryString('userId');
  if (userId) {
    loadUserData(userId);
  }
  
  // 检查登录状态
  const token = getStorage('token');
  if (token) {
    const user = getStorage('user');
    console.log('用户已登录:', user);
  }
}

// 搜索防抖示例
const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) return;
  
  try {
    const results = await get('/api/search', { q: query });
    displaySearchResults(results);
  } catch (error) {
    console.error('搜索失败:', error);
  }
}, 300);

// 数据处理示例
function processUserData(users) {
  // 深拷贝避免修改原数据
  const processedUsers = deepClone(users);
  
  // 按年龄分组
  const groupedByAge = groupBy(processedUsers, 'age');
  
  // 格式化数据
  return processedUsers.map(user => ({
    ...user,
    formattedJoinDate: formatDate(user.joinDate, 'YYYY年MM月DD日'),
    formattedSalary: formatCurrency(user.salary)
  }));
}

// 表单验证示例
const userValidator = validateUtils.createValidator({
  email: {
    required: true,
    validator: validateUtils.isEmail,
    message: '请输入有效的邮箱地址'
  },
  phone: {
    required: true,
    validator: validateUtils.isPhone,
    message: '请输入有效的手机号'
  },
  password: {
    required: true,
    validator: (value) => {
      const strength = validateUtils.checkPasswordStrength(value);
      return strength.level !== 'weak';
    },
    message: '密码强度太弱'
  }
});

function validateForm(formData) {
  const result = userValidator(formData);
  if (!result.isValid) {
    console.log('验证失败:', result.errors);
    return false;
  }
  return true;
}

// 分享功能示例
function handleShare() {
  const shareData = {
    title: document.title,
    url: window.location.href,
    pic: document.querySelector('meta[property="og:image"]')?.content,
    desc: document.querySelector('meta[name="description"]')?.content
  };
  
  shareToQQ(shareData);
}

// 初始化应用
initApp();
```

## 🌍 浏览器兼容性
浏览器 版本 Chrome >= 60 Firefox >= 60 Safari >= 12 Edge >= 79 IE >= 11 (部分功能)
|--|--|
| 浏览器 | 版本 |
| Chrome | >= 60 |
| Firefox | >= 60 |
| Safari | >= 12 |
| Edge | >= 79 |
| IE | >= 11 (部分功能) |


## 📦 包大小
- 完整包: ~25KB (gzipped)
- 按需导入: 根据使用的模块而定
- 单个模块: 1-3KB (gzipped)

## 🚀 性能优化
- 所有模块支持 Tree Shaking
- 按需加载，减少包体积
- 内置缓存机制，提升性能
- 防抖节流等性能优化工具

## 🤝 贡献指南
欢迎提交 Issue 和 Pull Request！

- Fork 本仓库
- 创建特性分支 ( git checkout -b feature/AmazingFeature )
- 提交更改 ( git commit -m 'Add some AmazingFeature' )
- 推送到分支 ( git push origin feature/AmazingFeature )
- 打开 Pull Request

## 📄 许可证
MIT License

## 🙏 致谢
感谢所有贡献者的支持！








