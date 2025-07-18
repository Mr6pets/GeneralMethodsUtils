# GeneralMethodUtils

> 一个功能丰富的 JavaScript 工具库，提供 Cookie 操作、URL 处理、设备检测、HTTP 请求、文件上传、Promise 工具、社交分享等常用功能。

[![npm version](https://badge.fury.io/js/general-method-utils.svg)](https://badge.fury.io/js/general-method-utils)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Mr6pets/General-method-encapsulation/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/general-method-utils.svg)](https://www.npmjs.com/package/general-method-utils)

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
```js
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
```js
// 导入所有方法
const utils = require('general-method-utils');

// 按需导入
const { setCookie, getCookie } = require('general-method-utils');

```
### 浏览器直接引入
```js
<script src="https://unpkg.com/general-method-utils/dist/index.umd.js"></script>
<script>
  // 使用全局变量 GeneralUtils
  GeneralUtils.setCookie('username', 'john');
  console.log(GeneralUtils.getCookie('username'));
</script>

```
## 📚 API 文档
### 🍪 Cookie 工具 (cookieUtils) setCookie(name, value, options)

##### 设置 Cookie，支持完整的配置选项。

```js
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
##### getCookie(key)-获取 Cookie 值。

```js
const username = getCookie('username');
console.log(username); // 'john' 或 null
```

##### removeCookie(name, options) -删除 Cookie。

```js
removeCookie('username');
// 删除特定域名下的 Cookie
removeCookie('token', { domain: '.
example.com' });
```
##### getAllCookies()-获取所有 Cookie。

```js
const allCookies = getAllCookies();
console.log(allCookies); // { username: 'john', token: 'abc123' }

hasCookie(name)//检查 Cookie 是否存在。
if (hasCookie('username')) {
  console.log('用户已登录');
}

```
### 🔗 URL 工具 (urlUtils)

```js
getQueryString(name, url) //获取 URL 参数。
parseUrlParams(url)//解析 URL 参数为对象。
buildQueryString(params)//构建查询字符串。
updateUrlParams(params, url)//更新 URL 参数。
removeUrlParams(keys, url)//移除 URL 参数。
// 移除单个参数
const url1 = removeUrlParams('temp');
// 移除多个参数
const url2 = removeUrlParams(['temp', 
'debug']);


getBaseUrl(url)//获取基础 URL。
const baseUrl = getBaseUrl('https://example.com/path?query=1#hash');
console.log(baseUrl); // 'https://example.com/path'

```
### 📱 设备检测 (deviceUtils) 

```js
getDeviceType()//检测设备类型。
isMobile()//检测是否为移动设备。
isWeChat() / isAlipay() / isQQ() //检测特定应用浏览器。
getBrowserInfo()//获取浏览器信息。
const browser = getBrowserInfo();
console.log(browser); // { name: 'chrome', version: '91' }

获取操作系统。
const os = getOS();
console.log(os); // 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS'

检测是否支持触摸。
if (isTouchDevice()) {
  console.log('支持触摸操作');
}
```
### 🌐 HTTP 请求 (requestUtils) 

```js
request(url, options)//基础请求方法。
get(url, params, options)//GET 请求。
post(url, data, options)//POST 请求。

const result = await post('/api/users', 
{
  name: 'John',
  email: 'john@example.com'
});

PUT 和 DELETE 请求。
// 更新用户
const updated = await put('/api/users/
1', { name: 'Jane' });

// 删除用户
const deleted = await del('/api/users/
1');
```
### 📁 文件上传 (uploadUtils) 

```js
uploadFile(url, files, options)//文件上传。
compressImage(file, options)//图片压缩。
validateFileType(file, allowedTypes)//文件类型验证。

const isValid = validateFileType(file, ['.jpg', '.png', 'image/']);
if (!isValid) {
  alert('请选择图片文件');
}

文件大小验证。
const maxSize = 5 * 1024 * 1024; // 5MB
if (!validateFileSize(file, maxSize)) {
  alert('文件大小不能超过 5MB');
}
```
### ⚡ Promise 工具 (promiseUtils)

```js
delay(ms)//延迟执行。
withTimeout(promise, timeout)//超时控制。
retry(fn, retries, delay)//重试机制。
concurrentLimit(tasks, limit)//并发控制。
memoizePromise(fn, ttl)//缓存 Promise 结果。

const cachedFetch = memoizePromise(
  (url) => fetch(url).then(r => r.json()),60000 // 缓存1分钟
);
const data1 = await cachedFetch('/api/data'); // 发起请求
const data2 = await cachedFetch('/api/data'); // 使用缓存
```
### 📤 社交分享 (shareUtils) 

```js
shareToQQ(options)//分享到 QQ。
shareToQZone(options)//分享到 QQ 空间。

shareToQZone({
  title: '精彩内容',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});

分享到新浪微博。
shareToWeibo({
  title: '精彩内容 #话题#',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});
```
### 🗃️ 数据处理 (dataUtils)

```js
deepClone(obj)//深拷贝对象。
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // 2 (原对象未被修改)

uniqueArray(arr, key)//数组去重。
// 基础去重
const unique1 = uniqueArray([1, 2, 2, 3]); // [1, 2, 3]
// 对象数组去重
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }];
const unique2 = uniqueArray(users, 'id'); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

//深度合并对象
mergeObjects(...objects)
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = mergeObjects(obj1, obj2);// { a: 1, b: { c: 2, d: 3 }, e: 4 }

//获取数据类型
getType(value)
getType([]);// 'array'
getType({});// 'object'
getType(null); // 'null'
getType(new Date()); // 'date'

//数组分组
groupBy(array, key)
const users = [{ name: 'John', age: 25 },{ name: 'Jane', age: 25 },{ name: 'Bob', age: 30 }];
const grouped = groupBy(users, 'age');// { 25: [{ name: 'John', age: 25 }, { name: 'Jane', age: 25 }], 30: [{ name: 'Bob', age: 30 }] }

//数组扁平化。
flatten(arr, depth)
const nested = [1, [2, [3, [4]]]];
const flat1 = flatten(nested, 1); // [1, 2, [3, [4]]]
const flat2 = flatten(nested, 2); // [1, 2, 3, [4]]


```



### 🔤 字符串处理 (stringUtils)

~~~js
//字符串命名转换
toCamelCase(str) / toKebabCase(str) / toSnakeCase(str)
toCamelCase('hello-world'); // 'helloWorld'
toKebabCase('helloWorld');// 'hello-world'
toSnakeCase('helloWorld'); // 'hello_world'

//字符串截取
truncate(str, length, suffix)
truncate('这是一个很长的字符串', 10, '...'); // '这是一个很长的字符...'

//模板字符串替换
template(str, data)
const result = template('Hello {{name}}, you are {{age}} years old', {  name: 'John',  age: 25});// 'Hello John, you are 25 years old'

//生成随机字符串
randomString(length, chars)
const random1 = randomString(8); // 'aB3dE7fG'
const random2 = randomString(6, '0123456789'); // '123456'

//简单编码解码
encode(str) / decode(str)
const encoded = encode('Hello World'); // 'SGVsbG8gV29ybGQ='
const decoded = decode(encoded); // 'Hello World'
~~~



### 📅 日期时间 (dateUtils)

~~~js
//日期格式化
formatDate(date, format)
formatDate(new Date(), 'YYYY-MM-DD'); // '2023-12-25'
formatDate(new Date(), 'YYYY年MM月DD日 HH:mm:ss'); // '2023年12月25日 14:30:00'

//相对时间
timeAgo(date)
timeAgo(new Date(Date.now() - 60000)); // '1分钟前'
timeAgo(new Date(Date.now() - 3600000)); // '1小时前'

//日期计算
addDays(date, days)
const tomorrow = addDays(new Date(), 1);
const lastWeek = addDays(new Date(), -7);

//计算日期差
diffDays(date1, date2)
const days = diffDays('2023-01-01', '2023-01-10'); // 9

//工作日相关
isWorkday(date) / getWorkdays(startDate, endDate)
if (isWorkday(new Date())) {
    console.log('今天是工作日');
}
const workdays = getWorkdays('2023-01-01', '2023-01-31');
console.log(`一月有 ${workdays.length} 个工作日`);

~~~




### 🔢 数字处理 (numberUtils)

~~~js
//数字格式化
formatNumber(num, decimals)
formatNumber(1234567.89); // '1,234,567.89'
formatNumber(1234567.89, 0); // '1,234,568'

//货币格式化
formatCurrency(amount, currency)
formatCurrency(1234.56); // '¥1,234.56'
formatCurrency(1234.56, '$'); // '$1,234.56'

//文件大小格式化
formatFileSize(bytes)
formatFileSize(1024); // '1.00 KB'
formatFileSize(1048576); // '1.00 MB'
formatFileSize(1073741824); // '1.00 GB'

//数字转中文
toChineseNumber(num)
toChineseNumber(123); // '一百二十三'
toChineseNumber(1000); // '一千'

//数学工具
random(min, max) / clamp(value, min, max) / lerp(start, end, factor)
const randomNum = random(1, 100); // 1-100 的随机整数
const clamped = clamp(150, 0, 100); // 100 (限制在 0-100 范围内)
const interpolated = lerp(0, 100, 0.5); // 50 (0 和 100 的中间值)
~~~

### 💾 本地存储 (storageUtils)

~~~js
//带过期时间的 localStorage
setStorage(key, value, expire) / getStorage(key)
// 设置 1 小时后过期的数据s
etStorage('user', { name: 'John' }, 3600000);
// 获取数据（过期自动删除）
const user = getStorage('user');

//删除和清空存储
removeStorage(key) / clearStorage()
removeStorage('user');
clearStorage(); // 清空所有 localStorage

//sessionStorage 操作。
setSession(key, value) / getSession(key)
setSession('tempData', { id: 123 });
const tempData = getSession('tempData');
~~~

### 🎨 DOM 操作 (domUtils)

~~~js
//元素选择
$(selector) / $$(selector)
const button = $('.btn'); // 单个元素
const buttons = $$('.btn'); // 元素列表

//类名操作
addClass(el, className) / removeClass(el, className) / toggleClass(el, className)
addClass($('.btn'), 'active');
removeClass($('.btn'), 'disabled');
toggleClass($('.btn'), 'selected');

//事件处理
on(el, event, handler) / off(el, event, handler) / once(el, event, handler)
const button = $('.btn');
const clickHandler = () => console.log('clicked');
on(button, 'click', clickHandler);
once(button, 'click', () => console.log('只执行一次'));
off(button, 'click', clickHandler);

//显示隐藏
show(el) / hide(el) / toggle(el)
show($('.modal'));
hide($('.loading'));
toggle($('.sidebar'));

//位置和滚动
getOffset(el) / scrollTo(target, options)
const offset = getOffset($('.header'));
console.log(offset); // { top: 0, left: 0, width: 1200, height: 60 }scrollTo('.section', { behavior: 'smooth' });
~~~



### ✅ 表单验证 (validateUtils)

~~~js
//常用验证
isEmail(email) / isPhone(phone) / isIdCard(idCard)
isEmail('test@example.com'); // true
isPhone('13800138000'); // true
isIdCard('110101199001011234'); // true

//其他验证
isCreditCard(cardNumber) / isUrl(url) / isIP(ip)
isCreditCard('4111111111111111'); // true
isUrl('https://example.com'); // true
isIP('192.168.1.1'); // true

//密码强度检查
checkPasswordStrength(password)
const result = checkPasswordStrength('MyPassword123!');
console.log(result);// {//   score: 5,//   level: 'strong',//   checks: { length: true, lowercase: true, uppercase: true, number: true, special: true },//   suggestions: []// }

//创建表单验证器
createValidator(rules)
const validator = createValidator(
    {
    email: {    required: true,    validator: isEmail,    message: '请输入有效的邮箱地址'  },  
    password: {    required: true,    validator: (value) => value.length     >= 8,    message: '密码长度至少8位'  }
    }
);
const result = validator(
    { email: 'test@example.com', password: '123' }
);
console.log(result);// { isValid: false, errors: { password: '密码长度至少8位' } }
~~~

### 🖼️ 图片处理 (imageUtils)

~~~js
//图片加载
loadImage(src)
try {  
    const img = await loadImage('/path/to/  image.jpg');  
    console.log('图片加载成功', img.width,   img.height);} 
catch (error) {
    console.log('图片加载失败');
}

//图片预览
previewImage(file)
const file = event.target.files[0];
const previewUrl = await previewImage(file);
document.getElementById('preview').src = previewUrl;

//图片裁剪
cropImage(source, options)
const croppedBlob = await cropImage(file, {  x: 0,  y: 0,  width: 200,  height: 200,  quality: 0.9});

//添加水印。
addWatermark(image, watermark, options)
const watermarkedUrl = await addWatermark(img, '© 2023 Company', {  position: 'bottom-right',  fontSize: 16,  color: 'rgba(255, 255, 255, 0.8)'});

//格式转换
imageToBase64(file) / base64ToBlob(base64)
const base64 = await imageToBase64(file);
const blob = base64ToBlob(base64);

//获取图片信息
getImageInfo(source)
const info = await getImageInfo(file);
console.log(info);// { width: 1920, height: 1080, ratio: 1.78, size: 204800, type: 'image/jpeg' }
~~~

### ⚡ 性能监控 (performanceUtils)

~~~js
//性能计时
startTimer(name) / endTimer(name)
startTimer('api-request');
await fetch('/api/data');
const duration = endTimer('api-request'); // 输出: api-request: 245.67ms

//防抖和节流
debounce(fn, delay) / throttle(fn, delay)
const debouncedSearch = debounce((query) => {  console.log('搜索:', query);}, 300);
const throttledScroll = throttle(() => {  console.log('滚动事件');}, 100);
window.addEventListener('scroll', throttledScroll);

//内存使用情况
getMemoryUsage()
const memory = getMemoryUsage();
if (memory) {  console.log(`内存使用: ${memory.used}  MB / ${memory.total}MB`);}

//FPS 监控
startFPSMonitor(callback)
const stopMonitor = startFPSMonitor(
    (fps) => {  
        console.log(`当前 FPS: ${fps}`);  
        if (fps < 30) {
            console.warn('性能较低');  
        }
             }
);// 停止监控// stopMonitor();

//页面性能指标
getPagePerformance()
const perf = getPagePerformance();
console.log('页面加载性能:', perf);// { dns: 2, tcp: 1, request: 245, response: 123, domParse: 456, resourceLoad: 789, total: 1616 }

//长任务监控
observeLongTasks(callback)
const observer = observeLongTasks(
    (task) => {  
        console.warn('检测到长任务:', task);  // { name: 'self', duration: 67.5,   startTime: 1234567890 }
     }
);


~~~



### 🛠️ 通用工具 (utils)

~~~js
//生成 UUID
generateUUID()
const id = generateUUID(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

//颜色转换
hexToRgb(hex) / rgbToHex(r, g, b)
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(255, 0, 0); // '#ff0000'

//下载文件
downloadFile(url, filename)
downloadFile('/api/export/data.xlsx', '数据导出.xlsx');

//读取文件内容
readFileAsText(file)
const content = await readFileAsText(file);
console.log('文件内容:', content);

//剪贴板操作
copyToClipboard(text) / readFromClipboard()
const success = await copyToClipboard('要复制的文本');
if (success) {  
    console.log('复制成功');
}
const clipboardText = await readFromClipboard();
console.log('剪贴板内容:', clipboardText);

//全屏操作
requestFullscreen(element) / exitFullscreen() / isFullscreen()
requestFullscreen(); // 全屏显示页面
requestFullscreen($('.video')); // 全屏显示视频元素
if (isFullscreen()) {  
    exitFullscreen();
}

睡眠函数。
sleep(ms)
console.log('开始');
await sleep(2000);
console.log('2秒后执行');
~~~

### 🌐 国际化工具 (i18nUtils)

~~~js
import { formatNumber } from 'general-method-utils';
//格式化数字
formatNumber(value, options, locale)
// 基础数字格式化
formatNumber(1234567.89); // '1,234,567.89'
// 自定义格式
formatNumber(1234567.89, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}, 'en-US'); // '1,234,567.89'
// 中文格式
formatNumber(1234567.89, {}, 'zh-CN'); // '1,234,567.89'


//格式化货币
formatCurrency(value, currency, locale)
// 人民币格式
formatCurrency(1234.56); // '¥1,234.56'
formatCurrency(1234.56, 'CNY', 'zh-CN'); // '¥1,234.56'

// 美元格式
formatCurrency(1234.56, 'USD', 'en-US'); // '$1,234.56'

// 欧元格式
formatCurrency(1234.56, 'EUR', 'de-DE'); // '1.234,56 €'



//*******************************格式化日期******************
formatDate(date, options, locale)
const date = new Date('2023-12-25T14:30:00');

// 基础日期格式
formatDate(date); // '2023/12/25'

// 完整日期时间
formatDate(date, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}); // '2023年12月25日 14:30'

// 英文格式
formatDate(date, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}, 'en-US'); // 'Monday, December 25, 2023'


