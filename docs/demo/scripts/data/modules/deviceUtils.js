// 设备检测工具模块
export default {
    title: '设备检测工具',
    icon: 'fas fa-mobile-alt',
    methods: {
        isMobile: {
            name: 'isMobile',
            description: '检测当前设备是否为移动设备',
            params: [],
            examples: {
                js: `// 检测是否为移动设备\nconst mobile = isMobile();\nconsole.log(mobile); // true 或 false\n\n// 根据设备类型显示不同内容\nif (isMobile()) {\n  console.log('移动端界面');\n} else {\n  console.log('桌面端界面');\n}`,
                ts: `import { isMobile } from 'general-method-utils';\n\nconst mobile: boolean = isMobile();\n\nif (isMobile()) {\n  console.log('移动端界面');\n} else {\n  console.log('桌面端界面');\n}`
            },
            demo: true
        },
        isTablet: {
            name: 'isTablet',
            description: '检测当前设备是否为平板设备',
            params: [],
            examples: {
                js: `// 检测是否为平板设备\nconst tablet = isTablet();\nconsole.log(tablet); // true 或 false\n\n// 平板设备特殊处理\nif (isTablet()) {\n  document.body.classList.add('tablet-layout');\n}`,
                ts: `import { isTablet } from 'general-method-utils';\n\nconst tablet: boolean = isTablet();\n\nif (isTablet()) {\n  document.body.classList.add('tablet-layout');\n}`
            },
            demo: true
        },
        getDeviceType: {
            name: 'getDeviceType',
            description: '获取设备类型（desktop、mobile、tablet）',
            params: [],
            examples: {
                js: `// 获取设备类型\nconst deviceType = getDeviceType();\nconsole.log(deviceType); // 'desktop', 'mobile', 或 'tablet'\n\n// 根据设备类型应用样式\nswitch (getDeviceType()) {\n  case 'mobile':\n    applyMobileStyles();\n    break;\n  case 'tablet':\n    applyTabletStyles();\n    break;\n  default:\n    applyDesktopStyles();\n}`,
                ts: `import { getDeviceType } from 'general-method-utils';\n\ntype DeviceType = 'desktop' | 'mobile' | 'tablet';\nconst deviceType: DeviceType = getDeviceType();\n\nswitch (getDeviceType()) {\n  case 'mobile':\n    applyMobileStyles();\n    break;\n}`
            },
            demo: true
        },
        getBrowserInfo: {
            name: 'getBrowserInfo',
            description: '获取浏览器信息',
            params: [],
            examples: {
                js: `// 获取浏览器信息\nconst browserInfo = getBrowserInfo();\nconsole.log(browserInfo);\n// {\n//   name: 'Chrome',\n//   version: '120.0.0.0',\n//   engine: 'Blink'\n// }\n\n// 检查浏览器兼容性\nif (browserInfo.name === 'IE' && parseInt(browserInfo.version) < 11) {\n  showUnsupportedBrowserWarning();\n}`,
                ts: `import { getBrowserInfo } from 'general-method-utils';\n\ninterface BrowserInfo {\n  name: string;\n  version: string;\n  engine: string;\n}\n\nconst browserInfo: BrowserInfo = getBrowserInfo();`
            },
            demo: true
        },
        getScreenInfo: {
            name: 'getScreenInfo',
            description: '获取屏幕信息',
            params: [],
            examples: {
                js: `// 获取屏幕信息\nconst screenInfo = getScreenInfo();\nconsole.log(screenInfo);\n// {\n//   width: 1920,\n//   height: 1080,\n//   availWidth: 1920,\n//   availHeight: 1040,\n//   pixelRatio: 1\n// }\n\n// 根据屏幕尺寸调整布局\nif (screenInfo.width < 768) {\n  enableMobileLayout();\n}`,
                ts: `import { getScreenInfo } from 'general-method-utils';\n\ninterface ScreenInfo {\n  width: number;\n  height: number;\n  availWidth: number;\n  availHeight: number;\n  pixelRatio: number;\n}\n\nconst screenInfo: ScreenInfo = getScreenInfo();`
            },
            demo: true
        },
        supportsFeature: {
            name: 'supportsFeature',
            description: '检测浏览器是否支持特定功能',
            params: [
                { name: 'feature', type: 'string', required: true, description: '要检测的功能名称' }
            ],
            examples: {
                js: `// 检测功能支持\nconst hasWebGL = supportsFeature('webgl');\nconst hasGeolocation = supportsFeature('geolocation');\nconst hasLocalStorage = supportsFeature('localStorage');\n\nconsole.log('WebGL支持:', hasWebGL);\nconsole.log('地理位置支持:', hasGeolocation);\n\n// 条件加载功能\nif (supportsFeature('serviceWorker')) {\n  registerServiceWorker();\n}`,
                ts: `import { supportsFeature } from 'general-method-utils';\n\nconst hasWebGL: boolean = supportsFeature('webgl');\nconst hasGeolocation: boolean = supportsFeature('geolocation');\n\nif (supportsFeature('serviceWorker')) {\n  registerServiceWorker();\n}`
            },
            demo: true
        },
        getDeviceOrientation: {
            name: 'getDeviceOrientation',
            description: '获取设备方向（portrait、landscape）',
            params: [],
            examples: {
                js: `// 获取设备方向\nconst orientation = getDeviceOrientation();\nconsole.log(orientation); // 'portrait' 或 'landscape'\n\n// 监听方向变化\nwindow.addEventListener('orientationchange', () => {\n  const newOrientation = getDeviceOrientation();\n  console.log('方向已改变:', newOrientation);\n  adjustLayoutForOrientation(newOrientation);\n});`,
                ts: `import { getDeviceOrientation } from 'general-method-utils';\n\ntype Orientation = 'portrait' | 'landscape';\nconst orientation: Orientation = getDeviceOrientation();\n\nwindow.addEventListener('orientationchange', () => {\n  const newOrientation: Orientation = getDeviceOrientation();\n  adjustLayoutForOrientation(newOrientation);\n});`
            },
            demo: true
        }
    }
};