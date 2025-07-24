# 部署指南

本项目提供了便捷的命令行工具来打包和部署演示系统到阿里云服务器。

## 🚀 快速开始

### 方法一：一键打包部署
```bash
# 构建并打包所有文件
node scripts/deploy-package.js
```

### 方法二：分步操作
```bash
# 1. 仅构建dist目录
node scripts/build-dist.js

# 2. 手动创建压缩包
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'demo-deployment-package.zip' -Force"
```

## 📦 输出文件

执行构建命令后，会生成以下文件：

- `dist/` - 包含所有部署文件的目录
- `demo-deployment-package.zip` - 压缩包文件
- `dist/DEPLOY.md` - 部署说明文档

## 📁 dist目录结构

```
dist/
├── index.html          # 主页面
├── package.json        # 项目配置
├── README.md          # 项目说明
├── DEPLOY.md          # 部署说明
├── scripts/           # JavaScript文件
│   ├── app.js
│   ├── content.js
│   ├── search.js
│   ├── sidebar.js
│   ├── tabs.js
│   ├── utils.js
│   ├── events.js
│   ├── data.js
│   ├── data-legacy.js
│   ├── cli/
│   ├── data/
│   └── demos/
└── styles/
    └── main.css       # 样式文件
```

## 🌐 阿里云部署步骤

### 1. 准备服务器环境
- 确保已安装Web服务器（Nginx/Apache）
- 确保服务器可以访问互联网

### 2. 上传文件
**选项A：上传压缩包**
```bash
# 在服务器上解压
unzip demo-deployment-package.zip
```

**选项B：直接上传dist目录**
```bash
# 使用scp命令
scp -r dist/ user@your-server:/var/www/html/
```

### 3. 配置Web服务器

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态文件缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache配置示例：**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/dist
    
    <Directory /var/www/html/dist>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 4. 设置文件权限
```bash
# 设置正确的文件权限
chmod -R 644 /var/www/html/dist
chmod -R 755 /var/www/html/dist
chown -R www-data:www-data /var/www/html/dist
```

### 5. 测试部署
- 访问你的域名或IP地址
- 检查所有功能是否正常工作
- 验证静态资源加载正常

## 🔧 故障排除

### 常见问题

1. **文件权限错误**
   ```bash
   chmod -R 755 /var/www/html/dist
   ```

2. **静态文件404错误**
   - 检查文件路径是否正确
   - 确认Web服务器配置

3. **JavaScript错误**
   - 检查浏览器控制台
   - 确认所有文件都已上传

## 📊 文件统计

- 总文件数：约28个文件
- 总大小：约292KB
- 压缩包大小：约60-80KB

## 🎯 部署建议

1. **生产环境**：使用压缩包上传，减少传输时间
2. **开发环境**：直接上传dist目录，便于调试
3. **CDN加速**：考虑将静态资源上传到阿里云OSS
4. **HTTPS**：配置SSL证书确保安全访问

---

💡 **提示**：首次部署建议先在测试环境验证，确认无误后再部署到生产环境。