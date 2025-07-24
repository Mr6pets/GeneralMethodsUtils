// 数字处理工具模块
export default {
    title: '数字处理工具',
    icon: 'fas fa-calculator',
    methods: {
        formatNumber: {
            name: 'formatNumber',
            description: '格式化数字显示',
            params: [
                { name: 'number', type: 'number', required: true, description: '要格式化的数字' },
                { name: 'options', type: 'object', required: false, description: '格式化选项' }
            ],
            examples: {
                js: `// 基本数字格式化\nconst formatted = formatNumber(1234567.89);\nconsole.log(formatted); // '1,234,567.89'\n\n// 货币格式\nconst price = formatNumber(1234.56, {\n  style: 'currency',\n  currency: 'USD'\n});\nconsole.log(price); // '$1,234.56'\n\n// 百分比格式\nconst percentage = formatNumber(0.1234, {\n  style: 'percent',\n  minimumFractionDigits: 2\n});\nconsole.log(percentage); // '12.34%'`,
                ts: `import { formatNumber } from 'general-method-utils';\n\ninterface NumberFormatOptions {\n  style?: 'decimal' | 'currency' | 'percent';\n  currency?: string;\n  minimumFractionDigits?: number;\n  maximumFractionDigits?: number;\n}\n\nconst formatted: string = formatNumber(1234567.89);\nconst price: string = formatNumber(1234.56, {\n  style: 'currency',\n  currency: 'USD'\n});`
            },
            demo: true
        },
        roundTo: {
            name: 'roundTo',
            description: '四舍五入到指定小数位',
            params: [
                { name: 'number', type: 'number', required: true, description: '要四舍五入的数字' },
                { name: 'decimals', type: 'number', required: false, description: '小数位数，默认0' }
            ],
            examples: {
                js: `// 四舍五入\nconst rounded1 = roundTo(3.14159, 2);\nconsole.log(rounded1); // 3.14\n\nconst rounded2 = roundTo(1234.5678, 1);\nconsole.log(rounded2); // 1234.6\n\n// 四舍五入到整数\nconst integer = roundTo(15.7);\nconsole.log(integer); // 16\n\n// 价格计算\nconst price = 19.99;\nconst tax = 0.08;\nconst total = roundTo(price * (1 + tax), 2);\nconsole.log(total); // 21.59`,
                ts: `import { roundTo } from 'general-method-utils';\n\nconst rounded1: number = roundTo(3.14159, 2);\nconst rounded2: number = roundTo(1234.5678, 1);\nconst integer: number = roundTo(15.7);\n\nconst price: number = 19.99;\nconst tax: number = 0.08;\nconst total: number = roundTo(price * (1 + tax), 2);`
            },
            demo: true
        },
        randomInt: {
            name: 'randomInt',
            description: '生成指定范围内的随机整数',
            params: [
                { name: 'min', type: 'number', required: true, description: '最小值（包含）' },
                { name: 'max', type: 'number', required: true, description: '最大值（包含）' }
            ],
            examples: {
                js: `// 生成随机整数\nconst dice = randomInt(1, 6);\nconsole.log(dice); // 1-6之间的随机数\n\n// 生成随机ID\nconst randomId = randomInt(100000, 999999);\nconsole.log(randomId); // 6位随机数字\n\n// 随机选择数组元素\nconst colors = ['red', 'blue', 'green', 'yellow'];\nconst randomColor = colors[randomInt(0, colors.length - 1)];\nconsole.log(randomColor);\n\n// 生成多个随机数\nconst randomNumbers = Array.from({ length: 5 }, () => randomInt(1, 100));\nconsole.log(randomNumbers); // [23, 67, 12, 89, 45]`,
                ts: `import { randomInt } from 'general-method-utils';\n\nconst dice: number = randomInt(1, 6);\nconst randomId: number = randomInt(100000, 999999);\n\nconst colors: string[] = ['red', 'blue', 'green', 'yellow'];\nconst randomColor: string = colors[randomInt(0, colors.length - 1)];\n\nconst randomNumbers: number[] = Array.from({ length: 5 }, () => randomInt(1, 100));`
            },
            demo: true
        },
        randomFloat: {
            name: 'randomFloat',
            description: '生成指定范围内的随机浮点数',
            params: [
                { name: 'min', type: 'number', required: true, description: '最小值' },
                { name: 'max', type: 'number', required: true, description: '最大值' },
                { name: 'decimals', type: 'number', required: false, description: '小数位数，默认2' }
            ],
            examples: {
                js: `// 生成随机浮点数\nconst temperature = randomFloat(-10, 35, 1);\nconsole.log(temperature); // 例如: 23.7\n\n// 生成随机价格\nconst price = randomFloat(10, 100, 2);\nconsole.log(price); // 例如: 67.89\n\n// 生成随机百分比\nconst percentage = randomFloat(0, 1, 4);\nconsole.log(percentage); // 例如: 0.6789\n\n// 模拟传感器数据\nconst sensorData = {\n  temperature: randomFloat(20, 30, 1),\n  humidity: randomFloat(40, 80, 1),\n  pressure: randomFloat(1000, 1020, 2)\n};`,
                ts: `import { randomFloat } from 'general-method-utils';\n\nconst temperature: number = randomFloat(-10, 35, 1);\nconst price: number = randomFloat(10, 100, 2);\nconst percentage: number = randomFloat(0, 1, 4);\n\ninterface SensorData {\n  temperature: number;\n  humidity: number;\n  pressure: number;\n}\n\nconst sensorData: SensorData = {\n  temperature: randomFloat(20, 30, 1),\n  humidity: randomFloat(40, 80, 1),\n  pressure: randomFloat(1000, 1020, 2)\n};`
            },
            demo: true
        },
        clamp: {
            name: 'clamp',
            description: '将数字限制在指定范围内',
            params: [
                { name: 'number', type: 'number', required: true, description: '要限制的数字' },
                { name: 'min', type: 'number', required: true, description: '最小值' },
                { name: 'max', type: 'number', required: true, description: '最大值' }
            ],
            examples: {
                js: `// 限制数字范围\nconst clamped1 = clamp(150, 0, 100);\nconsole.log(clamped1); // 100\n\nconst clamped2 = clamp(-10, 0, 100);\nconsole.log(clamped2); // 0\n\nconst clamped3 = clamp(50, 0, 100);\nconsole.log(clamped3); // 50\n\n// 音量控制\nfunction setVolume(value) {\n  const volume = clamp(value, 0, 100);\n  audioElement.volume = volume / 100;\n}\n\n// 进度条\nfunction updateProgress(current, total) {\n  const percentage = clamp((current / total) * 100, 0, 100);\n  progressBar.style.width = percentage + '%';\n}`,
                ts: `import { clamp } from 'general-method-utils';\n\nconst clamped1: number = clamp(150, 0, 100);\nconst clamped2: number = clamp(-10, 0, 100);\nconst clamped3: number = clamp(50, 0, 100);\n\nfunction setVolume(value: number): void {\n  const volume: number = clamp(value, 0, 100);\n  (audioElement as HTMLAudioElement).volume = volume / 100;\n}\n\nfunction updateProgress(current: number, total: number): void {\n  const percentage: number = clamp((current / total) * 100, 0, 100);\n  (progressBar as HTMLElement).style.width = percentage + '%';\n}`
            },
            demo: true
        },
        lerp: {
            name: 'lerp',
            description: '线性插值计算',
            params: [
                { name: 'start', type: 'number', required: true, description: '起始值' },
                { name: 'end', type: 'number', required: true, description: '结束值' },
                { name: 't', type: 'number', required: true, description: '插值参数 0-1' }
            ],
            examples: {
                js: `// 线性插值\nconst interpolated = lerp(0, 100, 0.5);\nconsole.log(interpolated); // 50\n\n// 动画缓动\nfunction animateValue(start, end, duration) {\n  const startTime = Date.now();\n  \n  function update() {\n    const elapsed = Date.now() - startTime;\n    const t = Math.min(elapsed / duration, 1);\n    const current = lerp(start, end, t);\n    \n    updateDisplay(current);\n    \n    if (t < 1) {\n      requestAnimationFrame(update);\n    }\n  }\n  \n  update();\n}\n\n// 颜色插值\nfunction lerpColor(color1, color2, t) {\n  return {\n    r: lerp(color1.r, color2.r, t),\n    g: lerp(color1.g, color2.g, t),\n    b: lerp(color1.b, color2.b, t)\n  };\n}`,
                ts: `import { lerp } from 'general-method-utils';\n\nconst interpolated: number = lerp(0, 100, 0.5);\n\nfunction animateValue(start: number, end: number, duration: number): void {\n  const startTime: number = Date.now();\n  \n  function update(): void {\n    const elapsed: number = Date.now() - startTime;\n    const t: number = Math.min(elapsed / duration, 1);\n    const current: number = lerp(start, end, t);\n    \n    updateDisplay(current);\n    \n    if (t < 1) {\n      requestAnimationFrame(update);\n    }\n  }\n  \n  update();\n}\n\ninterface Color {\n  r: number;\n  g: number;\n  b: number;\n}\n\nfunction lerpColor(color1: Color, color2: Color, t: number): Color {\n  return {\n    r: lerp(color1.r, color2.r, t),\n    g: lerp(color1.g, color2.g, t),\n    b: lerp(color1.b, color2.b, t)\n  };\n}`
            },
            demo: true
        },
        isPrime: {
            name: 'isPrime',
            description: '检查数字是否为质数',
            params: [
                { name: 'number', type: 'number', required: true, description: '要检查的数字' }
            ],
            examples: {
                js: `// 检查质数\nconsole.log(isPrime(17)); // true\nconsole.log(isPrime(18)); // false\nconsole.log(isPrime(2)); // true\nconsole.log(isPrime(1)); // false\n\n// 生成质数列表\nfunction generatePrimes(max) {\n  const primes = [];\n  for (let i = 2; i <= max; i++) {\n    if (isPrime(i)) {\n      primes.push(i);\n    }\n  }\n  return primes;\n}\n\nconst primesUpTo100 = generatePrimes(100);\nconsole.log(primesUpTo100);\n\n// 质数验证\nfunction validatePrimeInput(input) {\n  const num = parseInt(input);\n  if (isNaN(num)) {\n    return '请输入有效数字';\n  }\n  return isPrime(num) ? '是质数' : '不是质数';\n}`,
                ts: `import { isPrime } from 'general-method-utils';\n\nconsole.log(isPrime(17)); // true\nconsole.log(isPrime(18)); // false\n\nfunction generatePrimes(max: number): number[] {\n  const primes: number[] = [];\n  for (let i = 2; i <= max; i++) {\n    if (isPrime(i)) {\n      primes.push(i);\n    }\n  }\n  return primes;\n}\n\nconst primesUpTo100: number[] = generatePrimes(100);\n\nfunction validatePrimeInput(input: string): string {\n  const num: number = parseInt(input);\n  if (isNaN(num)) {\n    return '请输入有效数字';\n  }\n  return isPrime(num) ? '是质数' : '不是质数';\n}`
            },
            demo: true
        }
    }
};