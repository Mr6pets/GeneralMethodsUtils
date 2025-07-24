#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// 需要复制的文件和目录
const filesToCopy = [
  'index.html',
  'package.json',
  'README.md',
  'scripts',
  'styles'
];

// 递归复制目录
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制文件
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// 清理dist目录
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// 创建dist目录
fs.mkdirSync(distDir, { recursive: true });

console.log('🚀 开始构建dist目录...');

// 复制所有必要文件
filesToCopy.forEach(item => {
  const srcPath = path.join(projectRoot, item);
  const destPath = path.join(distDir, item);

  if (fs.existsSync(srcPath)) {
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      console.log(`📁 复制目录: ${item}`);
      copyDirectory(srcPath, destPath);
    } else {
      console.log(`📄 复制文件: ${item}`);
      copyFile(srcPath, destPath);
    }
  } else {
    console.warn(`⚠️  文件不存在: ${item}`);
  }
});

// 创建部署说明文件
const deployInfo = `# 部署说明

本目录包含了完整的演示系统文件，可以直接部署到任何静态文件服务器。

## 文件清单
- index.html - 主页面文件
- package.json - 项目配置
- README.md - 项目说明
- scripts/ - JavaScript文件目录
- styles/ - CSS样式文件目录

## 部署步骤
1. 将整个dist目录上传到服务器
2. 确保web服务器配置正确
3. 访问index.html即可

构建时间: ${new Date().toLocaleString('zh-CN')}
`;

fs.writeFileSync(path.join(distDir, 'DEPLOY.md'), deployInfo);

console.log('✅ 构建完成!');
console.log(`📦 输出目录: ${distDir}`);
console.log('🎯 可以直接复制dist目录进行部署');

// 显示文件统计
function getDirectorySize(dirPath) {
  let totalSize = 0;
  let fileCount = 0;

  function traverse(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        totalSize += fs.statSync(fullPath).size;
        fileCount++;
      }
    }
  }

  traverse(dirPath);
  return { totalSize, fileCount };
}

const { totalSize, fileCount } = getDirectorySize(distDir);
console.log(`📊 统计信息: ${fileCount} 个文件, 总大小: ${(totalSize / 1024).toFixed(2)} KB`);