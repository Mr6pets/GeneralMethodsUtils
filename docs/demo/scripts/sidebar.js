import { getModuleData, userState } from './data/index.js';
import { DemoGenerator } from './demos/index.js';
import { Utils } from './utils.js';

// 侧边栏管理模块
class SidebarManager {
    constructor() {
        this.expandedModules = new Set();
        this.currentMethod = null;
    }

    // 初始化侧边栏
    async init() {
        // 获取模块数据
        this.moduleData = await getModuleData();
        
        this.renderSidebar();
        this.bindEvents();
    }

    // 渲染侧边栏
    renderSidebar() {
        const sidebar = document.getElementById('sidebarNav');
        
        if (!sidebar) {
            console.error('找不到侧边栏元素');
            return;
        }
        
        const sidebarContent = `
            <div class="sidebar-header">
                <div class="sidebar-title">
                    <h2>
                        <i class="fas fa-tools"></i>
                        方法库
                    </h2>
                    <div class="version-info">v2.0.0</div>
                </div>
                <div class="sidebar-actions">
                    <button class="btn-icon" onclick="app.sidebarManager.expandAllModules()" title="展开所有">
                        <i class="fas fa-expand-alt"></i>
                    </button>
                    <button class="btn-icon" onclick="app.sidebarManager.collapseAllModules()" title="收起所有">
                        <i class="fas fa-compress-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="method-tree">
                ${this.buildMethodTree()}
            </div>
            
            <div class="sidebar-footer">
                <div class="stats">
                    <div class="stat-item">
                        <i class="fas fa-code"></i>
                        <span>共 ${this.getTotalMethodCount()} 个方法</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-cube"></i>
                        <span>${Object.keys(this.moduleData).length} 个模块</span>
                    </div>
                </div>
            </div>
        `;
        
        sidebar.innerHTML = sidebarContent;
    }

