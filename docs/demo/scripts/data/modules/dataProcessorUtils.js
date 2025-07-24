// 数据处理工具模块
export default {
    title: '数据处理工具',
    icon: 'fas fa-cogs',
    methods: {
        DataProcessor: {
            name: 'DataProcessor',
            description: '数据处理器，提供数据转换、过滤、聚合等功能',
            params: [
                { name: 'options', type: 'object', required: false, description: '处理器配置选项' }
            ],
            examples: {
                js: `// 创建数据处理器\nconst processor = new DataProcessor({\n  batchSize: 1000,\n  parallel: true\n});\n\n// 处理数据\nconst result = await processor.process(data, {\n  transform: (item) => ({ ...item, processed: true }),\n  filter: (item) => item.active,\n  sort: 'name'\n});`,
                ts: `import { DataProcessor } from 'general-method-utils';\n\nconst processor = new DataProcessor({\n  batchSize: 1000,\n  parallel: true\n});\n\nconst result = await processor.process(data, {\n  transform: (item) => ({ ...item, processed: true }),\n  filter: (item) => item.active\n});`
            },
            demo: true
        },
        Pipeline: {
            name: 'Pipeline',
            description: '数据管道，支持链式数据处理操作',
            params: [
                { name: 'steps', type: 'array', required: false, description: '处理步骤数组' }
            ],
            examples: {
                js: `// 创建数据管道\nconst pipeline = new Pipeline()\n  .map(x => x * 2)\n  .filter(x => x > 10)\n  .reduce((sum, x) => sum + x, 0);\n\n// 执行管道\nconst result = pipeline.execute([1, 2, 3, 4, 5, 6]);\nconsole.log(result); // 26`,
                ts: `import { Pipeline } from 'general-method-utils';\n\nconst pipeline = new Pipeline<number>()\n  .map(x => x * 2)\n  .filter(x => x > 10)\n  .reduce((sum, x) => sum + x, 0);\n\nconst result: number = pipeline.execute([1, 2, 3, 4, 5, 6]);`
            },
            demo: true
        },
        Aggregator: {
            name: 'Aggregator',
            description: '数据聚合器，提供分组、统计等聚合功能',
            params: [
                { name: 'data', type: 'array', required: true, description: '要聚合的数据' },
                { name: 'config', type: 'object', required: true, description: '聚合配置' }
            ],
            examples: {
                js: `// 数据聚合\nconst aggregator = new Aggregator();\n\nconst result = aggregator.aggregate(salesData, {\n  groupBy: 'category',\n  metrics: {\n    totalSales: { field: 'amount', operation: 'sum' },\n    avgPrice: { field: 'price', operation: 'avg' },\n    count: { operation: 'count' }\n  }\n});`,
                ts: `import { Aggregator } from 'general-method-utils';\n\nconst aggregator = new Aggregator();\n\nconst result = aggregator.aggregate(salesData, {\n  groupBy: 'category',\n  metrics: {\n    totalSales: { field: 'amount', operation: 'sum' }\n  }\n});`
            },
            demo: true
        },
        Transformer: {
            name: 'Transformer',
            description: '数据转换器，支持复杂的数据格式转换',
            params: [
                { name: 'schema', type: 'object', required: true, description: '转换模式' }
            ],
            examples: {
                js: `// 创建数据转换器\nconst transformer = new Transformer({\n  name: 'user.fullName',\n  email: 'contact.email',\n  age: (data) => new Date().getFullYear() - data.birthYear\n});\n\n// 转换数据\nconst transformed = transformer.transform({\n  user: { fullName: 'John Doe' },\n  contact: { email: 'john@example.com' },\n  birthYear: 1990\n});`,
                ts: `import { Transformer } from 'general-method-utils';\n\nconst transformer = new Transformer({\n  name: 'user.fullName',\n  email: 'contact.email',\n  age: (data: any) => new Date().getFullYear() - data.birthYear\n});`
            },
            demo: true
        },
        Validator: {
            name: 'Validator',
            description: '数据验证器，验证数据格式和完整性',
            params: [
                { name: 'rules', type: 'object', required: true, description: '验证规则' }
            ],
            examples: {
                js: `// 创建数据验证器\nconst validator = new Validator({\n  name: { required: true, type: 'string', minLength: 2 },\n  email: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ },\n  age: { type: 'number', min: 0, max: 120 }\n});\n\n// 验证数据\nconst result = validator.validate({\n  name: 'John',\n  email: 'john@example.com',\n  age: 25\n});`,
                ts: `import { Validator } from 'general-method-utils';\n\nconst validator = new Validator({\n  name: { required: true, type: 'string', minLength: 2 },\n  email: { required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ }\n});`
            },
            demo: true
        }
    }
};