//*******************************格式化相对时间formatRelativeTime(date, locale)******************
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

formatRelativeTime(oneHourAgo); // '1小时前'
formatRelativeTime(oneHourAgo, 'en-US'); // '1 hour ago'

// 未来时间
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
formatRelativeTime(tomorrow); // '明天'

//*******************************格式化百分比formatPercent(value, locale)******************
formatPercent(0.1234); // '12%'
formatPercent(0.1234, 'en-US'); // '12%'
formatPercent(0.9876); // '99%'
~~~

### 🔐 加密工具 (cryptoUtils)

~~~js
//*******************************生成哈希值hash(data, algorithm)******************
import { hash } from 'general-method-utils';

// SHA-256 哈希（默认）
const sha256Hash = await hash('Hello World');
console.log(sha256Hash); // 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'

// 其他算法
const sha1Hash = await hash('Hello World', 'SHA-1');
const sha512Hash = await hash('Hello World', 'SHA-512');

//*******************************生成随机字符串generateRandomString(length, charset)******************
// 默认字符集（字母+数字）
const randomStr1 = generateRandomString(16); // 'aB3dE7fGhI9jK2lM'

// 自定义长度
const randomStr2 = generateRandomString(8); // 'X7nP9qRs'

// 自定义字符集（仅数字）
const randomNum = generateRandomString(6, '0123456789'); // '847392'

