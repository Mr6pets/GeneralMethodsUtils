// 日期时间工具模块
export default {
    title: '日期时间工具',
    icon: 'fas fa-calendar',
    methods: {
        formatDate: {
            name: 'formatDate',
            description: '格式化日期为指定格式的字符串',
            params: [
                { name: 'date', type: 'Date|string|number', required: true, description: '要格式化的日期' },
                { name: 'format', type: 'string', required: false, description: '日期格式，默认YYYY-MM-DD' }
            ],
            examples: {
                js: `// 格式化当前日期\nconst formatted = formatDate(new Date());\nconsole.log(formatted); // '2024-01-15'\n\n// 自定义格式\nconst custom = formatDate(new Date(), 'YYYY年MM月DD日');\nconsole.log(custom); // '2024年01月15日'\n\n// 格式化时间戳\nconst fromTimestamp = formatDate(1642204800000, 'MM/DD/YYYY');`,
                ts: `import { formatDate } from 'general-method-utils';\n\nconst formatted: string = formatDate(new Date());\nconst custom: string = formatDate(new Date(), 'YYYY年MM月DD日');\nconst fromTimestamp: string = formatDate(1642204800000, 'MM/DD/YYYY');`
            },
            demo: true
        },
        parseDate: {
            name: 'parseDate',
            description: '解析日期字符串为Date对象',
            params: [
                { name: 'dateString', type: 'string', required: true, description: '日期字符串' },
                { name: 'format', type: 'string', required: false, description: '日期格式' }
            ],
            examples: {
                js: `// 解析标准格式\nconst date1 = parseDate('2024-01-15');\nconsole.log(date1);\n\n// 解析自定义格式\nconst date2 = parseDate('15/01/2024', 'DD/MM/YYYY');\nconsole.log(date2);\n\n// 解析中文格式\nconst date3 = parseDate('2024年1月15日', 'YYYY年M月D日');`,
                ts: `import { parseDate } from 'general-method-utils';\n\nconst date1: Date = parseDate('2024-01-15');\nconst date2: Date = parseDate('15/01/2024', 'DD/MM/YYYY');\nconst date3: Date = parseDate('2024年1月15日', 'YYYY年M月D日');`
            },
            demo: true
        },
        addDays: {
            name: 'addDays',
            description: '在日期上添加指定天数',
            params: [
                { name: 'date', type: 'Date', required: true, description: '基准日期' },
                { name: 'days', type: 'number', required: true, description: '要添加的天数' }
            ],
            examples: {
                js: `// 添加天数\nconst today = new Date();\nconst nextWeek = addDays(today, 7);\nconsole.log(nextWeek);\n\n// 减去天数\nconst lastWeek = addDays(today, -7);\nconsole.log(lastWeek);`,
                ts: `import { addDays } from 'general-method-utils';\n\nconst today: Date = new Date();\nconst nextWeek: Date = addDays(today, 7);\nconst lastWeek: Date = addDays(today, -7);`
            },
            demo: true
        },
        diffDays: {
            name: 'diffDays',
            description: '计算两个日期之间的天数差',
            params: [
                { name: 'date1', type: 'Date', required: true, description: '第一个日期' },
                { name: 'date2', type: 'Date', required: true, description: '第二个日期' }
            ],
            examples: {
                js: `// 计算日期差\nconst start = new Date('2024-01-01');\nconst end = new Date('2024-01-15');\nconst diff = diffDays(start, end);\nconsole.log(diff); // 14\n\n// 计算到今天的天数\nconst today = new Date();\nconst birthday = new Date('2024-06-15');\nconst daysUntilBirthday = diffDays(today, birthday);`,
                ts: `import { diffDays } from 'general-method-utils';\n\nconst start: Date = new Date('2024-01-01');\nconst end: Date = new Date('2024-01-15');\nconst diff: number = diffDays(start, end);`
            },
            demo: true
        },
        isWeekend: {
            name: 'isWeekend',
            description: '判断日期是否为周末',
            params: [
                { name: 'date', type: 'Date', required: true, description: '要检查的日期' }
            ],
            examples: {
                js: `// 检查是否为周末\nconst today = new Date();\nconst weekend = isWeekend(today);\nconsole.log(weekend); // true 或 false\n\n// 检查特定日期\nconst saturday = new Date('2024-01-13'); // 假设是周六\nconst isSaturdayWeekend = isWeekend(saturday);\nconsole.log(isSaturdayWeekend); // true`,
                ts: `import { isWeekend } from 'general-method-utils';\n\nconst today: Date = new Date();\nconst weekend: boolean = isWeekend(today);\nconst saturday: Date = new Date('2024-01-13');\nconst isSaturdayWeekend: boolean = isWeekend(saturday);`
            },
            demo: true
        },
        getRelativeTime: {
            name: 'getRelativeTime',
            description: '获取相对时间描述（如：2小时前、3天后）',
            params: [
                { name: 'date', type: 'Date', required: true, description: '目标日期' },
                { name: 'baseDate', type: 'Date', required: false, description: '基准日期，默认为当前时间' }
            ],
            examples: {
                js: `// 获取相对时间\nconst pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2小时前\nconst relative1 = getRelativeTime(pastDate);\nconsole.log(relative1); // '2小时前'\n\n// 未来时间\nconst futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3天后\nconst relative2 = getRelativeTime(futureDate);\nconsole.log(relative2); // '3天后'`,
                ts: `import { getRelativeTime } from 'general-method-utils';\n\nconst pastDate: Date = new Date(Date.now() - 2 * 60 * 60 * 1000);\nconst relative1: string = getRelativeTime(pastDate);\nconst futureDate: Date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);\nconst relative2: string = getRelativeTime(futureDate);`
            },
            demo: true
        }
    }
};