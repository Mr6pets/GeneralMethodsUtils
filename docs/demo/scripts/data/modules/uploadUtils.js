// 文件上传工具模块
export default {
    title: '文件上传工具',
    icon: 'fas fa-upload',
    methods: {
        uploadFile: {
            name: 'uploadFile',
            description: '上传单个文件',
            params: [
                { name: 'file', type: 'File', required: true, description: '要上传的文件' },
                { name: 'url', type: 'string', required: true, description: '上传URL' },
                { name: 'options', type: 'object', required: false, description: '上传选项' }
            ],
            examples: {
                js: `// 基本文件上传\nconst fileInput = document.getElementById('fileInput');\nconst file = fileInput.files[0];\n\nuploadFile(file, '/api/upload')\n  .then(response => {\n    console.log('上传成功:', response);\n  })\n  .catch(error => {\n    console.error('上传失败:', error);\n  });\n\n// 带进度的上传\nuploadFile(file, '/api/upload', {\n  onProgress: (progress) => {\n    console.log(\`上传进度: \${progress.percentage}%\`);\n    updateProgressBar(progress.percentage);\n  },\n  onSuccess: (response) => {\n    console.log('上传完成:', response);\n    showSuccessMessage('文件上传成功！');\n  },\n  onError: (error) => {\n    console.error('上传错误:', error);\n    showErrorMessage('文件上传失败');\n  }\n});\n\n// 带自定义头部的上传\nuploadFile(file, '/api/upload', {\n  headers: {\n    'Authorization': \`Bearer \${token}\`,\n    'X-Upload-Type': 'avatar'\n  },\n  data: {\n    userId: '123',\n    category: 'profile'\n  }\n});\n\n// 分片上传大文件\nuploadFile(largeFile, '/api/upload/chunked', {\n  chunked: true,\n  chunkSize: 1024 * 1024, // 1MB per chunk\n  onChunkProgress: (chunkIndex, totalChunks) => {\n    console.log(\`分片进度: \${chunkIndex + 1}/\${totalChunks}\`);\n  }\n});`,
                ts: `import { uploadFile } from 'general-method-utils';\n\ninterface UploadOptions {\n  onProgress?: (progress: UploadProgress) => void;\n  onSuccess?: (response: any) => void;\n  onError?: (error: Error) => void;\n  headers?: Record<string, string>;\n  data?: Record<string, any>;\n  chunked?: boolean;\n  chunkSize?: number;\n  onChunkProgress?: (chunkIndex: number, totalChunks: number) => void;\n}\n\ninterface UploadProgress {\n  loaded: number;\n  total: number;\n  percentage: number;\n}\n\n// 基本文件上传\nconst fileInput = document.getElementById('fileInput') as HTMLInputElement;\nconst file: File = fileInput.files![0];\n\nuploadFile(file, '/api/upload')\n  .then((response: any) => {\n    console.log('上传成功:', response);\n  })\n  .catch((error: Error) => {\n    console.error('上传失败:', error);\n  });\n\n// 带进度的上传\nuploadFile(file, '/api/upload', {\n  onProgress: (progress: UploadProgress) => {\n    console.log(\`上传进度: \${progress.percentage}%\`);\n  }\n} as UploadOptions);`
            },
            demo: true
        },
        uploadMultiple: {
            name: 'uploadMultiple',
            description: '上传多个文件',
            params: [
                { name: 'files', type: 'FileList|File[]', required: true, description: '要上传的文件列表' },
                { name: 'url', type: 'string', required: true, description: '上传URL' },
                { name: 'options', type: 'object', required: false, description: '上传选项' }
            ],
            examples: {
                js: `// 上传多个文件\nconst fileInput = document.getElementById('multipleFiles');\nconst files = fileInput.files;\n\nuploadMultiple(files, '/api/upload/multiple')\n  .then(responses => {\n    console.log('所有文件上传完成:', responses);\n  })\n  .catch(error => {\n    console.error('上传失败:', error);\n  });\n\n// 并发上传控制\nuploadMultiple(files, '/api/upload/multiple', {\n  concurrent: 3, // 最多同时上传3个文件\n  onFileProgress: (file, progress) => {\n    console.log(\`\${file.name}: \${progress.percentage}%\`);\n  },\n  onFileComplete: (file, response) => {\n    console.log(\`\${file.name} 上传完成\`);\n  },\n  onAllComplete: (responses) => {\n    console.log('所有文件上传完成:', responses);\n  }\n});\n\n// 批量上传到不同目录\nconst imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));\nconst documentFiles = Array.from(files).filter(f => f.type === 'application/pdf');\n\nPromise.all([\n  uploadMultiple(imageFiles, '/api/upload/images'),\n  uploadMultiple(documentFiles, '/api/upload/documents')\n]).then(([imageResponses, docResponses]) => {\n  console.log('图片上传:', imageResponses);\n  console.log('文档上传:', docResponses);\n});\n\n// 失败重试\nuploadMultiple(files, '/api/upload/multiple', {\n  retry: 3,\n  retryDelay: 1000,\n  onRetry: (file, attempt) => {\n    console.log(\`重试上传 \${file.name}, 第\${attempt}次尝试\`);\n  }\n});`,
                ts: `import { uploadMultiple } from 'general-method-utils';\n\ninterface MultipleUploadOptions {\n  concurrent?: number;\n  onFileProgress?: (file: File, progress: UploadProgress) => void;\n  onFileComplete?: (file: File, response: any) => void;\n  onAllComplete?: (responses: any[]) => void;\n  retry?: number;\n  retryDelay?: number;\n  onRetry?: (file: File, attempt: number) => void;\n}\n\n// 上传多个文件\nconst fileInput = document.getElementById('multipleFiles') as HTMLInputElement;\nconst files: FileList = fileInput.files!;\n\nuploadMultiple(files, '/api/upload/multiple')\n  .then((responses: any[]) => {\n    console.log('所有文件上传完成:', responses);\n  })\n  .catch((error: Error) => {\n    console.error('上传失败:', error);\n  });\n\n// 并发上传控制\nuploadMultiple(files, '/api/upload/multiple', {\n  concurrent: 3,\n  onFileProgress: (file: File, progress: UploadProgress) => {\n    console.log(\`\${file.name}: \${progress.percentage}%\`);\n  }\n} as MultipleUploadOptions);`
            },
            demo: true
        },
        uploadWithPreview: {
            name: 'uploadWithPreview',
            description: '带预览的文件上传',
            params: [
                { name: 'file', type: 'File', required: true, description: '要上传的文件' },
                { name: 'previewContainer', type: 'HTMLElement', required: true, description: '预览容器' },
                { name: 'options', type: 'object', required: false, description: '上传选项' }
            ],
            examples: {
                js: `// 图片上传预览\nconst fileInput = document.getElementById('imageInput');\nconst previewContainer = document.getElementById('preview');\n\nfileInput.addEventListener('change', (e) => {\n  const file = e.target.files[0];\n  if (file && file.type.startsWith('image/')) {\n    uploadWithPreview(file, previewContainer, {\n      url: '/api/upload/image',\n      previewType: 'image',\n      maxPreviewSize: { width: 300, height: 300 },\n      onPreviewReady: (previewUrl) => {\n        console.log('预览准备完成:', previewUrl);\n      },\n      onUploadStart: () => {\n        showLoadingSpinner();\n      },\n      onUploadComplete: (response) => {\n        hideLoadingSpinner();\n        console.log('上传完成:', response);\n      }\n    });\n  }\n});\n\n// 视频上传预览\nconst videoFile = document.getElementById('videoInput').files[0];\nuploadWithPreview(videoFile, previewContainer, {\n  url: '/api/upload/video',\n  previewType: 'video',\n  generateThumbnail: true,\n  thumbnailTime: 5, // 5秒处的缩略图\n  onThumbnailGenerated: (thumbnailUrl) => {\n    console.log('缩略图生成:', thumbnailUrl);\n  }\n});\n\n// 文档上传预览\nconst pdfFile = document.getElementById('pdfInput').files[0];\nuploadWithPreview(pdfFile, previewContainer, {\n  url: '/api/upload/document',\n  previewType: 'document',\n  showFileInfo: true,\n  allowEdit: true,\n  onEdit: (editedFile) => {\n    console.log('文件已编辑:', editedFile);\n  }\n});`,
                ts: `import { uploadWithPreview } from 'general-method-utils';\n\ninterface PreviewUploadOptions {\n  url: string;\n  previewType: 'image' | 'video' | 'document' | 'audio';\n  maxPreviewSize?: { width: number; height: number };\n  generateThumbnail?: boolean;\n  thumbnailTime?: number;\n  showFileInfo?: boolean;\n  allowEdit?: boolean;\n  onPreviewReady?: (previewUrl: string) => void;\n  onUploadStart?: () => void;\n  onUploadComplete?: (response: any) => void;\n  onThumbnailGenerated?: (thumbnailUrl: string) => void;\n  onEdit?: (editedFile: File) => void;\n}\n\n// 图片上传预览\nconst fileInput = document.getElementById('imageInput') as HTMLInputElement;\nconst previewContainer = document.getElementById('preview') as HTMLElement;\n\nfileInput.addEventListener('change', (e: Event) => {\n  const target = e.target as HTMLInputElement;\n  const file = target.files![0];\n  \n  if (file && file.type.startsWith('image/')) {\n    uploadWithPreview(file, previewContainer, {\n      url: '/api/upload/image',\n      previewType: 'image',\n      maxPreviewSize: { width: 300, height: 300 }\n    } as PreviewUploadOptions);\n  }\n});`
            },
            demo: true
        },
        resumableUpload: {
            name: 'resumableUpload',
            description: '可恢复的文件上传',
            params: [
                { name: 'file', type: 'File', required: true, description: '要上传的文件' },
                { name: 'url', type: 'string', required: true, description: '上传URL' },
                { name: 'options', type: 'object', required: false, description: '上传选项' }
            ],
            examples: {
                js: `// 可恢复上传\nconst largeFile = document.getElementById('largeFileInput').files[0];\n\nconst uploadId = resumableUpload(largeFile, '/api/upload/resumable', {\n  chunkSize: 1024 * 1024, // 1MB chunks\n  onProgress: (progress) => {\n    console.log(\`上传进度: \${progress.percentage}%\`);\n    updateProgressBar(progress.percentage);\n  },\n  onPause: () => {\n    console.log('上传已暂停');\n    showPauseButton(false);\n    showResumeButton(true);\n  },\n  onResume: () => {\n    console.log('上传已恢复');\n    showPauseButton(true);\n    showResumeButton(false);\n  },\n  onComplete: (response) => {\n    console.log('上传完成:', response);\n    hideProgressBar();\n  },\n  onError: (error) => {\n    console.error('上传错误:', error);\n    showRetryButton(true);\n  }\n});\n\n// 暂停上传\ndocument.getElementById('pauseBtn').addEventListener('click', () => {\n  pauseUpload(uploadId);\n});\n\n// 恢复上传\ndocument.getElementById('resumeBtn').addEventListener('click', () => {\n  resumeUpload(uploadId);\n});\n\n// 取消上传\ndocument.getElementById('cancelBtn').addEventListener('click', () => {\n  cancelUpload(uploadId);\n});\n\n// 检查上传状态\nconst status = getUploadStatus(uploadId);\nconsole.log('上传状态:', status);\n// 输出: { id: 'upload_123', progress: 45, status: 'uploading', chunks: [...] }`,
                ts: `import { resumableUpload, pauseUpload, resumeUpload, cancelUpload, getUploadStatus } from 'general-method-utils';\n\ninterface ResumableUploadOptions {\n  chunkSize?: number;\n  onProgress?: (progress: UploadProgress) => void;\n  onPause?: () => void;\n  onResume?: () => void;\n  onComplete?: (response: any) => void;\n  onError?: (error: Error) => void;\n}\n\ninterface UploadStatus {\n  id: string;\n  progress: number;\n  status: 'uploading' | 'paused' | 'completed' | 'error';\n  chunks: number[];\n}\n\n// 可恢复上传\nconst largeFile = (document.getElementById('largeFileInput') as HTMLInputElement).files![0];\n\nconst uploadId: string = resumableUpload(largeFile, '/api/upload/resumable', {\n  chunkSize: 1024 * 1024,\n  onProgress: (progress: UploadProgress) => {\n    console.log(\`上传进度: \${progress.percentage}%\`);\n  }\n} as ResumableUploadOptions);\n\n// 检查上传状态\nconst status: UploadStatus = getUploadStatus(uploadId);\nconsole.log('上传状态:', status);`
            },
            demo: true
        },
        validateFile: {
            name: 'validateFile',
            description: '验证文件',
            params: [
                { name: 'file', type: 'File', required: true, description: '要验证的文件' },
                { name: 'rules', type: 'object', required: true, description: '验证规则' }
            ],
            examples: {
                js: `// 基本文件验证\nconst file = document.getElementById('fileInput').files[0];\n\nconst validation = validateFile(file, {\n  maxSize: 5 * 1024 * 1024, // 5MB\n  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],\n  minWidth: 100,\n  minHeight: 100,\n  maxWidth: 2000,\n  maxHeight: 2000\n});\n\nif (validation.valid) {\n  console.log('文件验证通过');\n  proceedWithUpload(file);\n} else {\n  console.error('文件验证失败:', validation.errors);\n  showValidationErrors(validation.errors);\n}\n\n// 复杂验证规则\nconst documentValidation = validateFile(file, {\n  maxSize: 10 * 1024 * 1024, // 10MB\n  allowedTypes: ['application/pdf', 'application/msword'],\n  allowedExtensions: ['.pdf', '.doc', '.docx'],\n  customValidator: (file) => {\n    // 自定义验证逻辑\n    if (file.name.includes('temp')) {\n      return { valid: false, message: '不允许临时文件' };\n    }\n    return { valid: true };\n  }\n});\n\n// 批量验证\nconst files = Array.from(document.getElementById('multipleFiles').files);\nconst validations = files.map(file => ({\n  file,\n  validation: validateFile(file, {\n    maxSize: 2 * 1024 * 1024,\n    allowedTypes: ['image/*']\n  })\n}));\n\nconst validFiles = validations\n  .filter(v => v.validation.valid)\n  .map(v => v.file);\n\nconst invalidFiles = validations\n  .filter(v => !v.validation.valid);\n\nconsole.log(\`有效文件: \${validFiles.length}\`);\nconsole.log(\`无效文件: \${invalidFiles.length}\`);`,
                ts: `import { validateFile } from 'general-method-utils';\n\ninterface ValidationRules {\n  maxSize?: number;\n  minSize?: number;\n  allowedTypes?: string[];\n  allowedExtensions?: string[];\n  minWidth?: number;\n  minHeight?: number;\n  maxWidth?: number;\n  maxHeight?: number;\n  customValidator?: (file: File) => ValidationResult;\n}\n\ninterface ValidationResult {\n  valid: boolean;\n  errors?: string[];\n  message?: string;\n}\n\n// 基本文件验证\nconst file = (document.getElementById('fileInput') as HTMLInputElement).files![0];\n\nconst validation: ValidationResult = validateFile(file, {\n  maxSize: 5 * 1024 * 1024,\n  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],\n  minWidth: 100,\n  minHeight: 100\n} as ValidationRules);\n\nif (validation.valid) {\n  console.log('文件验证通过');\n} else {\n  console.error('文件验证失败:', validation.errors);\n}`
            },
            demo: true
        },
        compressFile: {
            name: 'compressFile',
            description: '压缩文件',
            params: [
                { name: 'file', type: 'File', required: true, description: '要压缩的文件' },
                { name: 'options', type: 'object', required: false, description: '压缩选项' }
            ],
            examples: {
                js: `// 图片压缩\nconst imageFile = document.getElementById('imageInput').files[0];\n\ncompressFile(imageFile, {\n  type: 'image',\n  quality: 0.8, // 80%质量\n  maxWidth: 1920,\n  maxHeight: 1080,\n  format: 'jpeg'\n}).then(compressedFile => {\n  console.log('原始大小:', imageFile.size);\n  console.log('压缩后大小:', compressedFile.size);\n  console.log('压缩比:', ((1 - compressedFile.size / imageFile.size) * 100).toFixed(2) + '%');\n  \n  // 上传压缩后的文件\n  uploadFile(compressedFile, '/api/upload');\n});\n\n// 视频压缩\nconst videoFile = document.getElementById('videoInput').files[0];\n\ncompressFile(videoFile, {\n  type: 'video',\n  quality: 'medium',\n  resolution: '720p',\n  bitrate: '1000k',\n  onProgress: (progress) => {\n    console.log(\`压缩进度: \${progress}%\`);\n  }\n}).then(compressedVideo => {\n  console.log('视频压缩完成');\n});\n\n// 文档压缩\nconst pdfFile = document.getElementById('pdfInput').files[0];\n\ncompressFile(pdfFile, {\n  type: 'document',\n  compressionLevel: 'high',\n  removeMetadata: true,\n  optimizeImages: true\n}).then(compressedPdf => {\n  console.log('PDF压缩完成');\n});\n\n// 批量压缩\nconst files = Array.from(document.getElementById('multipleFiles').files);\nconst imageFiles = files.filter(f => f.type.startsWith('image/'));\n\nPromise.all(\n  imageFiles.map(file => \n    compressFile(file, { quality: 0.7, maxWidth: 1200 })\n  )\n).then(compressedFiles => {\n  console.log('批量压缩完成:', compressedFiles);\n});`,
                ts: `import { compressFile } from 'general-method-utils';\n\ninterface CompressionOptions {\n  type: 'image' | 'video' | 'document';\n  quality?: number | 'low' | 'medium' | 'high';\n  maxWidth?: number;\n  maxHeight?: number;\n  format?: string;\n  resolution?: string;\n  bitrate?: string;\n  compressionLevel?: 'low' | 'medium' | 'high';\n  removeMetadata?: boolean;\n  optimizeImages?: boolean;\n  onProgress?: (progress: number) => void;\n}\n\n// 图片压缩\nconst imageFile = (document.getElementById('imageInput') as HTMLInputElement).files![0];\n\ncompressFile(imageFile, {\n  type: 'image',\n  quality: 0.8,\n  maxWidth: 1920,\n  maxHeight: 1080,\n  format: 'jpeg'\n} as CompressionOptions).then((compressedFile: File) => {\n  console.log('原始大小:', imageFile.size);\n  console.log('压缩后大小:', compressedFile.size);\n});`
            },
            demo: true
        }
    }
};