// 自定义字符集（仅大写字母）
const randomUpper = generateRandomString(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // 'KDJFHGBXNM'

//*******************************生成 UUID v4 generateUUIDv4()******************
const uuid = generateUUIDv4();
console.log(uuid); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

//*******************************Base64 编码解码 encodeBase64(data) / decodeBase64(data)******************
// 编码
const encoded = encodeBase64('Hello 世界');
console.log(encoded); // 'SGVsbG8g5LiW55WM'

// 解码
const decoded = decodeBase64(encoded);
console.log(decoded); // 'Hello 世界'

//*******************************生成安全随机数 secureRandom(min, max)******************
// 0-1 之间的随机数
const random1 = secureRandom(); // 0.7834592847

// 指定范围的随机数
const random2 = secureRandom(1, 100); // 67.23849
const random3 = secureRandom(0, 10); // 3.8472
~~~

### 🎬 动画工具 (animationUtils)

~~~js
//*******************************淡入淡出动画 fadeIn(element, options) / fadeOut(element, options)******************
import { fadeIn, fadeOut } from 'general-method-utils';

const modal = document.querySelector('.modal');

// 淡入显示
fadeIn(modal, {
  duration: 300,
  easing: 'ease-in-out',
  onComplete: () => console.log('淡入完成')
});

// 淡出隐藏
fadeOut(modal, {
  duration: 500,
  onComplete: () => console.log('淡出完成')
});
//*******************************滑动动画 slideIn(element, direction, options) / slideOut(element, direction, options)******************
const sidebar = document.querySelector('.sidebar');

// 从左侧滑入
slideIn(sidebar, 'left', {
  duration: 400,
  easing: 'ease-out'
});

// 向上滑出
slideOut(sidebar, 'up', {
  duration: 300
});
//*******************************缩放动画 scale(element, options)******************
const button = document.querySelector('.btn');

// 从0缩放到1
scale(button, {
  from: 0,
  to: 1,
  duration: 200,
  easing: 'ease-out'
});

// 缩放到1.2倍
scale(button, {
  from: 1,
  to: 1.2,
  duration: 150
});

//*******************************弹跳和摇摆动画 bounce(element, options) / shake(element, options)******************
const notification = document.querySelector('.notification');

// 弹跳动画
bounce(notification, {
  duration: 600,
  onComplete: () => console.log('弹跳完成')
});

// 摇摆动画
shake(notification, {
  duration: 500
});

~~~

### 📍 地理位置工具 (geoUtils)

~~~js
//*******************************获取当前位置 getCurrentPosition(options)******************
import { getCurrentPosition } from 'general-method-utils';

try {
  const position = await getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  });
  
  console.log('当前位置:', position);
  // { latitude: 39.9042, longitude: 116.4074 }
} catch (error) {
  console.error('获取位置失败:', error.message);
}
//*******************************监听位置变化 watchPosition(callback, options)******************
const watchId = watchPosition(
  (position) => {
    console.log('位置更新:', position);
    updateMapLocation(position);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000
  }
);

