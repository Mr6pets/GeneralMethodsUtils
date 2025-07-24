import { getModuleData } from './data/index.js';
import { allDemos } from './demos/index.js';
import { Utils, LoadingManager, ToastManager } from './utils.js';
import { SearchManager } from './search.js';
import { TabManager } from './tabs.js';
import { ContentManager } from './content.js';
import { SidebarManager } from './sidebar.js';
import { EventManager } from './events.js';

// 主应用类
class DemoApp {
    constructor() {
        this.isInitialized = false;
        this.currentLanguage = 'javascript';
        this.moduleData = null;
        this.demoGenerators = allDemos;
        
        // 初始化各个管理器
        try {
            // Utils是静态类，不需要实例化
            this.utils = Utils;
            this.searchManager = new SearchManager();
            this.tabManager = new TabManager();
            this.contentManager = new ContentManager();
            this.sidebarManager = new SidebarManager();
            this.eventManager = new EventManager();
        } catch (error) {
            console.error('创建管理器实例时出错:', error);
            // 创建空对象以避免后续错误
            this.utils = Utils; // 即使出错也保持Utils的引用
            this.searchManager = {};
            this.tabManager = {};
            this.contentManager = {};
            this.sidebarManager = {};
            this.eventManager = {};
        }
    }

    // 初始化应用
    async init() {
        if (this.isInitialized) {
            console.warn('应用已经初始化');
            return;
        }
        
        // 开始初始化
        try {
            console.log('开始初始化演示应用...');
            
            // 加载模块数据并确保全局可用
            console.log('正在加载模块数据...');
            this.moduleData = await getModuleData();
            
            // 确保全局 moduleData 可用
            if (!window.moduleData) {
                window.moduleData = this.moduleData;
            }
            
            console.log('模块数据加载完成:', Object.keys(this.moduleData).length, '个模块');
            
            // 检查依赖
            await this.checkDependencies();
            
            // 初始化主题
            if (Utils && typeof Utils.initTheme === 'function') {
                Utils.initTheme();
            }
            
            // 初始化各个管理器
            await this.initManagers();
            
            // 设置回调函数
            this.setupCallbacks();
            
            // 恢复用户状态
            if (this.eventManager && typeof this.eventManager.restoreUserState === 'function') {
                this.eventManager.restoreUserState();
            }
            
            // 处理初始URL
            this.handleInitialURL();
            
            // 标记为已初始化
            this.isInitialized = true;
            
            console.log('演示应用初始化完成');
            
            // 显示加载完成提示
            if (Utils && typeof Utils.showToast === 'function') {
                Utils.showToast('应用加载完成', 'success');
            }
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.handleInitError(error);
        }
    }

    // 检查依赖
    async checkDependencies() {
        // 检查模块数据
        if (!this.moduleData || typeof this.moduleData !== 'object') {
            throw new Error('模块数据 (moduleData) 无效或未加载');
        }
        
        // 检查类构造函数是否存在
        const requiredClasses = [
            'Utils',
            'SearchManager',
            'TabManager', 
            'ContentManager',
            'SidebarManager',
            'EventManager'
        ];
        
        const missing = requiredClasses.filter(name => typeof window[name] !== 'function');
        
        if (missing.length > 0) {
            console.warn(`以下类尚未定义: ${missing.join(', ')}`);
            // 不抛出错误，而是警告，因为类可能在后续脚本中定义
        }
        
        console.log('依赖检查完成');
    }

    // 初始化各个管理器
    async initManagers() {
        try {
            // 初始化内容管理器
            if (this.contentManager && typeof this.contentManager.init === 'function') {
                this.contentManager.init();
            }
            
            // 初始化侧边栏管理器
            if (this.sidebarManager && typeof this.sidebarManager.init === 'function') {
                this.sidebarManager.init();
            }
            
            // 初始化搜索管理器
            if (this.searchManager && typeof this.searchManager.init === 'function') {
                this.searchManager.init();
            }
            
            // 初始化标签页管理器
            if (this.tabManager && typeof this.tabManager.init === 'function') {
                this.tabManager.init();
            }
            
            // 初始化事件管理器（最后初始化）
            if (this.eventManager && typeof this.eventManager.init === 'function') {
                this.eventManager.init();
            }
        } catch (error) {
            console.error('初始化管理器时出错:', error);
            throw error;
        }
    }

