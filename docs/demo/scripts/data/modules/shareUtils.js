// 分享工具模块
export default {
    title: '分享工具',
    icon: 'fas fa-share-alt',
    methods: {
        shareText: {
            name: 'shareText',
            description: '分享文本内容',
            params: [
                { name: 'text', type: 'string', required: true, description: '要分享的文本' },
                { name: 'title', type: 'string', required: false, description: '分享标题' },
                { name: 'url', type: 'string', required: false, description: '分享链接' }
            ],
            examples: {
                js: `// 分享简单文本\nshareText('这是一个很棒的内容！');\n\n// 分享带标题的文本\nshareText('查看这个有趣的文章', '精彩内容分享');\n\n// 分享带链接的文本\nshareText('查看这个网站', '推荐网站', 'https://example.com');\n\n// 检查是否支持原生分享\nif (navigator.share) {\n  shareText('原生分享内容', '标题', 'https://example.com');\n} else {\n  // 降级到复制到剪贴板\n  copyToClipboard('分享内容');\n  showNotification('内容已复制到剪贴板');\n}\n\n// 分享当前页面\nshareText(\n  document.title,\n  '分享页面',\n  window.location.href\n);`,
                ts: `import { shareText } from 'general-method-utils';\n\ninterface ShareOptions {\n  text: string;\n  title?: string;\n  url?: string;\n}\n\n// 分享简单文本\nshareText('这是一个很棒的内容！');\n\n// 分享带标题的文本\nshareText('查看这个有趣的文章', '精彩内容分享');\n\n// 分享带链接的文本\nshareText('查看这个网站', '推荐网站', 'https://example.com');\n\n// 检查是否支持原生分享\nif (navigator.share) {\n  shareText('原生分享内容', '标题', 'https://example.com');\n} else {\n  console.log('不支持原生分享API');\n}`
            },
            demo: true
        },
        shareFile: {
            name: 'shareFile',
            description: '分享文件',
            params: [
                { name: 'file', type: 'File', required: true, description: '要分享的文件' },
                { name: 'title', type: 'string', required: false, description: '分享标题' },
                { name: 'text', type: 'string', required: false, description: '分享描述' }
            ],
            examples: {
                js: `// 分享图片文件\nconst imageFile = document.getElementById('fileInput').files[0];\nshareFile(imageFile, '我的照片', '看看这张美丽的照片！');\n\n// 分享PDF文档\nconst pdfFile = await fetch('/documents/report.pdf')\n  .then(res => res.blob())\n  .then(blob => new File([blob], 'report.pdf', { type: 'application/pdf' }));\n\nshareFile(pdfFile, '月度报告', '请查看最新的月度报告');\n\n// 分享多个文件\nconst files = Array.from(document.getElementById('multipleFiles').files);\nfiles.forEach((file, index) => {\n  shareFile(file, \`文件 \${index + 1}\`, \`分享文件: \${file.name}\`);\n});\n\n// 检查文件分享支持\nif (navigator.canShare && navigator.canShare({ files: [imageFile] })) {\n  shareFile(imageFile, '图片分享');\n} else {\n  console.log('不支持文件分享');\n}`,
                ts: `import { shareFile } from 'general-method-utils';\n\n// 分享图片文件\nconst imageFile: File = (document.getElementById('fileInput') as HTMLInputElement).files![0];\nshareFile(imageFile, '我的照片', '看看这张美丽的照片！');\n\n// 分享PDF文档\nconst pdfFile: File = await fetch('/documents/report.pdf')\n  .then(res => res.blob())\n  .then(blob => new File([blob], 'report.pdf', { type: 'application/pdf' }));\n\nshareFile(pdfFile, '月度报告', '请查看最新的月度报告');\n\n// 检查文件分享支持\nif (navigator.canShare && navigator.canShare({ files: [imageFile] })) {\n  shareFile(imageFile, '图片分享');\n} else {\n  console.log('不支持文件分享');\n}`
            },
            demo: true
        },
        shareToSocial: {
            name: 'shareToSocial',
            description: '分享到社交媒体',
            params: [
                { name: 'platform', type: 'string', required: true, description: '社交平台：twitter、facebook、linkedin、weibo等' },
                { name: 'content', type: 'object', required: true, description: '分享内容' }
            ],
            examples: {
                js: `// 分享到Twitter\nshareToSocial('twitter', {\n  text: '查看这个很棒的网站！',\n  url: 'https://example.com',\n  hashtags: ['web', 'tech', 'awesome']\n});\n\n// 分享到Facebook\nshareToSocial('facebook', {\n  url: 'https://example.com',\n  quote: '这是一个很棒的网站'\n});\n\n// 分享到LinkedIn\nshareToSocial('linkedin', {\n  url: 'https://example.com',\n  title: '推荐网站',\n  summary: '这个网站有很多有用的工具'\n});\n\n// 分享到微博\nshareToSocial('weibo', {\n  title: '推荐内容',\n  url: 'https://example.com',\n  pic: 'https://example.com/image.jpg'\n});\n\n// 分享到QQ空间\nshareToSocial('qzone', {\n  title: '分享标题',\n  url: 'https://example.com',\n  desc: '分享描述',\n  pics: 'https://example.com/image.jpg'\n});\n\n// 分享到微信（生成二维码）\nshareToSocial('wechat', {\n  url: 'https://example.com',\n  title: '微信分享'\n});`,
                ts: `import { shareToSocial } from 'general-method-utils';\n\ninterface TwitterShareContent {\n  text: string;\n  url?: string;\n  hashtags?: string[];\n}\n\ninterface FacebookShareContent {\n  url: string;\n  quote?: string;\n}\n\ninterface LinkedInShareContent {\n  url: string;\n  title?: string;\n  summary?: string;\n}\n\n// 分享到Twitter\nshareToSocial('twitter', {\n  text: '查看这个很棒的网站！',\n  url: 'https://example.com',\n  hashtags: ['web', 'tech', 'awesome']\n} as TwitterShareContent);\n\n// 分享到Facebook\nshareToSocial('facebook', {\n  url: 'https://example.com',\n  quote: '这是一个很棒的网站'\n} as FacebookShareContent);\n\n// 分享到LinkedIn\nshareToSocial('linkedin', {\n  url: 'https://example.com',\n  title: '推荐网站',\n  summary: '这个网站有很多有用的工具'\n} as LinkedInShareContent);`
            },
            demo: true
        },
        copyToClipboard: {
            name: 'copyToClipboard',
            description: '复制内容到剪贴板',
            params: [
                { name: 'text', type: 'string', required: true, description: '要复制的文本' },
                { name: 'callback', type: 'function', required: false, description: '复制完成回调' }
            ],
            examples: {
                js: `// 复制文本\ncopyToClipboard('Hello, World!');\n\n// 复制带回调\ncopyToClipboard('复制的内容', (success) => {\n  if (success) {\n    showNotification('复制成功！');\n  } else {\n    showError('复制失败');\n  }\n});\n\n// 复制当前页面URL\ncopyToClipboard(window.location.href, () => {\n  console.log('页面链接已复制');\n});\n\n// 复制表单数据\nconst formData = new FormData(document.getElementById('myForm'));\nconst formText = Array.from(formData.entries())\n  .map(([key, value]) => \`\${key}: \${value}\`)\n  .join('\\n');\n\ncopyToClipboard(formText);\n\n// 复制代码块\nconst codeBlock = document.querySelector('pre code').textContent;\ncopyToClipboard(codeBlock, () => {\n  // 显示复制成功动画\n  showCopyAnimation();\n});`,
                ts: `import { copyToClipboard } from 'general-method-utils';\n\ntype CopyCallback = (success: boolean) => void;\n\n// 复制文本\ncopyToClipboard('Hello, World!');\n\n// 复制带回调\ncopyToClipboard('复制的内容', (success: boolean) => {\n  if (success) {\n    showNotification('复制成功！');\n  } else {\n    showError('复制失败');\n  }\n});\n\n// 复制当前页面URL\ncopyToClipboard(window.location.href, () => {\n  console.log('页面链接已复制');\n});\n\n// 复制代码块\nconst codeBlock = document.querySelector('pre code')?.textContent || '';\ncopyToClipboard(codeBlock, () => {\n  showCopyAnimation();\n});`
            },
            demo: true
        },
        generateShareUrl: {
            name: 'generateShareUrl',
            description: '生成分享链接',
            params: [
                { name: 'platform', type: 'string', required: true, description: '分享平台' },
                { name: 'content', type: 'object', required: true, description: '分享内容' }
            ],
            examples: {
                js: `// 生成Twitter分享链接\nconst twitterUrl = generateShareUrl('twitter', {\n  text: '查看这个很棒的内容！',\n  url: 'https://example.com',\n  hashtags: ['web', 'tech']\n});\nconsole.log(twitterUrl);\n// 输出: https://twitter.com/intent/tweet?text=查看这个很棒的内容！&url=https://example.com&hashtags=web,tech\n\n// 生成Facebook分享链接\nconst facebookUrl = generateShareUrl('facebook', {\n  url: 'https://example.com'\n});\n\n// 生成LinkedIn分享链接\nconst linkedinUrl = generateShareUrl('linkedin', {\n  url: 'https://example.com',\n  title: '推荐网站',\n  summary: '这个网站很有用'\n});\n\n// 生成邮件分享链接\nconst emailUrl = generateShareUrl('email', {\n  subject: '推荐内容',\n  body: '我发现了一个很棒的网站：https://example.com'\n});\n\n// 生成短信分享链接\nconst smsUrl = generateShareUrl('sms', {\n  body: '查看这个链接：https://example.com'\n});\n\n// 批量生成多个平台的分享链接\nconst platforms = ['twitter', 'facebook', 'linkedin'];\nconst shareUrls = platforms.map(platform => ({\n  platform,\n  url: generateShareUrl(platform, {\n    url: 'https://example.com',\n    title: '分享内容'\n  })\n}));`,
                ts: `import { generateShareUrl } from 'general-method-utils';\n\ninterface ShareContent {\n  url?: string;\n  title?: string;\n  text?: string;\n  hashtags?: string[];\n  summary?: string;\n  subject?: string;\n  body?: string;\n}\n\n// 生成Twitter分享链接\nconst twitterUrl: string = generateShareUrl('twitter', {\n  text: '查看这个很棒的内容！',\n  url: 'https://example.com',\n  hashtags: ['web', 'tech']\n} as ShareContent);\n\n// 生成Facebook分享链接\nconst facebookUrl: string = generateShareUrl('facebook', {\n  url: 'https://example.com'\n} as ShareContent);\n\n// 生成LinkedIn分享链接\nconst linkedinUrl: string = generateShareUrl('linkedin', {\n  url: 'https://example.com',\n  title: '推荐网站',\n  summary: '这个网站很有用'\n} as ShareContent);`
            },
            demo: true
        },
        shareViaQRCode: {
            name: 'shareViaQRCode',
            description: '通过二维码分享',
            params: [
                { name: 'content', type: 'string', required: true, description: '要分享的内容' },
                { name: 'options', type: 'object', required: false, description: '二维码选项' }
            ],
            examples: {
                js: `// 生成URL二维码\nshareViaQRCode('https://example.com');\n\n// 生成带选项的二维码\nshareViaQRCode('https://example.com', {\n  size: 200,\n  backgroundColor: '#ffffff',\n  foregroundColor: '#000000',\n  errorCorrectionLevel: 'M'\n});\n\n// 生成文本二维码\nshareViaQRCode('这是要分享的文本内容', {\n  size: 150\n});\n\n// 生成联系人二维码\nconst contactInfo = \`BEGIN:VCARD\nVERSION:3.0\nFN:张三\nORG:示例公司\nTEL:+86-138-0013-8000\nEMAIL:zhangsan@example.com\nEND:VCARD\`;\n\nshareViaQRCode(contactInfo, {\n  size: 250,\n  title: '扫码添加联系人'\n});\n\n// 生成WiFi二维码\nconst wifiInfo = 'WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;';\nshareViaQRCode(wifiInfo, {\n  size: 200,\n  title: '扫码连接WiFi'\n});\n\n// 显示二维码在模态框中\nshareViaQRCode('https://example.com', {\n  showModal: true,\n  modalTitle: '分享链接',\n  downloadable: true\n});`,
                ts: `import { shareViaQRCode } from 'general-method-utils';\n\ninterface QRCodeOptions {\n  size?: number;\n  backgroundColor?: string;\n  foregroundColor?: string;\n  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';\n  title?: string;\n  showModal?: boolean;\n  modalTitle?: string;\n  downloadable?: boolean;\n}\n\n// 生成URL二维码\nshareViaQRCode('https://example.com');\n\n// 生成带选项的二维码\nshareViaQRCode('https://example.com', {\n  size: 200,\n  backgroundColor: '#ffffff',\n  foregroundColor: '#000000',\n  errorCorrectionLevel: 'M'\n} as QRCodeOptions);\n\n// 生成文本二维码\nshareViaQRCode('这是要分享的文本内容', {\n  size: 150\n} as QRCodeOptions);`
            },
            demo: true
        }
    }
};