// 停止监听
// clearWatch(watchId);
//*******************************计算两点间距离 calculateDistance(pos1, pos2, options)******************
const beijing = { latitude: 39.9042, longitude: 116.4074 };
const shanghai = { latitude: 31.2304, longitude: 121.4737 };

// 计算距离（公里）
const distanceKm = calculateDistance(beijing, shanghai);
console.log(`北京到上海距离: ${distanceKm.toFixed(2)} 公里`);

// 计算距离（英里）
const distanceMiles = calculateDistance(beijing, shanghai, { unit: 'miles' });
console.log(`距离: ${distanceMiles.toFixed(2)} 英里`);

// 计算距离（米）
const distanceMeters = calculateDistance(beijing, shanghai, { unit: 'meters' });
console.log(`距离: ${distanceMeters.toFixed(0)} 米`);
//*******************************计算方位角 calculateBearing(pos1, pos2)******************
const bearing = calculateBearing(beijing, shanghai);
console.log(`从北京到上海的方位角: ${bearing.toFixed(2)}°`);
//*******************************判断是否在指定半径内 isWithinRadius(center, target, radius, options)******************
const center = { latitude: 39.9042, longitude: 116.4074 };
const target = { latitude: 39.9100, longitude: 116.4200 };

const isNearby = isWithinRadius(center, target, 5); // 5公里内
if (isNearby) {
  console.log('目标在5公里范围内');
}

