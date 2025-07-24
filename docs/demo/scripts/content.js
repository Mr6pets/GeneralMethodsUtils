// 内容渲染模块
import { Utils } from './utils.js';

class ContentManager {
    constructor() {
        this.tabManager = new TabManager();
        this.currentMethod = null;
    }

    // 初始化内容管理器
    init() {
        this.tabManager.init();
    }

    // 渲染欢迎页面
    renderWelcome() {
        const content = document.querySelector('.content-body');
        
        if (!content) {
            console.error('找不到内容区域元素');
            return;
        }
        
        const totalMethods = this.getTotalMethodCount();
        const totalModules = Object.keys(moduleData).length;
        const demoCount = this.getDemoCount();
        
        content.innerHTML = `
            <div class="welcome-page">
                <div class="welcome-header">
                    <div class="welcome-title">
                        <h1>
                            <span class="title-icon">🚀</span>
                            GeneralMethodsUtils 演示
                        </h1>
                        <p class="welcome-subtitle">强大的JavaScript/TypeScript工具库</p>
                    </div>
                    <div class="welcome-version">
                        <span class="version-badge">v2.0.0</span>
                    </div>
                </div>
                
                <div class="welcome-stats">
                    <div class="stat-card">
                        <div class="stat-icon">🛠️</div>
                        <div class="stat-content">
                            <div class="stat-number">${totalMethods}</div>
                            <div class="stat-label">实用方法</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-content">
                            <div class="stat-number">${totalModules}</div>
                            <div class="stat-label">功能模块</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎮</div>
                        <div class="stat-content">
                            <div class="stat-number">${demoCount}</div>
                            <div class="stat-label">在线演示</div>
                        </div>
                    </div>
                </div>
                
                <div class="welcome-features">
                    <h2 class="features-title">
                        <span class="title-icon">✨</span>
                        主要特性
                    </h2>
                    <div class="features-grid">
                        ${this.renderFeatureCards()}
                    </div>
                </div>
                
                <div class="welcome-actions">
                    <button class="btn btn-primary btn-large" onclick="app.showQuickStart()">
                        <i class="fas fa-rocket"></i>
                        快速开始
                    </button>
                    <button class="btn btn-outline btn-large" onclick="app.showAllMethods()">
                        <i class="fas fa-book"></i>
                        浏览所有方法
                    </button>
                </div>
                
                <div class="welcome-info">
                    <div class="info-section">
                        <h3>🎯 适用场景</h3>
                        <ul class="info-list">
                            <li>前端开发项目中的常用工具函数</li>
                            <li>Node.js 后端开发的辅助工具</li>
                            <li>TypeScript 项目的类型安全工具</li>
                            <li>快速原型开发和功能验证</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>📚 使用方式</h3>
                        <div class="usage-steps">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>选择方法</h4>
                                    <p>从左侧侧边栏选择需要的工具方法</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>查看示例</h4>
                                    <p>查看JavaScript和TypeScript使用示例</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>在线演示</h4>
                                    <p>部分方法提供交互式在线演示功能</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 更新标题
        this.updateTitle('GeneralMethodsUtils 演示');
    }

    // 渲染特性卡片
    renderFeatureCards() {
        const features = [
            {
                icon: '🍪',
                title: 'Cookie 管理',
                description: '简单易用的Cookie操作方法',
                moduleKey: 'cookieUtils'
            },
            {
                icon: '🔗',
                title: 'URL 处理',
                description: '强大的URL参数解析工具',
                moduleKey: 'urlUtils'
            },
            {
                icon: '🤖',
                title: 'AI/ML 集成',
                description: '人工智能和机器学习工具',
                moduleKey: 'aimlUtils'
            },
            {
                icon: '🛡️',
                title: '安全工具',
                description: '全面的安全检测和加密',
                moduleKey: 'securityUtils'
            },
            {
                icon: '📹',
                title: 'WebRTC 通信',
                description: '实时音视频通信解决方案',
                moduleKey: 'webrtcUtils'
            },
            {
                icon: '⛓️',
                title: '区块链工具',
                description: 'Web3和区块链集成工具',
                moduleKey: 'blockchainUtils'
            }
        ];
        
        return features.map(feature => `
            <div class="feature-card" onclick="app.showModuleMethods('${feature.moduleKey}')">
                <div class="feature-icon">${feature.icon}</div>
                <h3 class="feature-title">${feature.title}</h3>
                <p class="feature-description">${feature.description}</p>
                <div class="feature-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `).join('');
    }

