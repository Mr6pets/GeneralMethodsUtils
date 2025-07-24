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