~~~

### 📝 表单处理工具 (formUtils)

~~~js
//*******************************序列化表单 serializeForm(form) / serializeFormToQuery(form)******************
import { serializeForm, serializeFormToQuery } from 'general-method-utils';

const form = document.querySelector('#userForm');

// 序列化为对象
const formData = serializeForm(form);
console.log(formData);
// { name: 'John', email: 'john@example.com', age: 25, subscribe: true }

// 序列化为查询字符串
const queryString = serializeFormToQuery(form);
console.log(queryString);
// 'name=John&email=john%40example.com&age=25&subscribe=true'
//*******************************填充和重置表单 populateForm(form, data) / resetForm(form)******************
const userData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 28,
  subscribe: false
};

// 填充表单
populateForm(form, userData);

// 重置表单
resetForm(form);
//*******************************表单验证 validateForm(form, rules)******************
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址'
  },
  password: {
    required: true,
    minLength: 8,
    validator: (value) => {
      return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
    },
    message: '密码必须包含大小写字母和数字'
  },
  age: {
    required: true,
    min: 18,
    max: 100,
    message: '年龄必须在18-100之间'
  }
};

const result = validateForm(form, validationRules);
if (result.isValid) {
  console.log('表单验证通过');
  submitForm();
} else {
  console.log('验证失败:', result.errors);
  // { password: '密码必须包含大小写字母和数字' }
}
//*******************************自动保存和恢复表单 autoSaveForm(form, options) / restoreForm(form, key, storage)******************
// 启用自动保存
const cleanup = autoSaveForm(form, {
  key: 'userForm',
  interval: 3000, // 每3秒保存一次
  storage: 'localStorage'
});

