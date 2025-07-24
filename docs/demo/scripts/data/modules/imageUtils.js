// 图像处理工具模块
export default {
    title: '图像处理工具',
    icon: 'fas fa-image',
    methods: {
        resizeImage: {
            name: 'resizeImage',
            description: '调整图像尺寸',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' },
                { name: 'width', type: 'number', required: true, description: '目标宽度' },
                { name: 'height', type: 'number', required: true, description: '目标高度' },
                { name: 'quality', type: 'number', required: false, description: '图像质量 0-1' }
            ],
            examples: {
                js: `// 调整图像尺寸\nconst img = document.querySelector('#myImage');\nresizeImage(img, 300, 200, 0.8)\n  .then(resizedDataUrl => {\n    const newImg = document.createElement('img');\n    newImg.src = resizedDataUrl;\n    document.body.appendChild(newImg);\n  });\n\n// 处理文件上传\nconst fileInput = document.querySelector('#imageUpload');\nfileInput.addEventListener('change', async (e) => {\n  const file = e.target.files[0];\n  if (file && file.type.startsWith('image/')) {\n    const resized = await resizeImage(file, 800, 600);\n    uploadImage(resized);\n  }\n});`,
                ts: `import { resizeImage } from 'general-method-utils';\n\nconst img = document.querySelector('#myImage') as HTMLImageElement;\nresizeImage(img, 300, 200, 0.8)\n  .then((resizedDataUrl: string) => {\n    const newImg = document.createElement('img');\n    newImg.src = resizedDataUrl;\n    document.body.appendChild(newImg);\n  });\n\nconst fileInput = document.querySelector('#imageUpload') as HTMLInputElement;\nfileInput.addEventListener('change', async (e) => {\n  const file = (e.target as HTMLInputElement).files?.[0];\n  if (file && file.type.startsWith('image/')) {\n    const resized: string = await resizeImage(file, 800, 600);\n  }\n});`
            },
            demo: true
        },
        compressImage: {
            name: 'compressImage',
            description: '压缩图像文件大小',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' },
                { name: 'quality', type: 'number', required: false, description: '压缩质量 0-1，默认0.8' },
                { name: 'maxSize', type: 'number', required: false, description: '最大文件大小（字节）' }
            ],
            examples: {
                js: `// 压缩图像\nconst file = document.querySelector('#upload').files[0];\ncompressImage(file, 0.7)\n  .then(compressedBlob => {\n    console.log('原始大小:', file.size);\n    console.log('压缩后大小:', compressedBlob.size);\n    \n    // 上传压缩后的图像\n    const formData = new FormData();\n    formData.append('image', compressedBlob);\n    fetch('/upload', { method: 'POST', body: formData });\n  });\n\n// 限制文件大小\ncompressImage(file, 0.8, 500 * 1024) // 限制500KB\n  .then(result => {\n    if (result.size <= 500 * 1024) {\n      console.log('压缩成功，符合大小要求');\n    }\n  });`,
                ts: `import { compressImage } from 'general-method-utils';\n\nconst file = (document.querySelector('#upload') as HTMLInputElement).files?.[0];\nif (file) {\n  compressImage(file, 0.7)\n    .then((compressedBlob: Blob) => {\n      console.log('原始大小:', file.size);\n      console.log('压缩后大小:', compressedBlob.size);\n    });\n\n  compressImage(file, 0.8, 500 * 1024)\n    .then((result: Blob) => {\n      if (result.size <= 500 * 1024) {\n        console.log('压缩成功');\n      }\n    });\n}`
            },
            demo: true
        },
        cropImage: {
            name: 'cropImage',
            description: '裁剪图像',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' },
                { name: 'x', type: 'number', required: true, description: '裁剪起始X坐标' },
                { name: 'y', type: 'number', required: true, description: '裁剪起始Y坐标' },
                { name: 'width', type: 'number', required: true, description: '裁剪宽度' },
                { name: 'height', type: 'number', required: true, description: '裁剪高度' }
            ],
            examples: {
                js: `// 裁剪图像\nconst img = document.querySelector('#originalImage');\ncropImage(img, 100, 50, 300, 200)\n  .then(croppedDataUrl => {\n    const preview = document.querySelector('#preview');\n    preview.src = croppedDataUrl;\n  });\n\n// 头像裁剪\nfunction cropAvatar(imageFile, cropData) {\n  return cropImage(\n    imageFile,\n    cropData.x,\n    cropData.y,\n    cropData.width,\n    cropData.height\n  ).then(croppedImage => {\n    // 调整为标准头像尺寸\n    return resizeImage(croppedImage, 150, 150);\n  });\n}\n\n// 批量裁剪\nconst cropAreas = [\n  { x: 0, y: 0, width: 200, height: 200 },\n  { x: 200, y: 0, width: 200, height: 200 }\n];\n\nPromise.all(\n  cropAreas.map(area => \n    cropImage(img, area.x, area.y, area.width, area.height)\n  )\n).then(croppedImages => {\n  console.log('所有裁剪完成');\n});`,
                ts: `import { cropImage, resizeImage } from 'general-method-utils';\n\nconst img = document.querySelector('#originalImage') as HTMLImageElement;\ncropImage(img, 100, 50, 300, 200)\n  .then((croppedDataUrl: string) => {\n    const preview = document.querySelector('#preview') as HTMLImageElement;\n    preview.src = croppedDataUrl;\n  });\n\ninterface CropData {\n  x: number;\n  y: number;\n  width: number;\n  height: number;\n}\n\nfunction cropAvatar(imageFile: File, cropData: CropData): Promise<string> {\n  return cropImage(\n    imageFile,\n    cropData.x,\n    cropData.y,\n    cropData.width,\n    cropData.height\n  ).then(croppedImage => {\n    return resizeImage(croppedImage, 150, 150);\n  });\n}`
            },
            demo: true
        },
        addWatermark: {
            name: 'addWatermark',
            description: '为图像添加水印',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' },
                { name: 'watermark', type: 'string|HTMLImageElement', required: true, description: '水印文字或图像' },
                { name: 'options', type: 'object', required: false, description: '水印选项' }
            ],
            examples: {
                js: `// 添加文字水印\nconst img = document.querySelector('#photo');\naddWatermark(img, 'Copyright © 2024', {\n  position: 'bottom-right',\n  fontSize: 16,\n  color: 'rgba(255, 255, 255, 0.8)',\n  padding: 20\n}).then(watermarkedImage => {\n  document.body.appendChild(watermarkedImage);\n});\n\n// 添加图像水印\nconst logoImg = document.querySelector('#logo');\naddWatermark(img, logoImg, {\n  position: 'top-left',\n  opacity: 0.5,\n  scale: 0.3\n});\n\n// 批量添加水印\nconst images = document.querySelectorAll('.gallery img');\nimages.forEach(async (img) => {\n  const watermarked = await addWatermark(img, 'My Gallery');\n  img.parentNode.replaceChild(watermarked, img);\n});`,
                ts: `import { addWatermark } from 'general-method-utils';\n\ninterface WatermarkOptions {\n  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';\n  fontSize?: number;\n  color?: string;\n  opacity?: number;\n  padding?: number;\n  scale?: number;\n}\n\nconst img = document.querySelector('#photo') as HTMLImageElement;\naddWatermark(img, 'Copyright © 2024', {\n  position: 'bottom-right',\n  fontSize: 16,\n  color: 'rgba(255, 255, 255, 0.8)',\n  padding: 20\n}).then((watermarkedImage: HTMLImageElement) => {\n  document.body.appendChild(watermarkedImage);\n});`
            },
            demo: true
        },
        convertFormat: {
            name: 'convertFormat',
            description: '转换图像格式',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' },
                { name: 'format', type: 'string', required: true, description: '目标格式：jpeg、png、webp' },
                { name: 'quality', type: 'number', required: false, description: '图像质量 0-1' }
            ],
            examples: {
                js: `// 转换图像格式\nconst pngFile = document.querySelector('#upload').files[0];\n\n// PNG转JPEG\nconvertFormat(pngFile, 'jpeg', 0.9)\n  .then(jpegBlob => {\n    console.log('转换完成');\n    downloadFile(jpegBlob, 'converted.jpg');\n  });\n\n// 转换为WebP格式\nconvertFormat(pngFile, 'webp', 0.8)\n  .then(webpBlob => {\n    console.log('WebP转换完成，文件更小');\n  });\n\n// 批量格式转换\nconst files = Array.from(fileInput.files);\nconst convertPromises = files.map(file => \n  convertFormat(file, 'webp', 0.8)\n);\n\nPromise.all(convertPromises)\n  .then(convertedFiles => {\n    console.log('批量转换完成');\n    convertedFiles.forEach((blob, index) => {\n      downloadFile(blob, \`converted_\${index}.webp\`);\n    });\n  });`,
                ts: `import { convertFormat } from 'general-method-utils';\n\nconst pngFile = (document.querySelector('#upload') as HTMLInputElement).files?.[0];\n\nif (pngFile) {\n  convertFormat(pngFile, 'jpeg', 0.9)\n    .then((jpegBlob: Blob) => {\n      console.log('转换完成');\n      downloadFile(jpegBlob, 'converted.jpg');\n    });\n\n  convertFormat(pngFile, 'webp', 0.8)\n    .then((webpBlob: Blob) => {\n      console.log('WebP转换完成');\n    });\n}`
            },
            demo: true
        },
        getImageInfo: {
            name: 'getImageInfo',
            description: '获取图像信息',
            params: [
                { name: 'image', type: 'HTMLImageElement|File', required: true, description: '图像元素或文件' }
            ],
            examples: {
                js: `// 获取图像信息\nconst img = document.querySelector('#myImage');\ngetImageInfo(img)\n  .then(info => {\n    console.log('宽度:', info.width);\n    console.log('高度:', info.height);\n    console.log('文件大小:', info.size);\n    console.log('格式:', info.format);\n    console.log('颜色深度:', info.colorDepth);\n  });\n\n// 文件上传前检查\nfileInput.addEventListener('change', async (e) => {\n  const file = e.target.files[0];\n  const info = await getImageInfo(file);\n  \n  if (info.width > 4000 || info.height > 4000) {\n    alert('图像尺寸过大，请选择较小的图像');\n    return;\n  }\n  \n  if (info.size > 5 * 1024 * 1024) {\n    alert('文件大小超过5MB限制');\n    return;\n  }\n  \n  processImage(file);\n});`,
                ts: `import { getImageInfo } from 'general-method-utils';\n\ninterface ImageInfo {\n  width: number;\n  height: number;\n  size: number;\n  format: string;\n  colorDepth: number;\n}\n\nconst img = document.querySelector('#myImage') as HTMLImageElement;\ngetImageInfo(img)\n  .then((info: ImageInfo) => {\n    console.log('宽度:', info.width);\n    console.log('高度:', info.height);\n    console.log('文件大小:', info.size);\n  });`
            },
            demo: true
        }
    }
};