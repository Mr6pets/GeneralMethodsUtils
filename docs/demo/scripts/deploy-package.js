#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

console.log('🚀 开始构建和打包部署文件...');

// 1. 先运行构建脚本
try {
  console.log('📦 正在构建dist目录...');
  execSync('node scripts/build-dist.js', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ dist目录构建完成');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 2. 创建压缩包
try {
  console.log('🗜️  正在创建部署压缩包...');
  
  // 使用PowerShell创建zip文件
  const zipCommand = `powershell -Command "Compress-Archive -Path 'dist\\*' -DestinationPath 'demo-deployment-package.zip' -Force"`;
  execSync(zipCommand, { cwd: projectRoot });
  
  console.log('✅ 压缩包创建完成: demo-deployment-package.zip');
} catch (error) {
  console.error('❌ 压缩包创建失败:', error.message);
  process.exit(1);
}

// 3. 显示部署信息
console.log('\n📋 部署信息:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📁 源文件目录:', distDir);
console.log('📦 压缩包文件:', path.join(projectRoot, 'demo-deployment-package.zip'));

// 获取压缩包大小
const zipPath = path.join(projectRoot, 'demo-deployment-package.zip');
if (fs.existsSync(zipPath)) {
  const stats = fs.statSync(zipPath);
  console.log('📊 压缩包大小:', (stats.size / 1024).toFixed(2), 'KB');
}

console.log('\n🎯 部署选项:');
console.log('1️⃣  直接复制 dist/ 目录到服务器');
console.log('2️⃣  上传 demo-deployment-package.zip 到服务器并解压');
console.log('3️⃣  使用FTP/SFTP工具上传文件');

console.log('\n📝 阿里云部署步骤:');
console.log('1. 登录阿里云控制台');
console.log('2. 进入ECS实例或轻量应用服务器');
console.log('3. 上传压缩包到服务器');
console.log('4. 解压到网站根目录: unzip demo-deployment-package.zip');
console.log('5. 配置Nginx/Apache指向解压后的文件');
console.log('6. 访问域名测试部署结果');

console.log('\n✨ 部署完成! 所有文件已准备就绪');