    // 设置回调函数
    setupCallbacks() {
        // 设置方法选择回调
        this.sidebarManager.onMethodSelected = (moduleKey, methodKey) => {
            this.handleMethodSelection(moduleKey, methodKey);
        };
        
        // 确保 window.app 指向完整的实例
        // 不要重新定义 window.app，它已经在 initApp 中正确设置
        
        // 设置搜索结果回调
        this.searchManager.onSearchResults = (results) => {
            this.sidebarManager.highlightSearchResults(results);
        };
        
        // 设置搜索清除回调
        this.searchManager.onSearchClear = () => {
            this.sidebarManager.clearSearchHighlight();
        };
    }

    // 处理方法选择
    handleMethodSelection(moduleKey, methodKey) {
        try {
            // 渲染方法详情
            this.contentManager.renderMethodDetail(moduleKey, methodKey);
            
            // 初始化标签页
            this.tabManager.initTabs(moduleKey, methodKey);
            
            // 更新页面标题
            const method = this.moduleData[moduleKey]?.methods[methodKey];
            if (method) {
                document.title = `${method.name} - 通用方法库演示`;
            }
            
        } catch (error) {
            console.error('处理方法选择失败:', error);
            Utils.showToast('加载方法详情失败', 'error');
        }
    }

    // 处理初始URL
    handleInitialURL() {
        // 尝试从URL加载方法
        if (!this.sidebarManager.loadFromURL()) {
            // 如果URL无效，显示欢迎页
            this.showWelcome();
        }
    }

