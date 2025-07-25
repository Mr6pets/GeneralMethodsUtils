// 事件管理模块
import { Utils } from './utils.js';

class EventManager {
    constructor() {
        this.shortcuts = new Map();
        this.isInitialized = false;
    }

    // 初始化事件管理器
    init() {
        if (this.isInitialized) return;
        
        this.bindGlobalEvents();
        this.bindKeyboardShortcuts();
        this.bindWindowEvents();
        this.isInitialized = true;
    }

    // 绑定全局事件
    bindGlobalEvents() {
        // 主题切换按钮
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                Utils.toggleTheme();
            });
        }

        // 搜索框事件
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // 搜索输入事件
            searchInput.addEventListener('input', Utils.debounce((e) => {
                if (window.app && window.app.searchManager) {
                    window.app.searchManager.search(e.target.value);
                }
            }, 300));

            // 搜索框快捷键
            searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeydown(e);
            });

            // 搜索框焦点事件
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
        }

        // 清除搜索按钮
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (window.app && window.app.searchManager) {
                    window.app.searchManager.clearSearch();
                }
            });
        }

        // 快速启动按钮
        const quickStartBtn = document.getElementById('quickStartBtn');
        if (quickStartBtn) {
            quickStartBtn.addEventListener('click', () => {
                if (window.app && window.app.contentManager) {
                    window.app.contentManager.showQuickStart();
                }
            });
        }

        // 查看所有方法按钮
        const allMethodsBtn = document.getElementById('allMethodsBtn');
        if (allMethodsBtn) {
            allMethodsBtn.addEventListener('click', () => {
                if (window.app && window.app.contentManager) {
                    window.app.contentManager.showAllMethods();
                }
            });
        }

        // 复制代码按钮
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const activeTab = document.querySelector('.tab-panel.active');
                if (activeTab) {
                    const codeElement = activeTab.querySelector('code');
                    if (codeElement && window.app && window.app.utils) {
                        window.app.utils.copyCode(codeElement.textContent);
                    }
                }
            });
        }

        // 运行示例按钮
        const runBtn = document.getElementById('runBtn');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                const activeTab = document.querySelector('.tab-panel.active');
                if (activeTab) {
                    const codeElement = activeTab.querySelector('code');
                    if (codeElement && window.app && window.app.tabManager) {
                        window.app.tabManager.runCode(codeElement.textContent);
                    }
                }
            });
        }

        // 模态框关闭事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
            
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            }
        });

        // 复制按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn') || 
                e.target.closest('.copy-btn')) {
                const copyBtn = e.target.classList.contains('copy-btn') ? 
                    e.target : e.target.closest('.copy-btn');
                const codeBlock = copyBtn.closest('.code-block');
                if (codeBlock) {
                    const code = codeBlock.querySelector('code');
                    if (code) {
                        Utils.copyCode(code.textContent);
                    }
                }
            }
        });

        // 代码运行按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('run-btn') || 
                e.target.closest('.run-btn')) {
                const runBtn = e.target.classList.contains('run-btn') ? 
                    e.target : e.target.closest('.run-btn');
                const codeBlock = runBtn.closest('.code-block');
                if (codeBlock && window.app && window.app.tabManager) {
                    const code = codeBlock.querySelector('code');
                    if (code) {
                        window.app.tabManager.runCode(code.textContent);
                    }
                }
            }
        });
    }

    // 处理搜索框键盘事件
    handleSearchKeydown(e) {
        switch (e.key) {
            case 'Escape':
                e.target.blur();
                if (window.app && window.app.searchManager) {
                    window.app.searchManager.clearSearch();
                }
                break;
            case 'Enter':
                e.preventDefault();
                // 选择第一个搜索结果
                const firstResult = document.querySelector('.method-item.search-result');
                if (firstResult) {
                    firstResult.click();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSearchResults('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSearchResults('up');
                break;
        }
    }

    // 导航搜索结果
    navigateSearchResults(direction) {
        const results = document.querySelectorAll('.method-item.search-result');
        if (results.length === 0) return;

        const currentActive = document.querySelector('.method-item.search-result.keyboard-active');
        let nextIndex = 0;

        if (currentActive) {
            currentActive.classList.remove('keyboard-active');
            const currentIndex = Array.from(results).indexOf(currentActive);
            
            if (direction === 'down') {
                nextIndex = (currentIndex + 1) % results.length;
            } else {
                nextIndex = (currentIndex - 1 + results.length) % results.length;
            }
        }

        const nextResult = results[nextIndex];
        if (nextResult) {
            nextResult.classList.add('keyboard-active');
            nextResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // 绑定键盘快捷键
    bindKeyboardShortcuts() {
        // 注册快捷键
        this.registerShortcut('ctrl+k', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }, '搜索方法');

        this.registerShortcut('ctrl+/', () => {
            this.showShortcutsHelp();
        }, '显示快捷键帮助');

        this.registerShortcut('ctrl+shift+t', () => {
            Utils.toggleTheme();
        }, '切换主题');

        this.registerShortcut('escape', () => {
            // 关闭模态框
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                this.closeModal(openModal);
                return;
            }
            
            // 清除搜索
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                if (window.app && window.app.searchManager) {
                    window.app.searchManager.clearSearch();
                }
                return;
            }
            
            // 返回首页
            if (window.app && window.app.contentManager) {
                window.app.contentManager.showWelcome();
            }
        }, '取消/返回');

        this.registerShortcut('ctrl+shift+e', () => {
            if (window.app && window.app.sidebarManager) {
                window.app.sidebarManager.expandAllModules();
            }
        }, '展开所有模块');

        this.registerShortcut('ctrl+shift+c', () => {
            if (window.app && window.app.sidebarManager) {
                window.app.sidebarManager.collapseAllModules();
            }
        }, '收起所有模块');

        // 绑定全局键盘事件
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    }

    // 注册快捷键
    registerShortcut(combination, callback, description) {
        this.shortcuts.set(combination.toLowerCase(), {
            callback,
            description
        });
    }

    // 处理全局键盘事件
    handleGlobalKeydown(e) {
        // 构建快捷键组合
        const keys = [];
        if (e.ctrlKey) keys.push('ctrl');
        if (e.shiftKey) keys.push('shift');
        if (e.altKey) keys.push('alt');
        if (e.metaKey) keys.push('meta');
        
        const key = e.key.toLowerCase();
        if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
            keys.push(key);
        }
        
        const combination = keys.join('+');
        const shortcut = this.shortcuts.get(combination);
        
        if (shortcut) {
            // 检查是否在输入框中
            const activeElement = document.activeElement;
            const isInInput = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            );
            
            // 某些快捷键在输入框中也要生效
            const alwaysActive = ['escape', 'ctrl+k', 'ctrl+/', 'ctrl+shift+t'];
            
            if (!isInInput || alwaysActive.includes(combination)) {
                e.preventDefault();
                shortcut.callback(e);
            }
        }
    }

    // 绑定窗口事件
    bindWindowEvents() {
        // 窗口大小变化
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // 浏览器前进后退
        window.addEventListener('popstate', (e) => {
            if (window.app && window.app.sidebarManager) {
                if (!window.app.sidebarManager.loadFromURL()) {
                    // 如果URL无效，显示欢迎页
                    if (window.app.contentManager) {
                        window.app.contentManager.showWelcome();
                    }
                }
            }
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 页面重新可见时，检查是否需要更新
                this.handlePageVisible();
            }
        });

        // 页面加载完成
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });

        // 页面卸载前
        window.addEventListener('beforeunload', () => {
            this.handlePageUnload();
        });
    }

    // 处理窗口大小变化
    handleWindowResize() {
        // 更新响应式布局
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            // 移动端布局
            if (sidebar) {
                sidebar.classList.add('mobile');
            }
            if (mainContent) {
                mainContent.classList.add('mobile');
            }
        } else {
            // 桌面端布局
            if (sidebar) {
                sidebar.classList.remove('mobile');
            }
            if (mainContent) {
                mainContent.classList.remove('mobile');
            }
        }
    }

    // 处理页面可见
    handlePageVisible() {
        // 可以在这里添加页面重新可见时的逻辑
        console.log('页面重新可见');
    }

    // 处理页面加载完成
    handlePageLoad() {
        // 页面加载完成后的初始化
        console.log('页面加载完成');
        
        // 初始化响应式布局
        this.handleWindowResize();
    }

    // 处理页面卸载前
    handlePageUnload() {
        // 保存用户状态
        this.saveUserState();
    }

    // 保存用户状态
    saveUserState() {
        try {
            const state = {
                theme: document.documentElement.getAttribute('data-theme'),
                expandedModules: window.app?.sidebarManager?.getExpandedModules() || [],
                currentMethod: window.app?.sidebarManager?.getCurrentMethod() || null,
                timestamp: Date.now()
            };
            
            localStorage.setItem('demoAppState', JSON.stringify(state));
        } catch (error) {
            console.warn('保存用户状态失败:', error);
        }
    }

    // 恢复用户状态
    restoreUserState() {
        try {
            const stateStr = localStorage.getItem('demoAppState');
            if (!stateStr) return;
            
            const state = JSON.parse(stateStr);
            
            // 检查状态是否过期（7天）
            if (Date.now() - state.timestamp > 7 * 24 * 60 * 60 * 1000) {
                localStorage.removeItem('demoAppState');
                return;
            }
            
            // 恢复主题
            if (state.theme) {
                document.documentElement.setAttribute('data-theme', state.theme);
            }
            
            // 恢复展开的模块
            if (state.expandedModules && window.app?.sidebarManager) {
                window.app.sidebarManager.setExpandedModules(state.expandedModules);
            }
            
            // 恢复当前方法
            if (state.currentMethod && window.app?.sidebarManager) {
                const [moduleKey, methodKey] = state.currentMethod.split('.');
                if (moduleKey && methodKey) {
                    window.app.sidebarManager.setCurrentMethod(moduleKey, methodKey);
                }
            }
        } catch (error) {
            console.warn('恢复用户状态失败:', error);
            localStorage.removeItem('demoAppState');
        }
    }

    // 显示快捷键帮助
    showShortcutsHelp() {
        const shortcuts = Array.from(this.shortcuts.entries()).map(([key, info]) => {
            return `
                <div class="shortcut-item">
                    <kbd>${key.replace(/\+/g, '</kbd> + <kbd>')}</kbd>
                    <span>${info.description}</span>
                </div>
            `;
        }).join('');
        
        const modal = this.createModal('快捷键帮助', `
            <div class="shortcuts-help">
                <div class="shortcuts-list">
                    ${shortcuts}
                </div>
                <div class="shortcuts-tip">
                    <i class="fas fa-lightbulb"></i>
                    提示：按 <kbd>Esc</kbd> 键可以关闭任何模态框
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    // 创建模态框
    createModal(title, content, className = '') {
        const modal = document.createElement('div');
        modal.className = `modal ${className}`;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        return modal;
    }

    // 显示模态框
    showModal(modal) {
        document.body.appendChild(modal);
        
        // 触发动画
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // 焦点管理
        const firstFocusable = modal.querySelector('button, input, textarea, select, a[href]');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    // 关闭模态框
    closeModal(modal) {
        modal.classList.remove('show');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // 销毁事件管理器
    destroy() {
        this.shortcuts.clear();
        this.isInitialized = false;
    }

    // 添加showModalById方法到EventManager类内部
    showModalById(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.showModal(modal);
        }
    }
}

// 导出事件管理器
export { EventManager };
window.EventManager = EventManager;

// 创建全局showModal函数供向后兼容
window.showModal = function(modalId) {
    if (window.app && window.app.eventManager) {
        window.app.eventManager.showModalById(modalId);
    }
};

