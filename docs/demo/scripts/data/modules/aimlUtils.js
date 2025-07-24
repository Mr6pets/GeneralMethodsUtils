// AI/ML 集成工具模块
export default {
    title: 'AI/ML 集成工具',
    icon: 'fas fa-robot',
    methods: {
        chat: {
            name: 'chat',
            description: 'AI 聊天对话，支持多种模型和配置',
            params: [
                { name: 'messages', type: 'Array<ChatMessage>', required: true, description: '对话消息数组' },
                { name: 'options', type: 'AIModelOptions', required: false, description: '模型配置选项' }
            ],
            examples: {
                js: `// 基础聊天对话\nconst response = await aimlUtils.chat([\n  { role: 'user', content: '你好，请介绍一下人工智能' }\n], {\n  model: 'gpt-3.5-turbo',\n  temperature: 0.7,\n  maxTokens: 1000\n});\n\nconsole.log(response.content);\n\n// 多轮对话\nconst conversation = [\n  { role: 'user', content: '什么是机器学习？' },\n  { role: 'assistant', content: '机器学习是人工智能的一个分支...' },\n  { role: 'user', content: '能举个例子吗？' }\n];\n\nconst reply = await aimlUtils.chat(conversation);`,
                ts: `import { aimlUtils, ChatMessage, AIModelOptions } from 'general-method-utils';\n\n// 基础聊天对话\nconst messages: ChatMessage[] = [\n  { role: 'user', content: '你好，请介绍一下人工智能' }\n];\n\nconst options: AIModelOptions = {\n  model: 'gpt-3.5-turbo',\n  temperature: 0.7,\n  maxTokens: 1000\n};\n\nconst response = await aimlUtils.chat(messages, options);\nconsole.log(response.content);`
            },
            demo: true
        },
        analyzeImage: {
            name: 'analyzeImage',
            description: '图像分析，识别对象、文本、人脸等',
            params: [
                { name: 'imageData', type: 'File | string | ArrayBuffer', required: true, description: '图像数据' },
                { name: 'options', type: 'ImageAnalysisOptions', required: false, description: '分析选项' }
            ],
            examples: {
                js: `// 分析上传的图片\nconst fileInput = document.getElementById('imageInput');\nconst file = fileInput.files[0];\n\nconst analysis = await aimlUtils.analyzeImage(file, {\n  features: ['objects', 'text', 'faces'],\n  confidence: 0.8\n});\n\nconsole.log('检测到的对象:', analysis.objects);\nconsole.log('识别的文本:', analysis.text);\nconsole.log('人脸信息:', analysis.faces);\n\n// 分析网络图片\nconst webImageAnalysis = await aimlUtils.analyzeImage(\n  'https://example.com/image.jpg',\n  { features: ['objects'] }\n);`,
                ts: `import { aimlUtils, ImageAnalysisOptions } from 'general-method-utils';\n\n// 分析上传的图片\nconst fileInput = document.getElementById('imageInput') as HTMLInputElement;\nconst file = fileInput.files?.[0];\n\nif (file) {\n  const options: ImageAnalysisOptions = {\n    features: ['objects', 'text', 'faces'],\n    confidence: 0.8\n  };\n  \n  const analysis = await aimlUtils.analyzeImage(file, options);\n  console.log('检测到的对象:', analysis.objects);\n}`
            },
            demo: true
        },
        generateText: {
            name: 'generateText',
            description: '基于提示词生成文本内容',
            params: [
                { name: 'prompt', type: 'string', required: true, description: '提示词' },
                { name: 'options', type: 'TextGenerationOptions', required: false, description: '生成选项' }
            ],
            examples: {
                js: `// 生成创意文本\nconst story = await aimlUtils.generateText(\n  '写一个关于时间旅行的短故事',\n  {\n    maxLength: 500,\n    temperature: 0.8,\n    style: 'creative'\n  }\n);\nconsole.log(story);\n\n// 生成技术文档\nconst docs = await aimlUtils.generateText(\n  '解释什么是RESTful API',\n  {\n    maxLength: 300,\n    temperature: 0.3,\n    style: 'technical'\n  }\n);`,
                ts: `import { aimlUtils, TextGenerationOptions } from 'general-method-utils';\n\n// 生成创意文本\nconst options: TextGenerationOptions = {\n  maxLength: 500,\n  temperature: 0.8,\n  style: 'creative'\n};\n\nconst story: string = await aimlUtils.generateText(\n  '写一个关于时间旅行的短故事',\n  options\n);\nconsole.log(story);`
            },
            demo: true
        },
        translateText: {
            name: 'translateText',
            description: '多语言文本翻译',
            params: [
                { name: 'text', type: 'string', required: true, description: '要翻译的文本' },
                { name: 'targetLanguage', type: 'string', required: true, description: '目标语言代码' },
                { name: 'sourceLanguage', type: 'string', required: false, description: '源语言代码，默认自动检测' }
            ],
            examples: {
                js: `// 翻译文本\nconst translated = await aimlUtils.translateText(\n  'Hello, how are you?',\n  'zh-CN'\n);\nconsole.log(translated); // '你好，你好吗？'\n\n// 指定源语言\nconst result = await aimlUtils.translateText(\n  'Bonjour le monde',\n  'en',\n  'fr'\n);\nconsole.log(result); // 'Hello world'\n\n// 批量翻译\nconst texts = ['Hello', 'Goodbye', 'Thank you'];\nconst translations = await Promise.all(\n  texts.map(text => aimlUtils.translateText(text, 'zh-CN'))\n);`,
                ts: `import { aimlUtils } from 'general-method-utils';\n\n// 翻译文本\nconst translated: string = await aimlUtils.translateText(\n  'Hello, how are you?',\n  'zh-CN'\n);\nconsole.log(translated);\n\n// 类型安全的语言代码\ntype LanguageCode = 'en' | 'zh-CN' | 'fr' | 'de' | 'ja';\nconst targetLang: LanguageCode = 'zh-CN';`
            },
            demo: true
        }
    }
};