    // 构建方法树
    buildMethodTree() {
        return Object.keys(this.moduleData).map(moduleKey => {
            const module = this.moduleData[moduleKey];
            const isExpanded = this.expandedModules.has(moduleKey);
            const methodCount = Object.keys(module.methods).length;
            
            const methodsList = Object.keys(module.methods).map(methodKey => {
                const method = module.methods[methodKey];
                const isActive = this.currentMethod === `${moduleKey}.${methodKey}`;
                
                return `
                    <div class="method-item ${isActive ? 'active' : ''}" 
                         data-module="${moduleKey}" 
                         data-method="${methodKey}"
                         title="${method.description}">
                        <div class="method-content">
                            <div class="method-info">
                                <span class="method-name">${method.name}</span>
                                <div class="method-badges">
                                    ${method.demo ? '<span class="badge demo"><i class="fas fa-play"></i></span>' : ''}
                                </div>
                            </div>
                            <div class="method-desc">${method.description}</div>
                        </div>
                        <div class="method-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `;
            }).join('');
            
            return `
                <div class="module-group" data-module="${moduleKey}">
                    <div class="module-header ${isExpanded ? 'expanded' : ''}">
                        <div class="module-info">
                            <span class="expand-icon">
                                <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'}"></i>
                            </span>
                            <span class="module-icon"><i class="${module.icon}"></i></span>
                            <span class="module-title">${module.title}</span>
                        </div>
                        <div class="module-meta">
                            <span class="method-count">${methodCount}</span>
                        </div>
                    </div>
                    <div class="methods-list ${isExpanded ? 'expanded' : ''}">
                        <div class="methods-container">
                            ${methodsList}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 绑定侧边栏事件
    bindEvents() {
        // 模块头部点击事件
        document.addEventListener('click', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') {
                return;
            }
            
            const moduleHeader = e.target.closest('.module-header');
            if (moduleHeader) {
                e.preventDefault();
                e.stopPropagation();
                
                const moduleGroup = moduleHeader.closest('.module-group');
                if (moduleGroup) {
                    const moduleKey = moduleGroup.dataset.module;
                    if (moduleKey) {
                        this.toggleModule(moduleKey);
                    }
                }
                return;
            }
            
            // 方法点击事件
            const methodItem = e.target.closest('.method-item');
            if (methodItem) {
                e.preventDefault();
                e.stopPropagation();
                
                const moduleKey = methodItem.dataset.module;
                const methodKey = methodItem.dataset.method;
                
                if (moduleKey && methodKey) {
                    this.selectMethod(moduleKey, methodKey);
                }
            }
        });

        // 模块悬停效果
        document.addEventListener('mouseenter', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const moduleHeader = e.target.closest('.module-header');
                if (moduleHeader) {
                    moduleHeader.classList.add('hover');
                }
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const moduleHeader = e.target.closest('.module-header');
                if (moduleHeader) {
                    moduleHeader.classList.remove('hover');
                }
            }
        }, true);
    }

    // 选择方法
    selectMethod(moduleKey, methodKey) {
        // 更新当前方法
        this.currentMethod = `${moduleKey}.${methodKey}`;
        
        // 更新侧边栏状态
        this.updateMethodSelection(moduleKey, methodKey);
        
        // 确保模块展开
        this.expandModule(moduleKey);
        
        // 通知应用程序
        if (window.app && window.app.onMethodSelected) {
            window.app.onMethodSelected(moduleKey, methodKey);
        }
        
        // 更新URL
        this.updateURL(moduleKey, methodKey);
    }

    // 更新方法选择状态
    updateMethodSelection(moduleKey, methodKey) {
        // 清除所有活动状态
        document.querySelectorAll('.method-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 设置当前活动状态
        const activeItem = document.querySelector(
            `[data-module="${moduleKey}"][data-method="${methodKey}"]`
        );
        if (activeItem) {
            activeItem.classList.add('active');
            
            // 滚动到可见区域
            this.scrollToMethod(activeItem);
        }
    }

    // 滚动到方法
    scrollToMethod(methodElement) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar || !methodElement) return;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const methodRect = methodElement.getBoundingClientRect();
        
        if (methodRect.top < sidebarRect.top || methodRect.bottom > sidebarRect.bottom) {
            methodElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // 切换模块展开状态
    toggleModule(moduleKey) {
        if (this.expandedModules.has(moduleKey)) {
            this.collapseModule(moduleKey);
        } else {
            this.expandModule(moduleKey);
        }
    }

    // 展开模块
    expandModule(moduleKey) {
        this.expandedModules.add(moduleKey);
        this.updateModuleState(moduleKey, true);
    }

    // 收起模块
    collapseModule(moduleKey) {
        this.expandedModules.delete(moduleKey);
        this.updateModuleState(moduleKey, false);
    }

    // 更新模块状态
    updateModuleState(moduleKey, isExpanded) {
        const moduleGroup = document.querySelector(`[data-module="${moduleKey}"]`);
        if (!moduleGroup) return;
        
        const moduleHeader = moduleGroup.querySelector('.module-header');
        const methodsList = moduleGroup.querySelector('.methods-list');
        const expandIcon = moduleGroup.querySelector('.expand-icon i');
        
        if (moduleHeader) {
            moduleHeader.classList.toggle('expanded', isExpanded);
        }
        
        if (methodsList) {
            methodsList.classList.toggle('expanded', isExpanded);
        }
        
        if (expandIcon) {
            expandIcon.className = `fas fa-chevron-${isExpanded ? 'down' : 'right'}`;
        }
    }

    // 展开所有模块
    expandAllModules() {
        Object.keys(this.moduleData).forEach(moduleKey => {
            this.expandModule(moduleKey);
        });
        Utils.showToast('已展开所有模块', 'info');
    }

    // 收起所有模块
    collapseAllModules() {
        Object.keys(this.moduleData).forEach(moduleKey => {
            this.collapseModule(moduleKey);
        });
        Utils.showToast('已收起所有模块', 'info');
    }

    // 更新URL
    updateURL(moduleKey, methodKey) {
        const newHash = `#${moduleKey}.${methodKey}`;
        if (window.location.hash !== newHash) {
            history.pushState(
                { method: `${moduleKey}.${methodKey}` }, 
                '', 
                newHash
            );
        }
    }

    // 从URL加载方法
    loadFromURL() {
        const hash = window.location.hash.slice(1);
        if (hash && hash.includes('.')) {
            const [moduleKey, methodKey] = hash.split('.');
            if (this.moduleData[moduleKey] && this.moduleData[moduleKey].methods[methodKey]) {
                this.selectMethod(moduleKey, methodKey);
                return true;
            }
        }
        return false;
    }

    // 获取总方法数
    getTotalMethodCount() {
        return Object.values(this.moduleData).reduce((total, module) => {
            return total + Object.keys(module.methods).length;
        }, 0);
    }

    // 高亮搜索结果
    highlightSearchResults(searchResults) {
        // 清除之前的高亮
        this.clearSearchHighlight();
        
        if (!searchResults || searchResults.length === 0) {
            return;
        }
        
        // 隐藏所有模块
        document.querySelectorAll('.module-group').forEach(group => {
            group.style.display = 'none';
        });
        
        // 显示匹配的模块和方法
        searchResults.forEach(result => {
            const moduleGroup = document.querySelector(`[data-module="${result.moduleKey}"]`);
            if (moduleGroup) {
                moduleGroup.style.display = 'block';
                this.expandModule(result.moduleKey);
                
                // 隐藏所有方法
                moduleGroup.querySelectorAll('.method-item').forEach(item => {
                    item.style.display = 'none';
                });
                
                // 显示匹配的方法
                result.methods.forEach(methodResult => {
                    const methodItem = moduleGroup.querySelector(
                        `[data-method="${methodResult.methodKey}"]`
                    );
                    if (methodItem) {
                        methodItem.style.display = 'block';
                        methodItem.classList.add('search-result');
                    }
                });
            }
        });
    }

    // 清除搜索高亮
    clearSearchHighlight() {
        // 显示所有模块和方法
        document.querySelectorAll('.module-group').forEach(group => {
            group.style.display = 'block';
        });
        
        document.querySelectorAll('.method-item').forEach(item => {
            item.style.display = 'block';
            item.classList.remove('search-result');
        });
    }

    // 获取当前选中的方法
    getCurrentMethod() {
        return this.currentMethod;
    }

    // 设置当前方法
    setCurrentMethod(moduleKey, methodKey) {
        this.currentMethod = `${moduleKey}.${methodKey}`;
        this.updateMethodSelection(moduleKey, methodKey);
    }

    // 获取展开的模块列表
    getExpandedModules() {
        return Array.from(this.expandedModules);
    }

    // 设置展开的模块列表
    setExpandedModules(modules) {
        this.expandedModules = new Set(modules);
        this.renderSidebar();
    }
}

// 导出侧边栏管理器
export { SidebarManager };

// 为了向后兼容，也将类添加到全局对象
window.SidebarManager = SidebarManager;