    // 渲染方法详情页
    renderMethodDetail(moduleKey, methodKey) {
        const content = document.querySelector('.content-body');
        const module = moduleData[moduleKey];
        const method = module.methods[methodKey];
        
        if (!method || !content) return;
        
        this.currentMethod = { moduleKey, methodKey, method, module };
        
        const content_html = `
            <div class="method-detail">
                <div class="method-header">
                    <div class="breadcrumb">
                        <span class="breadcrumb-item" onclick="app.renderWelcome()">
                            <i class="fas fa-home"></i>
                            首页
                        </span>
                        <span class="breadcrumb-separator">></span>
                        <span class="breadcrumb-item" onclick="app.showModuleMethods('${moduleKey}')">
                            ${module.title}
                        </span>
                        <span class="breadcrumb-separator">></span>
                        <span class="breadcrumb-item active">${method.name}</span>
                    </div>
                    
                    <div class="method-title">
                        <h1>
                            <span class="module-icon"><i class="${module.icon}"></i></span>
                            ${method.name}
                        </h1>
                        <div class="method-badges">
                            ${method.demo ? '<span class="badge demo"><i class="fas fa-play"></i> 支持演示</span>' : ''}
                            <span class="badge module">${module.title}</span>
                        </div>
                    </div>
                    
                    <p class="method-description">${method.description}</p>
                </div>
                
                <div class="method-content">
                    <div class="content-tabs">
                        <div class="tab-buttons">
                            <button class="tab-btn active" data-tab="usage">
                                <i class="fas fa-book"></i>
                                使用说明
                            </button>
                            <button class="tab-btn" data-tab="examples">
                                <i class="fas fa-code"></i>
                                代码示例
                            </button>
                            ${method.demo ? `
                                <button class="tab-btn" data-tab="demo">
                                    <i class="fas fa-play-circle"></i>
                                    在线演示
                                </button>
                            ` : ''}
                            <button class="tab-btn" data-tab="api">
                                <i class="fas fa-file-alt"></i>
                                API 文档
                            </button>
                        </div>
                        
                        <div class="tab-content">
                            <div class="tab-panel active" data-tab="usage">
                                ${this.tabManager.renderUsageTab(method)}
                            </div>
                            
                            <div class="tab-panel" data-tab="examples">
                                ${this.tabManager.renderExamplesTab(method)}
                            </div>
                            
                            ${method.demo ? `
                                <div class="tab-panel" data-tab="demo">
                                    ${this.tabManager.renderDemoTab(methodKey)}
                                </div>
                            ` : ''}
                            
                            <div class="tab-panel" data-tab="api">
                                ${this.tabManager.renderApiTab(method)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="method-footer">
                    <div class="method-actions">
                        <button class="btn btn-outline" onclick="app.exportMethod('${moduleKey}', '${methodKey}')">
                            <i class="fas fa-download"></i>
                            导出示例
                        </button>
                        <button class="btn btn-outline" onclick="app.shareMethod('${moduleKey}', '${methodKey}')">
                            <i class="fas fa-share"></i>
                            分享方法
                        </button>
                    </div>
                    
                    <div class="method-navigation">
                        ${this.renderMethodNavigation(moduleKey, methodKey)}
                    </div>
                </div>
            </div>
        `;
        
        content.innerHTML = content_html;
        
        // 更新标题
        this.updateTitle(method.name);
    }

