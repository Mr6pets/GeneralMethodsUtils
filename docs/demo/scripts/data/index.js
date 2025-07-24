// 模块化数据管理主入口
class ModuleDataManager {
    constructor() {
        this.modules = new Map();
        this.loadedModules = new Set();
        this.loadPromises = new Map();
    }

    // 注册模块
    registerModule(moduleKey, moduleConfig) {
        this.modules.set(moduleKey, {
            ...moduleConfig,
            loaded: false,
            data: null
        });
    }

    // 异步加载模块数据
    async loadModule(moduleKey) {
        if (this.loadedModules.has(moduleKey)) {
            return this.modules.get(moduleKey).data;
        }

        // 如果正在加载，返回现有的Promise
        if (this.loadPromises.has(moduleKey)) {
            return this.loadPromises.get(moduleKey);
        }

        const moduleConfig = this.modules.get(moduleKey);
        if (!moduleConfig) {
            throw new Error(`Module ${moduleKey} not found`);
        }

        // 创建加载Promise
        const loadPromise = this.loadModuleData(moduleKey, moduleConfig);
        this.loadPromises.set(moduleKey, loadPromise);

        try {
            const data = await loadPromise;
            this.loadedModules.add(moduleKey);
            moduleConfig.data = data;
            moduleConfig.loaded = true;
            this.loadPromises.delete(moduleKey);
            return data;
        } catch (error) {
            this.loadPromises.delete(moduleKey);
            throw error;
        }
    }

    // 实际加载模块数据
    async loadModuleData(moduleKey, moduleConfig) {
        try {
            // 动态导入模块
            const module = await import(`./modules/${moduleKey}.js`);
            return module.default || module;
        } catch (error) {
            console.error(`Failed to load module ${moduleKey}:`, error);
            throw error;
        }
    }

    // 获取所有已注册的模块
    getAllModules() {
        const result = {};
        for (const [key, config] of this.modules) {
            result[key] = {
                title: config.title,
                icon: config.icon,
                loaded: config.loaded,
                methodCount: config.methodCount || 0
            };
        }
        return result;
    }

    // 预加载所有模块
    async preloadAllModules() {
        const loadPromises = Array.from(this.modules.keys()).map(key => 
            this.loadModule(key).catch(error => {
                console.warn(`Failed to preload module ${key}:`, error);
                return null;
            })
        );
        
        await Promise.all(loadPromises);
    }

    // 获取模块数据（同步，如果未加载则返回null）
    getModuleData(moduleKey) {
        const moduleConfig = this.modules.get(moduleKey);
        return moduleConfig?.loaded ? moduleConfig.data : null;
    }

    // 检查模块是否已加载
    isModuleLoaded(moduleKey) {
        return this.loadedModules.has(moduleKey);
    }

    // 卸载模块（释放内存）
    unloadModule(moduleKey) {
        const moduleConfig = this.modules.get(moduleKey);
        if (moduleConfig) {
            moduleConfig.loaded = false;
            moduleConfig.data = null;
            this.loadedModules.delete(moduleKey);
        }
    }

    // 获取统计信息
    getStats() {
        let totalMethods = 0;
        let loadedModules = 0;
        
        for (const [key, config] of this.modules) {
            if (config.loaded && config.data) {
                totalMethods += Object.keys(config.data.methods || {}).length;
                loadedModules++;
            }
        }
        
        return {
            totalModules: this.modules.size,
            loadedModules,
            totalMethods,
            memoryUsage: this.getMemoryUsage()
        };
    }

    // 获取内存使用情况（估算）
    getMemoryUsage() {
        let size = 0;
        for (const [key, config] of this.modules) {
            if (config.loaded && config.data) {
                size += JSON.stringify(config.data).length;
            }
        }
        return {
            bytes: size,
            kb: Math.round(size / 1024 * 100) / 100,
            mb: Math.round(size / 1024 / 1024 * 100) / 100
        };
    }
}

// 创建全局实例
const moduleDataManager = new ModuleDataManager();

// 注册所有模块
moduleDataManager.registerModule('cookieUtils', {
    title: 'Cookie 工具',
    icon: 'fas fa-cookie-bite',
    methodCount: 2
});

moduleDataManager.registerModule('urlUtils', {
    title: 'URL 工具', 
    icon: 'fas fa-link',
    methodCount: 1
});

moduleDataManager.registerModule('aimlUtils', {
    title: 'AI/ML 集成工具',
    icon: 'fas fa-robot',
    methodCount: 2
});

moduleDataManager.registerModule('dataUtils', {
    title: '数据处理工具',
    icon: 'fas fa-database',
    methodCount: 2
});

moduleDataManager.registerModule('performanceUtils', {
    title: '性能优化工具',
    icon: 'fas fa-tachometer-alt',
    methodCount: 2
});

moduleDataManager.registerModule('securityUtils', {
    title: '高级安全工具',
    icon: 'fas fa-shield-alt',
    methodCount: 2
});

moduleDataManager.registerModule('webrtcUtils', {
    title: 'WebRTC 通信工具',
    icon: 'fas fa-video',
    methodCount: 2
});

moduleDataManager.registerModule('blockchainUtils', {
    title: '区块链工具',
    icon: 'fas fa-cube',
    methodCount: 2
});

