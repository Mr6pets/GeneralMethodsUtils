// 数据处理工具模块
export default {
    title: '数据处理工具',
    icon: 'fas fa-database',
    methods: {
        formatData: {
            name: 'formatData',
            description: '格式化各种类型的数据',
            params: [
                { name: 'data', type: 'any', required: true, description: '要格式化的数据' },
                { name: 'options', type: 'FormatOptions', required: false, description: '格式化选项' }
            ],
            examples: {
                js: `// 格式化数字\nconst number = 1234567.89;\nconst formatted = dataUtils.formatData(number, {\n  type: 'number',\n  locale: 'zh-CN',\n  currency: 'CNY'\n});\nconsole.log(formatted); // ¥1,234,567.89\n\n// 格式化日期\nconst date = new Date();\nconst formattedDate = dataUtils.formatData(date, {\n  type: 'date',\n  format: 'YYYY-MM-DD HH:mm:ss'\n});\n\n// 格式化文件大小\nconst fileSize = 1024 * 1024 * 5.5;\nconst sizeFormatted = dataUtils.formatData(fileSize, {\n  type: 'filesize',\n  precision: 2\n});\nconsole.log(sizeFormatted); // 5.50 MB`,
                ts: `import { dataUtils, FormatOptions } from 'general-method-utils';\n\n// 格式化数字\nconst options: FormatOptions = {\n  type: 'number',\n  locale: 'zh-CN',\n  currency: 'CNY'\n};\n\nconst number = 1234567.89;\nconst formatted: string = dataUtils.formatData(number, options);\nconsole.log(formatted);\n\n// 格式化日期\nconst dateOptions: FormatOptions = {\n  type: 'date',\n  format: 'YYYY-MM-DD HH:mm:ss'\n};\n\nconst date = new Date();\nconst formattedDate: string = dataUtils.formatData(date, dateOptions);`
            },
            demo: true
        },
        validateData: {
            name: 'validateData',
            description: '验证数据的有效性和完整性',
            params: [
                { name: 'data', type: 'any', required: true, description: '要验证的数据' },
                { name: 'schema', type: 'ValidationSchema', required: true, description: '验证模式' }
            ],
            examples: {
                js: `// 验证用户数据\nconst userData = {\n  name: 'John Doe',\n  email: 'john@example.com',\n  age: 25\n};\n\nconst userSchema = {\n  name: { type: 'string', required: true, minLength: 2 },\n  email: { type: 'email', required: true },\n  age: { type: 'number', min: 0, max: 120 }\n};\n\nconst validation = dataUtils.validateData(userData, userSchema);\nconsole.log('验证结果:', validation.isValid);\nconsole.log('错误信息:', validation.errors);\n\n// 验证API响应\nconst apiResponse = { status: 200, data: [...] };\nconst apiSchema = {\n  status: { type: 'number', required: true },\n  data: { type: 'array', required: true }\n};`,
                ts: `import { dataUtils, ValidationSchema, ValidationResult } from 'general-method-utils';\n\ninterface UserData {\n  name: string;\n  email: string;\n  age: number;\n}\n\nconst userData: UserData = {\n  name: 'John Doe',\n  email: 'john@example.com',\n  age: 25\n};\n\nconst userSchema: ValidationSchema = {\n  name: { type: 'string', required: true, minLength: 2 },\n  email: { type: 'email', required: true },\n  age: { type: 'number', min: 0, max: 120 }\n};\n\nconst validation: ValidationResult = dataUtils.validateData(userData, userSchema);`
            },
            demo: true
        },
        transformData: {
            name: 'transformData',
            description: '转换数据结构和格式',
            params: [
                { name: 'data', type: 'any', required: true, description: '源数据' },
                { name: 'transformer', type: 'DataTransformer', required: true, description: '转换器配置' }
            ],
            examples: {
                js: `// 数组转换\nconst users = [\n  { id: 1, name: 'John', role: 'admin' },\n  { id: 2, name: 'Jane', role: 'user' }\n];\n\n// 转换为键值对\nconst userMap = dataUtils.transformData(users, {\n  type: 'arrayToMap',\n  keyField: 'id'\n});\nconsole.log(userMap); // { 1: {...}, 2: {...} }\n\n// 提取特定字段\nconst names = dataUtils.transformData(users, {\n  type: 'pluck',\n  field: 'name'\n});\nconsole.log(names); // ['John', 'Jane']\n\n// 数据分组\nconst grouped = dataUtils.transformData(users, {\n  type: 'groupBy',\n  field: 'role'\n});\nconsole.log(grouped); // { admin: [...], user: [...] }`,
                ts: `import { dataUtils, DataTransformer } from 'general-method-utils';\n\ninterface User {\n  id: number;\n  name: string;\n  role: string;\n}\n\nconst users: User[] = [\n  { id: 1, name: 'John', role: 'admin' },\n  { id: 2, name: 'Jane', role: 'user' }\n];\n\n// 转换为键值对\nconst mapTransformer: DataTransformer = {\n  type: 'arrayToMap',\n  keyField: 'id'\n};\n\nconst userMap: Record<number, User> = dataUtils.transformData(users, mapTransformer);`
            },
            demo: true
        },
        filterData: {
            name: 'filterData',
            description: '高级数据过滤和搜索',
            params: [
                { name: 'data', type: 'any[]', required: true, description: '数据数组' },
                { name: 'filters', type: 'FilterConfig', required: true, description: '过滤配置' }
            ],
            examples: {
                js: `// 复杂过滤\nconst products = [\n  { name: 'iPhone', price: 999, category: 'phone', inStock: true },\n  { name: 'MacBook', price: 1299, category: 'laptop', inStock: false },\n  { name: 'iPad', price: 599, category: 'tablet', inStock: true }\n];\n\n// 多条件过滤\nconst filtered = dataUtils.filterData(products, {\n  conditions: [\n    { field: 'price', operator: 'gte', value: 600 },\n    { field: 'inStock', operator: 'eq', value: true }\n  ],\n  logic: 'and'\n});\n\n// 文本搜索\nconst searched = dataUtils.filterData(products, {\n  search: {\n    query: 'Mac',\n    fields: ['name'],\n    fuzzy: true\n  }\n});\n\n// 范围过滤\nconst priceRange = dataUtils.filterData(products, {\n  range: {\n    field: 'price',\n    min: 500,\n    max: 1000\n  }\n});`,
                ts: `import { dataUtils, FilterConfig } from 'general-method-utils';\n\ninterface Product {\n  name: string;\n  price: number;\n  category: string;\n  inStock: boolean;\n}\n\nconst products: Product[] = [\n  { name: 'iPhone', price: 999, category: 'phone', inStock: true },\n  { name: 'MacBook', price: 1299, category: 'laptop', inStock: false }\n];\n\nconst filterConfig: FilterConfig = {\n  conditions: [\n    { field: 'price', operator: 'gte', value: 600 },\n    { field: 'inStock', operator: 'eq', value: true }\n  ],\n  logic: 'and'\n};\n\nconst filtered: Product[] = dataUtils.filterData(products, filterConfig);`
            },
            demo: true
        },
        sortData: {
            name: 'sortData',
            description: '多字段数据排序',
            params: [
                { name: 'data', type: 'any[]', required: true, description: '数据数组' },
                { name: 'sortConfig', type: 'SortConfig', required: true, description: '排序配置' }
            ],
            examples: {
                js: `// 多字段排序\nconst students = [\n  { name: 'Alice', grade: 85, age: 20 },\n  { name: 'Bob', grade: 92, age: 19 },\n  { name: 'Charlie', grade: 85, age: 21 }\n];\n\n// 按成绩降序，年龄升序\nconst sorted = dataUtils.sortData(students, {\n  fields: [\n    { field: 'grade', direction: 'desc' },\n    { field: 'age', direction: 'asc' }\n  ]\n});\n\n// 自定义排序函数\nconst customSorted = dataUtils.sortData(students, {\n  compareFn: (a, b) => {\n    // 自定义排序逻辑\n    return a.name.localeCompare(b.name);\n  }\n});\n\n// 本地化排序\nconst localeSorted = dataUtils.sortData(students, {\n  fields: [{ field: 'name', direction: 'asc' }],\n  locale: 'zh-CN'\n});`,
                ts: `import { dataUtils, SortConfig } from 'general-method-utils';\n\ninterface Student {\n  name: string;\n  grade: number;\n  age: number;\n}\n\nconst students: Student[] = [\n  { name: 'Alice', grade: 85, age: 20 },\n  { name: 'Bob', grade: 92, age: 19 }\n];\n\nconst sortConfig: SortConfig = {\n  fields: [\n    { field: 'grade', direction: 'desc' },\n    { field: 'age', direction: 'asc' }\n  ]\n};\n\nconst sorted: Student[] = dataUtils.sortData(students, sortConfig);`
            },
            demo: true
        }
    }
};