    // 渲染方法导航
    renderMethodNavigation(moduleKey, methodKey) {
        const module = moduleData[moduleKey];
        const methodKeys = Object.keys(module.methods);
        const currentIndex = methodKeys.indexOf(methodKey);
        
        const prevMethod = currentIndex > 0 ? methodKeys[currentIndex - 1] : null;
        const nextMethod = currentIndex < methodKeys.length - 1 ? methodKeys[currentIndex + 1] : null;
        
        return `
            <div class="method-nav">
                ${prevMethod ? `
                    <button class="nav-btn prev" onclick="app.selectMethod('${moduleKey}', '${prevMethod}')">
                        <i class="fas fa-chevron-left"></i>
                        <span class="nav-text">
                            <small>上一个</small>
                            <span>${module.methods[prevMethod].name}</span>
                        </span>
                    </button>
                ` : '<div></div>'}
                
                ${nextMethod ? `
                    <button class="nav-btn next" onclick="app.selectMethod('${moduleKey}', '${nextMethod}')">
                        <span class="nav-text">
                            <small>下一个</small>
                            <span>${module.methods[nextMethod].name}</span>
                        </span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : '<div></div>'}
            </div>
        `;
    }

    // 更新页面标题
    updateTitle(title) {
        const titleElement = document.getElementById('currentTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // 更新浏览器标题
        document.title = `${title} - GeneralMethodsUtils`;
    }

    // 获取总方法数
    getTotalMethodCount() {
        return Object.values(moduleData).reduce((total, module) => {
            return total + Object.keys(module.methods).length;
        }, 0);
    }

    // 获取演示数量
    getDemoCount() {
        return Object.values(moduleData).reduce((total, module) => {
            return total + Object.values(module.methods).filter(method => method.demo).length;
        }, 0);
    }

    // 显示模块方法列表
    showModuleMethods(moduleKey) {
        const module = moduleData[moduleKey];
        if (!module) return;
        
        // 展开对应模块
        if (window.app && window.app.sidebarManager) {
            window.app.sidebarManager.expandModule(moduleKey);
        }
        
        // 选择第一个方法
        const firstMethodKey = Object.keys(module.methods)[0];
        if (firstMethodKey && window.app) {
            window.app.selectMethod(moduleKey, firstMethodKey);
        }
    }

    // 显示快速开始
    showQuickStart() {
        // 选择第一个模块的第一个方法
        const firstModuleKey = Object.keys(moduleData)[0];
        if (firstModuleKey) {
            this.showModuleMethods(firstModuleKey);
        }
    }

    // 显示所有方法
    showAllMethods() {
        // 展开所有模块
        if (window.app && window.app.sidebarManager) {
            window.app.sidebarManager.expandAllModules();
        }
        
        // 选择第一个模块的第一个方法
        const firstModuleKey = Object.keys(moduleData)[0];
        if (firstModuleKey) {
            this.showModuleMethods(firstModuleKey);
        }
    }

    // 导出方法示例
    exportMethod(moduleKey, methodKey) {
        const module = moduleData[moduleKey];
        const method = module.methods[methodKey];
        
        if (!method) return;
        
        const exportData = {
            name: method.name,
            description: method.description,
            params: method.params,
            examples: method.examples,
            module: module.title,
            exportTime: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${method.name}-example.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        Utils.showToast('示例已导出', 'success');
    }

    // 分享方法
    shareMethod(moduleKey, methodKey) {
        const url = `${window.location.origin}${window.location.pathname}#${moduleKey}.${methodKey}`;
        
        if (navigator.share) {
            navigator.share({
                title: `${moduleData[moduleKey].methods[methodKey].name} - GeneralMethodsUtils`,
                text: moduleData[moduleKey].methods[methodKey].description,
                url: url
            });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                Utils.showToast('链接已复制到剪贴板', 'success');
            }).catch(() => {
                Utils.showToast('分享失败', 'error');
            });
        }
    }

    // 获取当前方法
    getCurrentMethod() {
        return this.currentMethod;
    }
}

// 导出内容管理器
export { ContentManager };

// 为了向后兼容，也将类添加到全局对象
window.ContentManager = ContentManager;