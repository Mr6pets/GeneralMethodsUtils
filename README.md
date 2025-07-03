# General-method-encapsulation

> 通用工具方法库，包含常用的前端开发工具函数

一个模块化的 JavaScript 工具库，提供 Cookie 操作、URL 处理、设备检测、社交分享等常用功能。

## 特性

- 🚀 模块化设计，支持按需导入
- 📦 支持 ES6 模块和 CommonJS
- 🔧 TypeScript 支持
- 📱 移动端友好
- 🌐 浏览器兼容性良好

## 安装

```bash
npm install general-method-utils
```

#### 创建vue 项目
vue create XXX

#### 升级Vue终端
vue add vue-next

#### MAC 打开第三方程序安装
sudo spctl --master-disable

#### 版本时间戳动态
~~~js
document.write("<link rel='stylesheet' type='text/css' href='/css/layout.css?v="+new Date().getTime()+"'>");
~~~

#### vscode 配合使用插件
~~~js
//B站地址：https://www.bilibili.com/video/BV1Xg411X74K/?spm_id_from=333.788.recommend_more_video.7&vd_source=8b749e499334930bb8f03b6f409d8dbb
1、LiveServer（实时更新网页
2、REST Client（客户端请求
3、GitLens（git查看修改
4、CSS Peek（查css代码 
5、Quokka.js（提醒js代码错误
6、CodeSnap（代码截图
7、Auto Rename Tag（自动修改前后标签
8、Snippets（缩写
9、Bracket Pair Colorizer（括号颜色
10、indent-rainbow（缩进颜色
11、vscode-icons（更好识别的图标
12、Prettier（自动整理代码格式
13、Color Highlight（颜色提醒
14、Dracula Official（主题
~~~

<!-- 状态码 -->

## 使用方式
### ES6 模块导入
```
// 导入所有方法
import utils from 'general-method-utils';

// 按需导入特定方法
import { setCookie, getCookie, 
getDeviceType } from 'general-method-utils';

// 导入特定模块
import { cookieUtils, deviceUtils } from 
'general-method-utils';
```
### CommonJS 导入
```
// 导入所有方法
const utils = require
('general-method-utils');

// 按需导入
const { setCookie, getCookie } = require
('general-method-utils');
```
### 浏览器直接引入
```
<script src="path/to/general-method-utils/
dist/index.umd.js"></script>
<script>
  // 使用全局变量 GeneralUtils
  GeneralUtils.setCookie('username', 
  'john');
</script>
```
## API 文档
### Cookie 工具 (cookieUtils) setCookie(name, value, days)
设置 Cookie

```
import { setCookie } from 
'general-method-utils';

// 设置 Cookie，默认30天过期
setCookie('username', 'john');

// 设置 Cookie，7天过期
setCookie('token', 'abc123', 7);
```
参数：

- name (string): Cookie 名称
- value (string): Cookie 值
- days (number): 过期天数，默认30天 getCookie(key)
获取 Cookie 值

```
import { getCookie } from 
'general-method-utils';

const username = getCookie('username');
console.log(username); // 'john'
```
参数：

- key (string): Cookie 名称
返回值：

- (string|null): Cookie 值，不存在时返回 null removeCookie(name)
删除 Cookie

```
import { removeCookie } from 
'general-method-utils';

removeCookie('username');
```
### URL 工具 (urlUtils) getQueryString(name)
获取 URL 参数

```
import { getQueryString } from 
'general-method-utils';

// 假设当前 URL: https://example.com?id=123&
name=john
const id = getQueryString('id'); // '123'
const name = getQueryString('name'); // 
'john'
``` parseUrlParams(url)
解析 URL 参数为对象

```
import { parseUrlParams } from 
'general-method-utils';

const params = parseUrlParams('https://
example.com?id=123&name=john');
console.log(params); // { id: '123', name: 
'john' }

// 解析当前页面 URL 参数
const currentParams = parseUrlParams();
```
### 设备检测 (deviceUtils) getDeviceType()
检测设备类型

```
import { getDeviceType } from 
'general-method-utils';

const deviceType = getDeviceType();
console.log(deviceType); // 'android' | 
'ios' | 'pc'
``` isMobile()
检测是否为移动设备

```
import { isMobile } from 
'general-method-utils';

if (isMobile()) {
  console.log('当前是移动设备');
}
``` isWeChat()
检测是否为微信浏览器

```
import { isWeChat } from 
'general-method-utils';

if (isWeChat()) {
  console.log('当前在微信浏览器中');
}
```
### 社交分享 (shareUtils) shareToQQ(options)
分享到 QQ

```
import { shareToQQ } from 
'general-method-utils';

shareToQQ({
  title: '分享标题',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg',
  desc: '分享描述'
});
``` shareToQZone(options)
分享到 QQ 空间

```
import { shareToQZone } from 
'general-method-utils';

shareToQZone({
  title: '分享标题',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});
``` shareToWeibo(options)
分享到新浪微博

```
import { shareToWeibo } from 
'general-method-utils';

shareToWeibo({
  title: '分享标题',
  url: 'https://example.com',
  pic: 'https://example.com/image.jpg'
});
```
## 完整示例
```
import { 
  setCookie, 
  getCookie, 
  getDeviceType, 
  isMobile, 
  getQueryString,
  shareToQQ 
} from 'general-method-utils';

// Cookie 操作
setCookie('user_id', '12345');
const userId = getCookie('user_id');

// 设备检测
const device = getDeviceType();
if (isMobile()) {
  console.log('移动端访问');
}

// URL 参数获取
const pageId = getQueryString('page_id');

// 社交分享
function handleShare() {
  shareToQQ({
    title: '精彩内容分享',
    url: window.location.href,
    pic: 'https://example.com/share-image.
    jpg',
    desc: '快来看看这个有趣的内容！'
  });
}
```
## 开发相关
### 构建项目
```
npm run build
```
### 开发模式
```
npm run dev
```
### 运行测试
```
npm test
```
## 浏览器兼容性
- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79
- IE >= 11 (部分功能)
## 许可证
MIT License

## 贡献
欢迎提交 Issue 和 Pull Request！

## 其他资源
### 创建 Vue 项目
```
vue create XXX
```
### 升级 Vue 到 Vue 3
```
vue add vue-next
```
### MAC 打开第三方程序安装
```
sudo spctl --master-disable
```
### 版本时间戳动态加载
```
document.write("<link rel='stylesheet' 
type='text/css' href='/css/layout.css?v="
+new Date().getTime()+"'>");
```
### 推荐的 VSCode 插件
1. LiveServer - 实时更新网页
2. REST Client - 客户端请求
3. GitLens - Git 查看修改
4. CSS Peek - 查看 CSS 代码
5. Quokka.js - 提醒 JS 代码错误
6. CodeSnap - 代码截图
7. Auto Rename Tag - 自动修改前后标签
8. Snippets - 代码片段
9. Bracket Pair Colorizer - 括号颜色
10. indent-rainbow - 缩进颜色
11. vscode-icons - 更好识别的图标
12. Prettier - 自动整理代码格式
13. Color Highlight - 颜色提醒
14. Dracula Official - 主题
B站教程地址： https://www.bilibili.com/video/BV1Xg411X74K/