moduleDataManager.registerModule('microfrontendUtils', {
    title: '微前端工具',
    icon: 'fas fa-puzzle-piece',
    methodCount: 2
});

// 新增的21个模块
moduleDataManager.registerModule('animationUtils', {
    title: '动画工具',
    icon: 'fas fa-magic',
    methodCount: 7
});

moduleDataManager.registerModule('collaborationUtils', {
    title: '协作工具',
    icon: 'fas fa-users',
    methodCount: 5
});

moduleDataManager.registerModule('cryptoUtils', {
    title: '加密工具',
    icon: 'fas fa-lock',
    methodCount: 6
});

moduleDataManager.registerModule('dataProcessorUtils', {
    title: '数据处理器',
    icon: 'fas fa-cogs',
    methodCount: 5
});

moduleDataManager.registerModule('dateUtils', {
    title: '日期工具',
    icon: 'fas fa-calendar',
    methodCount: 6
});

moduleDataManager.registerModule('deviceUtils', {
    title: '设备检测工具',
    icon: 'fas fa-mobile-alt',
    methodCount: 7
});

moduleDataManager.registerModule('domUtils', {
    title: 'DOM 工具',
    icon: 'fas fa-code',
    methodCount: 7
});

moduleDataManager.registerModule('formUtils', {
    title: '表单工具',
    icon: 'fas fa-wpforms',
    methodCount: 7
});

moduleDataManager.registerModule('geoUtils', {
    title: '地理位置工具',
    icon: 'fas fa-map-marker-alt',
    methodCount: 6
});

moduleDataManager.registerModule('i18nUtils', {
    title: '国际化工具',
    icon: 'fas fa-globe',
    methodCount: 7
});

moduleDataManager.registerModule('imageUtils', {
    title: '图片工具',
    icon: 'fas fa-image',
    methodCount: 6
});

moduleDataManager.registerModule('numberUtils', {
    title: '数字工具',
    icon: 'fas fa-calculator',
    methodCount: 7
});

moduleDataManager.registerModule('promiseUtils', {
    title: 'Promise 工具',
    icon: 'fas fa-hourglass-half',
    methodCount: 7
});

moduleDataManager.registerModule('pwaUtils', {
    title: 'PWA 工具',
    icon: 'fas fa-mobile',
    methodCount: 6
});

moduleDataManager.registerModule('requestUtils', {
    title: '网络请求工具',
    icon: 'fas fa-exchange-alt',
    methodCount: 7
});

moduleDataManager.registerModule('shareUtils', {
    title: '分享工具',
    icon: 'fas fa-share-alt',
    methodCount: 6
});

moduleDataManager.registerModule('storageUtils', {
    title: '存储工具',
    icon: 'fas fa-database',
    methodCount: 7
});

moduleDataManager.registerModule('stringUtils', {
    title: '字符串工具',
    icon: 'fas fa-font',
    methodCount: 10
});

moduleDataManager.registerModule('uploadUtils', {
    title: '文件上传工具',
    icon: 'fas fa-upload',
    methodCount: 6
});

moduleDataManager.registerModule('validateUtils', {
    title: '验证工具',
    icon: 'fas fa-check-circle',
    methodCount: 7
});

// 注意：utils.js 模块包含通用工具方法，但由于与现有的工具类重复，暂不添加单独的模块

// 兼容性函数：模拟原始的moduleData
let cachedModuleData = null;

async function getModuleData() {
    if (cachedModuleData) {
        return cachedModuleData;
    }

    // 预加载所有模块
    await moduleDataManager.preloadAllModules();
    
    // 构建兼容的数据结构
    cachedModuleData = {};
    for (const [key, config] of moduleDataManager.modules) {
        if (config.loaded && config.data) {
            cachedModuleData[key] = {
                title: config.title,
                icon: config.icon,
                methods: config.data.methods
            };
        }
    }
    
    return cachedModuleData;
}

// 导出
window.moduleDataManager = moduleDataManager;
window.getModuleData = getModuleData;

// 向后兼容：立即加载所有模块并设置全局moduleData
(async () => {
    try {
        window.moduleData = await getModuleData();
        console.log('✅ 模块数据加载完成:', moduleDataManager.getStats());
    } catch (error) {
        console.error('❌ 模块数据加载失败:', error);
        // 降级到原始数据
        const script = document.createElement('script');
        script.src = './scripts/data-legacy.js';
        document.head.appendChild(script);
    }
})();

// 用户状态管理
const userState = {
    preferences: {
        theme: 'light',
        language: 'zh-CN',
        expandedModules: new Set(),
        lastSelectedMethod: null
    },
    
    // 保存偏好设置到localStorage
    savePreferences() {
        try {
            const prefs = {
                ...this.preferences,
                expandedModules: Array.from(this.preferences.expandedModules)
            };
            localStorage.setItem('userPreferences', JSON.stringify(prefs));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    },
    
    // 从localStorage加载偏好设置
    loadPreferences() {
        try {
            const saved = localStorage.getItem('userPreferences');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.preferences = {
                    ...this.preferences,
                    ...prefs,
                    expandedModules: new Set(prefs.expandedModules || [])
                };
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
    }
};

// 初始化用户状态
userState.loadPreferences();

// 导出函数和类
export { getModuleData, moduleDataManager, userState };
export default moduleDataManager;