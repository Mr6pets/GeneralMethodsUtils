# 通用方法库演示系统

这是一个模块化的演示系统，用于展示通用方法库的各种功能。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
docs/demo/
├── scripts/
│   ├── data/                 # 模块化数据管理
│   │   ├── index.js         # 数据管理器主文件
│   │   └── modules/         # 各个模块文件
│   │       ├── cookieUtils.js
│   │       ├── urlUtils.js
│   │       ├── aimlUtils.js
│   │       ├── securityUtils.js
│   │       ├── dataUtils.js
│   │       └── performanceUtils.js
│   ├── demos/               # 演示代码
│   │   └── index.js        # 演示生成器
│   ├── cli/                # CLI工具
│   │   └── add-method.js   # 添加方法工具
│   ├── app.js              # 主应用
│   ├── sidebar.js          # 侧边栏管理
│   ├── search.js           # 搜索功能
│   └── content.js          # 内容管理
├── styles/
│   └── main.css           # 主样式文件
├── index.html             # 主页面
├── package.json           # 项目配置
└── README.md             # 说明文档
```

## 🔧 模块化架构

### 数据管理

新的模块化数据管理系统提供了以下优势：

- **模块分离**: 每个工具模块独立文件管理
- **动态加载**: 按需加载模块数据，提升性能
- **易于维护**: 添加新方法更加简单
- **版本控制**: 减少合并冲突

### 模块结构

每个模块文件包含：

```javascript
export default {
    title: '模块标题',
    icon: 'fas fa-icon-name',
    methods: {
        methodName: {
            name: 'methodName',
            description: '方法描述',
            params: [
                { name: 'param1', type: 'string', required: true, description: '参数描述' }
            ],
            examples: {
                js: `// JavaScript 示例代码`,
                ts: `// TypeScript 示例代码`
            },
            demo: true // 是否有演示
        }
    }
};
```

## 🛠️ 添加新方法

### 使用CLI工具（推荐）

```bash
npm run add-method
```

这个交互式工具会引导你：
1. 选择现有模块或创建新模块
2. 输入方法信息（名称、描述、参数等）
3. 添加示例代码
4. 可选添加演示

### 手动添加

1. **选择或创建模块文件**
   - 在 `scripts/data/modules/` 目录下找到对应模块
   - 或创建新的模块文件

2. **添加方法定义**
   ```javascript
   newMethod: {
       name: 'newMethod',
       description: '新方法描述',
       params: [
           { name: 'param1', type: 'string', required: true, description: '参数描述' }
       ],
       examples: {
           js: `// JavaScript 示例`,
           ts: `// TypeScript 示例`
       },
       demo: true
   }
   ```

3. **注册模块**（如果是新模块）
   在 `scripts/data/index.js` 中添加：
   ```javascript
   manager.registerModule('模块名称', () => import('./modules/moduleName.js'));
   ```

4. **添加演示**（可选）
   在 `scripts/demos/index.js` 中添加演示代码

## 🎯 演示系统

演示系统支持：
- **交互式演示**: 用户可以输入参数并查看结果
- **实时代码**: 展示实际的JavaScript/TypeScript代码
- **多种格式**: 支持各种数据格式的演示

### 添加演示

在 `scripts/demos/index.js` 中添加：

```javascript
export const newMethodDemo = () => `
    <div class="demo-container">
        <h4>方法演示</h4>
        <div class="demo-controls">
            <!-- 控制元素 -->
        </div>
        <div class="demo-output" id="output"></div>
        <script>
            // 演示逻辑
        </script>
    </div>
`;
```

## 🔍 搜索功能

搜索系统支持：
- **模糊搜索**: 支持方法名、描述的模糊匹配
- **实时建议**: 输入时显示搜索建议
- **历史记录**: 保存搜索历史
- **快速导航**: 直接跳转到对应方法

## 📱 响应式设计

- **移动端适配**: 支持手机和平板设备
- **自适应布局**: 根据屏幕大小调整界面
- **触摸友好**: 优化触摸操作体验

## 🎨 主题定制

在 `styles/main.css` 中可以自定义：
- 颜色主题
- 字体样式
- 布局间距
- 动画效果

## 🚀 性能优化

- **懒加载**: 模块按需加载
- **代码分割**: 减少初始加载时间
- **缓存策略**: 智能缓存管理
- **压缩优化**: 生产环境代码压缩

## 🧪 测试

```bash
# 检查项目结构
npm run check

# 启动开发服务器进行测试
npm run dev
```

## 📝 贡献指南

1. **Fork 项目**
2. **创建功能分支**: `git checkout -b feature/new-method`
3. **添加方法**: 使用CLI工具或手动添加
4. **测试功能**: 确保演示正常工作
5. **提交更改**: `git commit -m 'Add new method'`
6. **推送分支**: `git push origin feature/new-method`
7. **创建Pull Request**

## 📄 许可证

MIT License

## 🤝 支持

如果遇到问题或有建议，请：
- 创建 Issue
- 发送邮件
- 查看文档

---

**享受编码！** 🎉