// 恢复表单数据
const restored = restoreForm(form, 'userForm', 'localStorage');
if (restored) {
  console.log('表单数据已恢复');
}

// 停止自动保存
// cleanup();

~~~



## 🔧 完整示例

~~~js
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
  debounce,
  i18nUtils,
  cryptoUtils,
  animationUtils,
  geoUtils,
  formUtils
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

// 国际化示例
function initI18n() {
  const locale = navigator.language || 'zh-CN';
  
  // 格式化货币
  const price = i18nUtils.formatCurrency(1234.56, 'CNY', locale);
  document.querySelector('.price').textContent = price;
  
  // 格式化日期
  const date = i18nUtils.formatDate(new Date(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }, locale);
  document.querySelector('.date').textContent = date;
}

// 安全功能示例
async function generateSecureToken() {
  // 生成随机字符串
  const randomStr = cryptoUtils.generateRandomString(32);
  
  // 生成哈希
  const hash = await cryptoUtils.hash(randomStr + Date.now());
  
  // 生成UUID
  const uuid = cryptoUtils.generateUUIDv4();
  
  return { randomStr, hash, uuid };
}

// 动画效果示例
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // 淡入显示
  animationUtils.fadeIn(notification, {
    duration: 300,
    onComplete: () => {
      // 3秒后淡出
      setTimeout(() => {
        animationUtils.fadeOut(notification, {
          duration: 300,
          onComplete: () => notification.remove()
        });
      }, 3000);
    }
  });
}

