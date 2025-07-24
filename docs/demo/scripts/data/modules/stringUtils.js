// 字符串工具模块
export default {
    title: '字符串工具',
    icon: 'fas fa-font',
    methods: {
        capitalize: {
            name: 'capitalize',
            description: '首字母大写',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 首字母大写\nconst result1 = capitalize('hello world');\nconsole.log(result1); // 'Hello world'\n\nconst result2 = capitalize('JAVASCRIPT');\nconsole.log(result2); // 'Javascript'\n\nconst result3 = capitalize('');\nconsole.log(result3); // ''\n\n// 处理多个单词\nconst sentence = 'the quick brown fox';\nconst capitalized = capitalize(sentence);\nconsole.log(capitalized); // 'The quick brown fox'\n\n// 处理特殊字符\nconst special = '123abc';\nconst result4 = capitalize(special);\nconsole.log(result4); // '123abc'`,
                ts: `import { capitalize } from 'general-method-utils';\n\n// 首字母大写\nconst result1: string = capitalize('hello world');\nconsole.log(result1); // 'Hello world'\n\nconst result2: string = capitalize('JAVASCRIPT');\nconsole.log(result2); // 'Javascript'\n\n// 处理多个单词\nconst sentence: string = 'the quick brown fox';\nconst capitalized: string = capitalize(sentence);\nconsole.log(capitalized); // 'The quick brown fox'`
            },
            demo: true
        },
        camelCase: {
            name: 'camelCase',
            description: '转换为驼峰命名',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 转换为驼峰命名\nconst result1 = camelCase('hello world');\nconsole.log(result1); // 'helloWorld'\n\nconst result2 = camelCase('user-name');\nconsole.log(result2); // 'userName'\n\nconst result3 = camelCase('first_name');\nconsole.log(result3); // 'firstName'\n\nconst result4 = camelCase('API_KEY');\nconsole.log(result4); // 'apiKey'\n\n// 处理多种分隔符\nconst mixed = 'user-profile_data.info';\nconst camelCased = camelCase(mixed);\nconsole.log(camelCased); // 'userProfileDataInfo'\n\n// 处理数字\nconst withNumbers = 'item-2-name';\nconst result5 = camelCase(withNumbers);\nconsole.log(result5); // 'item2Name'`,
                ts: `import { camelCase } from 'general-method-utils';\n\n// 转换为驼峰命名\nconst result1: string = camelCase('hello world');\nconsole.log(result1); // 'helloWorld'\n\nconst result2: string = camelCase('user-name');\nconsole.log(result2); // 'userName'\n\nconst result3: string = camelCase('first_name');\nconsole.log(result3); // 'firstName'\n\n// 处理多种分隔符\nconst mixed: string = 'user-profile_data.info';\nconst camelCased: string = camelCase(mixed);\nconsole.log(camelCased); // 'userProfileDataInfo'`
            },
            demo: true
        },
        kebabCase: {
            name: 'kebabCase',
            description: '转换为短横线命名',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 转换为短横线命名\nconst result1 = kebabCase('helloWorld');\nconsole.log(result1); // 'hello-world'\n\nconst result2 = kebabCase('firstName');\nconsole.log(result2); // 'first-name'\n\nconst result3 = kebabCase('user_profile');\nconsole.log(result3); // 'user-profile'\n\nconst result4 = kebabCase('API Key');\nconsole.log(result4); // 'api-key'\n\n// 处理复杂字符串\nconst complex = 'getUserProfileData';\nconst kebabCased = kebabCase(complex);\nconsole.log(kebabCased); // 'get-user-profile-data'\n\n// 处理已经是短横线的字符串\nconst existing = 'already-kebab-case';\nconst result5 = kebabCase(existing);\nconsole.log(result5); // 'already-kebab-case'`,
                ts: `import { kebabCase } from 'general-method-utils';\n\n// 转换为短横线命名\nconst result1: string = kebabCase('helloWorld');\nconsole.log(result1); // 'hello-world'\n\nconst result2: string = kebabCase('firstName');\nconsole.log(result2); // 'first-name'\n\nconst result3: string = kebabCase('user_profile');\nconsole.log(result3); // 'user-profile'\n\n// 处理复杂字符串\nconst complex: string = 'getUserProfileData';\nconst kebabCased: string = kebabCase(complex);\nconsole.log(kebabCased); // 'get-user-profile-data'`
            },
            demo: true
        },
        snakeCase: {
            name: 'snakeCase',
            description: '转换为下划线命名',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 转换为下划线命名\nconst result1 = snakeCase('helloWorld');\nconsole.log(result1); // 'hello_world'\n\nconst result2 = snakeCase('firstName');\nconsole.log(result2); // 'first_name'\n\nconst result3 = snakeCase('user-profile');\nconsole.log(result3); // 'user_profile'\n\nconst result4 = snakeCase('API Key');\nconsole.log(result4); // 'api_key'\n\n// 处理复杂字符串\nconst complex = 'getUserProfileData';\nconst snakeCased = snakeCase(complex);\nconsole.log(snakeCased); // 'get_user_profile_data'\n\n// 处理数字和特殊字符\nconst withNumbers = 'item2Name';\nconst result5 = snakeCase(withNumbers);\nconsole.log(result5); // 'item2_name'`,
                ts: `import { snakeCase } from 'general-method-utils';\n\n// 转换为下划线命名\nconst result1: string = snakeCase('helloWorld');\nconsole.log(result1); // 'hello_world'\n\nconst result2: string = snakeCase('firstName');\nconsole.log(result2); // 'first_name'\n\nconst result3: string = snakeCase('user-profile');\nconsole.log(result3); // 'user_profile'\n\n// 处理复杂字符串\nconst complex: string = 'getUserProfileData';\nconst snakeCased: string = snakeCase(complex);\nconsole.log(snakeCased); // 'get_user_profile_data'`
            },
            demo: true
        },
        truncate: {
            name: 'truncate',
            description: '截断字符串',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' },
                { name: 'length', type: 'number', required: true, description: '最大长度' },
                { name: 'suffix', type: 'string', required: false, description: '后缀，默认为"..."' }
            ],
            examples: {
                js: `// 基本截断\nconst result1 = truncate('Hello, World!', 10);\nconsole.log(result1); // 'Hello, Wor...'\n\n// 自定义后缀\nconst result2 = truncate('This is a long text', 10, '...');\nconsole.log(result2); // 'This is a...'\n\n// 无需截断\nconst result3 = truncate('Short', 10);\nconsole.log(result3); // 'Short'\n\n// 自定义后缀\nconst result4 = truncate('Very long content here', 15, ' [more]');\nconsole.log(result4); // 'Very long cont [more]'\n\n// 处理中文\nconst chinese = '这是一个很长的中文字符串内容';\nconst result5 = truncate(chinese, 8);\nconsole.log(result5); // '这是一个很长的中...'\n\n// 截断HTML内容\nconst html = '<p>This is a paragraph with <strong>bold</strong> text</p>';\nconst result6 = truncate(html, 20);\nconsole.log(result6); // '<p>This is a paragr...'`,
                ts: `import { truncate } from 'general-method-utils';\n\n// 基本截断\nconst result1: string = truncate('Hello, World!', 10);\nconsole.log(result1); // 'Hello, Wor...'\n\n// 自定义后缀\nconst result2: string = truncate('This is a long text', 10, '...');\nconsole.log(result2); // 'This is a...'\n\n// 无需截断\nconst result3: string = truncate('Short', 10);\nconsole.log(result3); // 'Short'\n\n// 自定义后缀\nconst result4: string = truncate('Very long content here', 15, ' [more]');\nconsole.log(result4); // 'Very long cont [more]'`
            },
            demo: true
        },
        slugify: {
            name: 'slugify',
            description: '转换为URL友好的字符串',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' },
                { name: 'options', type: 'object', required: false, description: '选项配置' }
            ],
            examples: {
                js: `// 基本转换\nconst result1 = slugify('Hello World!');\nconsole.log(result1); // 'hello-world'\n\n// 处理特殊字符\nconst result2 = slugify('This & That: A Guide');\nconsole.log(result2); // 'this-that-a-guide'\n\n// 处理中文\nconst result3 = slugify('你好世界');\nconsole.log(result3); // 'ni-hao-shi-jie'\n\n// 自定义分隔符\nconst result4 = slugify('Hello World', { separator: '_' });\nconsole.log(result4); // 'hello_world'\n\n// 保留大写\nconst result5 = slugify('Hello World', { lowercase: false });\nconsole.log(result5); // 'Hello-World'\n\n// 移除停用词\nconst result6 = slugify('The Quick Brown Fox', { \n  removeStopWords: true \n});\nconsole.log(result6); // 'quick-brown-fox'\n\n// 限制长度\nconst longTitle = 'This is a very long title that should be shortened';\nconst result7 = slugify(longTitle, { maxLength: 20 });\nconsole.log(result7); // 'this-is-very-long'`,
                ts: `import { slugify } from 'general-method-utils';\n\ninterface SlugifyOptions {\n  separator?: string;\n  lowercase?: boolean;\n  removeStopWords?: boolean;\n  maxLength?: number;\n}\n\n// 基本转换\nconst result1: string = slugify('Hello World!');\nconsole.log(result1); // 'hello-world'\n\n// 处理特殊字符\nconst result2: string = slugify('This & That: A Guide');\nconsole.log(result2); // 'this-that-a-guide'\n\n// 自定义分隔符\nconst result4: string = slugify('Hello World', { \n  separator: '_' \n} as SlugifyOptions);\nconsole.log(result4); // 'hello_world'\n\n// 保留大写\nconst result5: string = slugify('Hello World', { \n  lowercase: false \n} as SlugifyOptions);\nconsole.log(result5); // 'Hello-World'`
            },
            demo: true
        },
        removeAccents: {
            name: 'removeAccents',
            description: '移除重音符号',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 移除重音符号\nconst result1 = removeAccents('café');\nconsole.log(result1); // 'cafe'\n\nconst result2 = removeAccents('naïve');\nconsole.log(result2); // 'naive'\n\nconst result3 = removeAccents('résumé');\nconsole.log(result3); // 'resume'\n\n// 处理多种语言\nconst french = 'Français';\nconst result4 = removeAccents(french);\nconsole.log(result4); // 'Francais'\n\nconst spanish = 'niño';\nconst result5 = removeAccents(spanish);\nconsole.log(result5); // 'nino'\n\nconst german = 'Müller';\nconst result6 = removeAccents(german);\nconsole.log(result6); // 'Muller'\n\n// 处理句子\nconst sentence = 'Café con leche, por favor';\nconst result7 = removeAccents(sentence);\nconsole.log(result7); // 'Cafe con leche, por favor'`,
                ts: `import { removeAccents } from 'general-method-utils';\n\n// 移除重音符号\nconst result1: string = removeAccents('café');\nconsole.log(result1); // 'cafe'\n\nconst result2: string = removeAccents('naïve');\nconsole.log(result2); // 'naive'\n\nconst result3: string = removeAccents('résumé');\nconsole.log(result3); // 'resume'\n\n// 处理多种语言\nconst french: string = 'Français';\nconst result4: string = removeAccents(french);\nconsole.log(result4); // 'Francais'`
            },
            demo: true
        },
        escapeHtml: {
            name: 'escapeHtml',
            description: '转义HTML字符',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 转义HTML字符\nconst result1 = escapeHtml('<div>Hello & goodbye</div>');\nconsole.log(result1); // '&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;'\n\nconst result2 = escapeHtml('5 > 3 & 2 < 4');\nconsole.log(result2); // '5 &gt; 3 &amp; 2 &lt; 4'\n\nconst result3 = escapeHtml('"Hello" & \'World\'');\nconsole.log(result3); // '&quot;Hello&quot; &amp; &#x27;World&#x27;'\n\n// 处理用户输入\nconst userInput = '<script>alert("XSS")</script>';\nconst safeInput = escapeHtml(userInput);\nconsole.log(safeInput); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'\n\n// 转义属性值\nconst attribute = 'onclick="alert(\'hack\')"';\nconst safeAttribute = escapeHtml(attribute);\nconsole.log(safeAttribute); // 'onclick=&quot;alert(&#x27;hack&#x27;)&quot;'`,
                ts: `import { escapeHtml } from 'general-method-utils';\n\n// 转义HTML字符\nconst result1: string = escapeHtml('<div>Hello & goodbye</div>');\nconsole.log(result1); // '&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;'\n\nconst result2: string = escapeHtml('5 > 3 & 2 < 4');\nconsole.log(result2); // '5 &gt; 3 &amp; 2 &lt; 4'\n\n// 处理用户输入\nconst userInput: string = '<script>alert("XSS")</script>';\nconst safeInput: string = escapeHtml(userInput);\nconsole.log(safeInput); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'`
            },
            demo: true
        },
        unescapeHtml: {
            name: 'unescapeHtml',
            description: '反转义HTML字符',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' }
            ],
            examples: {
                js: `// 反转义HTML字符\nconst result1 = unescapeHtml('&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;');\nconsole.log(result1); // '<div>Hello & goodbye</div>'\n\nconst result2 = unescapeHtml('5 &gt; 3 &amp; 2 &lt; 4');\nconsole.log(result2); // '5 > 3 & 2 < 4'\n\nconst result3 = unescapeHtml('&quot;Hello&quot; &amp; &#x27;World&#x27;');\nconsole.log(result3); // '"Hello" & \'World\''\n\n// 处理编码的内容\nconst encoded = '&lt;p&gt;This is a &lt;strong&gt;paragraph&lt;/strong&gt;&lt;/p&gt;';\nconst decoded = unescapeHtml(encoded);\nconsole.log(decoded); // '<p>This is a <strong>paragraph</strong></p>'\n\n// 处理数字实体\nconst numeric = '&#65;&#66;&#67;';\nconst result4 = unescapeHtml(numeric);\nconsole.log(result4); // 'ABC'`,
                ts: `import { unescapeHtml } from 'general-method-utils';\n\n// 反转义HTML字符\nconst result1: string = unescapeHtml('&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;');\nconsole.log(result1); // '<div>Hello & goodbye</div>'\n\nconst result2: string = unescapeHtml('5 &gt; 3 &amp; 2 &lt; 4');\nconsole.log(result2); // '5 > 3 & 2 < 4'\n\n// 处理编码的内容\nconst encoded: string = '&lt;p&gt;This is a &lt;strong&gt;paragraph&lt;/strong&gt;&lt;/p&gt;';\nconst decoded: string = unescapeHtml(encoded);\nconsole.log(decoded); // '<p>This is a <strong>paragraph</strong></p>'`
            },
            demo: true
        },
        wordCount: {
            name: 'wordCount',
            description: '统计单词数量',
            params: [
                { name: 'str', type: 'string', required: true, description: '输入字符串' },
                { name: 'options', type: 'object', required: false, description: '统计选项' }
            ],
            examples: {
                js: `// 基本单词统计\nconst result1 = wordCount('Hello world');\nconsole.log(result1); // 2\n\nconst result2 = wordCount('The quick brown fox jumps');\nconsole.log(result2); // 5\n\n// 处理标点符号\nconst result3 = wordCount('Hello, world! How are you?');\nconsole.log(result3); // 5\n\n// 详细统计\nconst detailed = wordCount('Hello world! This is a test.', {\n  detailed: true\n});\nconsole.log(detailed);\n// 输出: {\n//   words: 6,\n//   characters: 28,\n//   charactersNoSpaces: 23,\n//   sentences: 2,\n//   paragraphs: 1\n// }\n\n// 处理中文\nconst chinese = '你好世界，这是一个测试。';\nconst result4 = wordCount(chinese, { language: 'zh' });\nconsole.log(result4); // 8\n\n// 忽略停用词\nconst result5 = wordCount('The quick brown fox', {\n  ignoreStopWords: true\n});\nconsole.log(result5); // 3 (忽略 'the')`,
                ts: `import { wordCount } from 'general-method-utils';\n\ninterface WordCountOptions {\n  detailed?: boolean;\n  language?: 'en' | 'zh' | 'auto';\n  ignoreStopWords?: boolean;\n}\n\ninterface DetailedWordCount {\n  words: number;\n  characters: number;\n  charactersNoSpaces: number;\n  sentences: number;\n  paragraphs: number;\n}\n\n// 基本单词统计\nconst result1: number = wordCount('Hello world');\nconsole.log(result1); // 2\n\n// 详细统计\nconst detailed: DetailedWordCount = wordCount('Hello world! This is a test.', {\n  detailed: true\n} as WordCountOptions) as DetailedWordCount;\nconsole.log(detailed);`
            },
            demo: true
        }
    }
};