    // 显示欢迎页
    showWelcome() {
        this.contentManager.renderWelcome();
        document.title = '通用方法库演示';
        
        // 清除URL hash
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname);
        }
    }

    // 切换语言
    switchLanguage(language) {
        if (this.currentLanguage === language) return;
        
        this.currentLanguage = language;
        
        // 通知标签页管理器
        this.tabManager.switchLanguage(language);
        
        // 保存语言偏好
        try {
            localStorage.setItem('preferredLanguage', language);
        } catch (error) {
            console.warn('保存语言偏好失败:', error);
        }
        
        Utils.showToast(`已切换到 ${language === 'javascript' ? 'JavaScript' : 'TypeScript'}`, 'info');
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 选择方法
    selectMethod(moduleKey, methodKey) {
        if (this.sidebarManager) {
            this.sidebarManager.selectMethod(moduleKey, methodKey);
        }
    }

    // 方法选择回调（兼容性方法）
    onMethodSelected(moduleKey, methodKey) {
        this.handleMethodSelection(moduleKey, methodKey);
    }

    // 搜索方法
    searchMethods(query) {
        this.searchManager.search(query);
    }

    // 清除搜索
    clearSearch() {
        this.searchManager.clearSearch();
    }

    // 展开所有模块
    expandAllModules() {
        this.sidebarManager.expandAllModules();
    }

    // 收起所有模块
    collapseAllModules() {
        this.sidebarManager.collapseAllModules();
    }

    // 切换主题
    toggleTheme() {
        this.utils.toggleTheme();
    }

    // 复制代码
    copyCode(code) {
        this.utils.copyCode(code);
    }

    // 运行代码
    runCode(code) {
        this.tabManager.runCode(code);
    }

    // 显示模块方法
    showModuleMethods(moduleKey) {
        if (this.contentManager) {
            this.contentManager.showModuleMethods(moduleKey);
        }
    }

    // 显示快速开始
    showQuickStart() {
        if (this.contentManager) {
            this.contentManager.showQuickStart();
        }
    }

    // 显示所有方法
    showAllMethods() {
        if (this.contentManager) {
            this.contentManager.showAllMethods();
        }
    }

    // 导出方法
    exportMethod(moduleKey, methodKey) {
        if (this.contentManager) {
            this.contentManager.exportMethod(moduleKey, methodKey);
        }
    }

    // 分享方法
    shareMethod(moduleKey, methodKey) {
        if (this.contentManager) {
            this.contentManager.shareMethod(moduleKey, methodKey);
        }
    }

    // 获取应用统计信息
    getStats() {
        return {
            totalMethods: this.getTotalMethodCount(),
            totalModules: Object.keys(moduleData).length,
            demoCount: this.getDemoCount(),
            currentLanguage: this.currentLanguage,
            isInitialized: this.isInitialized
        };
    }

    // 获取总方法数
    getTotalMethodCount() {
        return Object.values(moduleData).reduce((total, module) => {
            return total + Object.keys(module.methods).length;
        }, 0);
    }

    // 获取演示数量
    getDemoCount() {
        let count = 0;
        Object.values(moduleData).forEach(module => {
            Object.values(module.methods).forEach(method => {
                if (method.demo) count++;
            });
        });
        return count;
    }

    // 处理初始化错误
    handleInitError(error) {
        console.error('应用初始化错误:', error);
        
        // 显示错误页面
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-page">
                    <div class="error-content">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h2>应用初始化失败</h2>
                        <p class="error-message">${error.message}</p>
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="location.reload()">
                                <i class="fas fa-redo"></i>
                                重新加载
                            </button>
                            <button class="btn btn-secondary" onclick="app.showDebugInfo()">
                                <i class="fas fa-bug"></i>
                                调试信息
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
            // 显示错误提示
        if (Utils && typeof Utils.showToast === 'function') {
            Utils.showToast('应用初始化失败，请刷新页面重试', 'error');
        }
    }

    // 显示调试信息
    showDebugInfo() {
        const debugInfo = {
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            moduleDataExists: !!window.moduleData,
            moduleCount: window.moduleData ? Object.keys(window.moduleData).length : 0,
            localStorage: this.getLocalStorageInfo(),
            errors: this.getErrorLog()
        };
        
        const modal = this.eventManager.createModal('调试信息', `
            <div class="debug-info">
                <pre><code>${JSON.stringify(debugInfo, null, 2)}</code></pre>
                <div class="debug-actions">
                    <button class="btn btn-secondary" onclick="app.copyDebugInfo()">
                        <i class="fas fa-copy"></i>
                        复制调试信息
                    </button>
                </div>
            </div>
        `, 'debug-modal');
        
        this.eventManager.showModal(modal);
    }

    // 复制调试信息
    copyDebugInfo() {
        const debugInfo = {
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            moduleDataExists: !!window.moduleData,
            moduleCount: window.moduleData ? Object.keys(window.moduleData).length : 0,
            localStorage: this.getLocalStorageInfo(),
            errors: this.getErrorLog()
        };
        
        Utils.copyCode(JSON.stringify(debugInfo, null, 2));
    }

    // 获取本地存储信息
    getLocalStorageInfo() {
        try {
            return {
                available: !!window.localStorage,
                demoAppState: localStorage.getItem('demoAppState'),
                preferredLanguage: localStorage.getItem('preferredLanguage')
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // 获取错误日志
    getErrorLog() {
        return window.errorLog || [];
    }

    // 销毁应用
    destroy() {
        try {
            // 保存用户状态
            this.eventManager.saveUserState();
            
            // 销毁各个管理器
            this.eventManager.destroy();
            
            // 清理全局引用
            this.isInitialized = false;
            
            console.log('应用已销毁');
        } catch (error) {
            console.error('销毁应用时出错:', error);
        }
    }
}

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    
    // 记录错误
    if (!window.errorLog) {
        window.errorLog = [];
    }
    window.errorLog.push({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        timestamp: new Date().toISOString()
    });
    
    // 显示用户友好的错误提示
    if (window.app && window.app.utils) {
        window.app.utils.showToast('发生了一个错误，请查看控制台获取详细信息', 'error');
    }
});

// 全局未处理的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
    
    // 记录错误
    if (!window.errorLog) {
        window.errorLog = [];
    }
    window.errorLog.push({
        type: 'unhandledrejection',
        reason: event.reason?.toString(),
        timestamp: new Date().toISOString()
    });
    
    // 显示用户友好的错误提示
    if (window.app && window.app.utils) {
        window.app.utils.showToast('异步操作失败，请重试', 'error');
    }
});

// 应用初始化
let app;

// DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function initApp() {
    try {
        // 创建应用实例
        app = new DemoApp();
        
        // 将应用实例暴露到全局
        window.app = app;
        
        // 初始化应用
        await app.init();
        
    } catch (error) {
        console.error('应用启动失败:', error);
        
        // 显示基本错误页面
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f5f5f5;
            ">
                <div style="
                    text-align: center;
                    padding: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h1 style="color: #e74c3c; margin-bottom: 1rem;">应用启动失败</h1>
                    <p style="color: #666; margin-bottom: 1.5rem;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">重新加载</button>
                </div>
            </div>
        `;
    }
}

// 导出应用类
window.DemoApp = DemoApp;