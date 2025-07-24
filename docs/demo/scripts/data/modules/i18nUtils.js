// 国际化工具模块
export default {
    title: '国际化工具',
    icon: 'fas fa-globe',
    methods: {
        I18n: {
            name: 'I18n',
            description: '国际化管理器，提供多语言支持',
            params: [
                { name: 'options', type: 'object', required: false, description: '国际化配置选项' }
            ],
            examples: {
                js: `// 创建国际化实例\nconst i18n = new I18n({\n  locale: 'zh-CN',\n  fallback: 'en',\n  messages: {\n    'zh-CN': {\n      hello: '你好',\n      welcome: '欢迎使用 {name}',\n      user: {\n        profile: '个人资料',\n        settings: '设置'\n      }\n    },\n    'en': {\n      hello: 'Hello',\n      welcome: 'Welcome to {name}',\n      user: {\n        profile: 'Profile',\n        settings: 'Settings'\n      }\n    }\n  }\n});\n\n// 获取翻译\nconsole.log(i18n.t('hello')); // '你好'\nconsole.log(i18n.t('welcome', { name: 'MyApp' })); // '欢迎使用 MyApp'`,
                ts: `import { I18n } from 'general-method-utils';\n\ninterface Messages {\n  [key: string]: any;\n}\n\nconst i18n = new I18n({\n  locale: 'zh-CN',\n  fallback: 'en',\n  messages: {\n    'zh-CN': {\n      hello: '你好',\n      welcome: '欢迎使用 {name}'\n    }\n  }\n});\n\nconst greeting: string = i18n.t('hello');`
            },
            demo: true
        },
        translate: {
            name: 'translate',
            description: '翻译指定的键值',
            params: [
                { name: 'key', type: 'string', required: true, description: '翻译键' },
                { name: 'params', type: 'object', required: false, description: '插值参数' },
                { name: 'locale', type: 'string', required: false, description: '指定语言' }
            ],
            examples: {
                js: `// 基本翻译\nconst message = translate('user.welcome');\nconsole.log(message);\n\n// 带参数的翻译\nconst greeting = translate('hello_user', { name: 'John' });\nconsole.log(greeting); // 'Hello, John!'\n\n// 指定语言翻译\nconst frenchGreeting = translate('hello', {}, 'fr');\nconsole.log(frenchGreeting);\n\n// 复数形式\nconst itemCount = translate('item_count', { count: 5 });\nconsole.log(itemCount); // '5 items'`,
                ts: `import { translate } from 'general-method-utils';\n\nconst message: string = translate('user.welcome');\nconst greeting: string = translate('hello_user', { name: 'John' });\nconst frenchGreeting: string = translate('hello', {}, 'fr');`
            },
            demo: true
        },
        setLocale: {
            name: 'setLocale',
            description: '设置当前语言',
            params: [
                { name: 'locale', type: 'string', required: true, description: '语言代码' }
            ],
            examples: {
                js: `// 切换语言\nsetLocale('en');\nconsole.log(translate('hello')); // 'Hello'\n\nsetLocale('zh-CN');\nconsole.log(translate('hello')); // '你好'\n\n// 语言切换器\nconst languageSelector = document.querySelector('#language');\nlanguageSelector.addEventListener('change', (e) => {\n  setLocale(e.target.value);\n  updatePageContent();\n});\n\nfunction updatePageContent() {\n  document.querySelectorAll('[data-i18n]').forEach(el => {\n    const key = el.getAttribute('data-i18n');\n    el.textContent = translate(key);\n  });\n}`,
                ts: `import { setLocale, translate } from 'general-method-utils';\n\nsetLocale('en');\nconst message: string = translate('hello');\n\nfunction updatePageContent(): void {\n  document.querySelectorAll('[data-i18n]').forEach(el => {\n    const key = el.getAttribute('data-i18n');\n    if (key) {\n      el.textContent = translate(key);\n    }\n  });\n}`
            },
            demo: true
        },
        loadMessages: {
            name: 'loadMessages',
            description: '加载语言包',
            params: [
                { name: 'locale', type: 'string', required: true, description: '语言代码' },
                { name: 'messages', type: 'object', required: true, description: '语言包数据' }
            ],
            examples: {
                js: `// 动态加载语言包\nloadMessages('es', {\n  hello: 'Hola',\n  goodbye: 'Adiós',\n  welcome: 'Bienvenido a {name}'\n});\n\n// 异步加载语言包\nasync function loadLanguagePack(locale) {\n  try {\n    const response = await fetch(\`/api/i18n/\${locale}.json\`);\n    const messages = await response.json();\n    loadMessages(locale, messages);\n    setLocale(locale);\n  } catch (error) {\n    console.error('加载语言包失败:', error);\n  }\n}\n\n// 懒加载语言包\nconst supportedLocales = ['en', 'zh-CN', 'es', 'fr'];\nsupportedLocales.forEach(locale => {\n  if (locale !== getCurrentLocale()) {\n    loadLanguagePack(locale);\n  }\n});`,
                ts: `import { loadMessages, setLocale } from 'general-method-utils';\n\nloadMessages('es', {\n  hello: 'Hola',\n  goodbye: 'Adiós',\n  welcome: 'Bienvenido a {name}'\n});\n\nasync function loadLanguagePack(locale: string): Promise<void> {\n  try {\n    const response = await fetch(\`/api/i18n/\${locale}.json\`);\n    const messages: Record<string, any> = await response.json();\n    loadMessages(locale, messages);\n    setLocale(locale);\n  } catch (error) {\n    console.error('加载语言包失败:', error);\n  }\n}`
            },
            demo: true
        },
        formatNumber: {
            name: 'formatNumber',
            description: '根据当前语言格式化数字',
            params: [
                { name: 'number', type: 'number', required: true, description: '要格式化的数字' },
                { name: 'options', type: 'object', required: false, description: '格式化选项' }
            ],
            examples: {
                js: `// 格式化数字\nsetLocale('zh-CN');\nconst price = formatNumber(1234.56, {\n  style: 'currency',\n  currency: 'CNY'\n});\nconsole.log(price); // '¥1,234.56'\n\n// 百分比格式\nconst percentage = formatNumber(0.85, {\n  style: 'percent'\n});\nconsole.log(percentage); // '85%'\n\n// 不同语言的数字格式\nsetLocale('en-US');\nconst usPrice = formatNumber(1234.56, {\n  style: 'currency',\n  currency: 'USD'\n});\nconsole.log(usPrice); // '$1,234.56'`,
                ts: `import { formatNumber, setLocale } from 'general-method-utils';\n\nsetLocale('zh-CN');\nconst price: string = formatNumber(1234.56, {\n  style: 'currency',\n  currency: 'CNY'\n});\n\nconst percentage: string = formatNumber(0.85, {\n  style: 'percent'\n});`
            },
            demo: true
        },
        formatDate: {
            name: 'formatDate',
            description: '根据当前语言格式化日期',
            params: [
                { name: 'date', type: 'Date', required: true, description: '要格式化的日期' },
                { name: 'options', type: 'object', required: false, description: '格式化选项' }
            ],
            examples: {
                js: `// 格式化日期\nconst date = new Date('2024-01-15');\n\nsetLocale('zh-CN');\nconst cnDate = formatDate(date, {\n  year: 'numeric',\n  month: 'long',\n  day: 'numeric'\n});\nconsole.log(cnDate); // '2024年1月15日'\n\nsetLocale('en-US');\nconst usDate = formatDate(date, {\n  year: 'numeric',\n  month: 'long',\n  day: 'numeric'\n});\nconsole.log(usDate); // 'January 15, 2024'\n\n// 相对时间\nconst relativeTime = formatDate(date, {\n  style: 'relative'\n});\nconsole.log(relativeTime); // '3 days ago'`,
                ts: `import { formatDate, setLocale } from 'general-method-utils';\n\nconst date: Date = new Date('2024-01-15');\n\nsetLocale('zh-CN');\nconst cnDate: string = formatDate(date, {\n  year: 'numeric',\n  month: 'long',\n  day: 'numeric'\n});\n\nconst relativeTime: string = formatDate(date, {\n  style: 'relative'\n});`
            },
            demo: true
        },
        detectLanguage: {
            name: 'detectLanguage',
            description: '检测用户首选语言',
            params: [
                { name: 'supportedLocales', type: 'array', required: false, description: '支持的语言列表' }
            ],
            examples: {
                js: `// 检测用户语言\nconst supportedLanguages = ['en', 'zh-CN', 'es', 'fr'];\nconst userLanguage = detectLanguage(supportedLanguages);\nconsole.log(userLanguage); // 'zh-CN'\n\n// 自动设置语言\nconst detectedLang = detectLanguage();\nif (detectedLang) {\n  setLocale(detectedLang);\n}\n\n// 语言回退机制\nfunction initializeLanguage() {\n  const saved = localStorage.getItem('preferred-language');\n  const detected = detectLanguage(['en', 'zh-CN', 'ja']);\n  const fallback = 'en';\n  \n  const locale = saved || detected || fallback;\n  setLocale(locale);\n}`,
                ts: `import { detectLanguage, setLocale } from 'general-method-utils';\n\nconst supportedLanguages: string[] = ['en', 'zh-CN', 'es', 'fr'];\nconst userLanguage: string | null = detectLanguage(supportedLanguages);\n\nfunction initializeLanguage(): void {\n  const saved = localStorage.getItem('preferred-language');\n  const detected = detectLanguage(['en', 'zh-CN', 'ja']);\n  const fallback = 'en';\n  \n  const locale = saved || detected || fallback;\n  setLocale(locale);\n}`
            },
            demo: true
        }
    }
};