// 地理位置示例
async function initLocationServices() {
  try {
    const position = await geoUtils.getCurrentPosition({
      enableHighAccuracy: true
    });
    
    console.log('当前位置:', position);
    
    // 计算到某个地点的距离
    const targetLocation = { latitude: 39.9042, longitude: 116.4074 };
    const distance = geoUtils.calculateDistance(position, targetLocation);
    
    if (distance < 10) {
      showNotification('您在目标位置附近', 'success');
    }
  } catch (error) {
    showNotification('无法获取位置信息', 'error');
  }
}

// 智能表单示例
function initSmartForm() {
  const form = document.querySelector('#smartForm');
  
  // 自动保存
  const cleanup = formUtils.autoSaveForm(form, {
    key: 'smartForm',
    interval: 5000
  });
  
  // 恢复数据
  formUtils.restoreForm(form, 'smartForm');
  
  // 表单验证
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      validator: (value) => {
        const strength = validateUtils.checkPasswordStrength(value);
        return strength.level !== 'weak';
      }
    }
  };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const result = formUtils.validateForm(form, validationRules);
    if (result.isValid) {
      const formData = formUtils.serializeForm(form);
      submitFormData(formData);
    } else {
      showNotification('请检查表单输入', 'error');
    }
  });
}

// 初始化所有功能
function initApp() {
  initI18n();
  initLocationServices();
  initSmartForm();
  
  // 显示欢迎消息
  showNotification('应用初始化完成', 'success');
}

// 启动应用
initApp();


~~~



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







