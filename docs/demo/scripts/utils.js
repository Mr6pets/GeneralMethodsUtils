// 工具函数模块
class Utils {
    // 代码高亮
    static highlightCode(code, language) {
        // 先转义HTML，避免标签冲突
        let highlightedCode = Utils.escapeHtml(code);
        
        // 简单的语法高亮实现 - 修复标签嵌套问题
        // 使用临时占位符避免重复处理
        const placeholders = {
            comment: '___COMMENT___',
            keyword: '___KEYWORD___',
            literal: '___LITERAL___',
            string: '___STRING___',
            number: '___NUMBER___'
        };
        
        // 第一步：标记所有需要高亮的部分
        const tokens = [];
        
        // 处理注释（优先级最高）
        highlightedCode = highlightedCode.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            const id = tokens.length;
            tokens.push({ type: 'comment', content: match });
            return `${placeholders.comment}${id}`;
        });
        
        highlightedCode = highlightedCode.replace(/\/\/.*$/gm, (match) => {
            const id = tokens.length;
            tokens.push({ type: 'comment', content: match });
            return `${placeholders.comment}${id}`;
        });
        
        // 处理字符串
        highlightedCode = highlightedCode.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, (match) => {
            const id = tokens.length;
            tokens.push({ type: 'string', content: match });
            return `${placeholders.string}${id}`;
        });
        
        // 处理关键字
        highlightedCode = highlightedCode.replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|async|await|interface|type|enum)\b/g, (match, p1) => {
            const id = tokens.length;
            tokens.push({ type: 'keyword', content: p1 });
            return `${placeholders.keyword}${id}`;
        });
        
        // 处理字面量
        highlightedCode = highlightedCode.replace(/\b(true|false|null|undefined)\b/g, (match, p1) => {
            const id = tokens.length;
            tokens.push({ type: 'literal', content: p1 });
            return `${placeholders.literal}${id}`;
        });
        
        // 处理数字
        highlightedCode = highlightedCode.replace(/\b\d+\b/g, (match) => {
            const id = tokens.length;
            tokens.push({ type: 'number', content: match });
            return `${placeholders.number}${id}`;
        });
        
        // 第二步：替换占位符为实际的HTML标签
        tokens.forEach((token, index) => {
            const placeholder = `${placeholders[token.type]}${index}`;
            const replacement = `<span class="${token.type}">${token.content}</span>`;
            highlightedCode = highlightedCode.replace(placeholder, replacement);
        });
            
        return highlightedCode;
    }

    // HTML 转义
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 复制代码
    static async copyCode(codeOrButton) {
        let code;
        let button = null;
        
        // 判断传入的是代码文本还是按钮元素
        if (typeof codeOrButton === 'string') {
            code = codeOrButton;
        } else if (codeOrButton && codeOrButton.dataset && codeOrButton.dataset.code) {
            code = codeOrButton.dataset.code;
            button = codeOrButton;
        } else {
            Utils.showToast('复制失败，无效的代码内容', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(code);
            Utils.showToast('代码已复制到剪贴板', 'success');
            
            // 如果有按钮，临时改变按钮文本
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '✅ 已复制';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            }
        } catch (err) {
            Utils.showToast('复制失败，请手动复制', 'error');
        }
    }

    // 主题切换
    static toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'system';
        let nextTheme;
        
        // 循环切换：system -> light -> dark -> system
        switch (currentTheme) {
            case 'system':
                nextTheme = 'light';
                break;
            case 'light':
                nextTheme = 'dark';
                break;
            case 'dark':
                nextTheme = 'system';
                break;
            default:
                nextTheme = 'system';
        }
        
        Utils.setTheme(nextTheme);
        Utils.updateThemeIcon(nextTheme);
        Utils.showThemeTooltip(nextTheme);
        
        const themeNames = {
            'system': '跟随系统',
            'light': '浅色',
            'dark': '深色'
        };
        
        Utils.showToast(`已切换到${themeNames[nextTheme]}主题`, 'info');
    }
    
    // 设置主题
    static setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        // 移除所有主题类
        document.body.classList.remove('dark-theme', 'light-theme');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else if (theme === 'system') {
            // 跟随系统设置
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.add('light-theme');
            }
        }
    }
    
    // 更新主题图标
    static updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            // 使用更直观的图标组合
            const iconConfigs = {
                'system': {
                    icon: 'fas fa-circle-half-stroke',
                    title: '跟随系统主题'
                },
                'light': {
                    icon: 'fas fa-sun',
                    title: '浅色主题'
                },
                'dark': {
                    icon: 'fas fa-moon',
                    title: '深色主题'
                }
            };
            
            const config = iconConfigs[theme] || iconConfigs.system;
            
            // 添加切换动画
            themeIcon.style.transform = 'scale(0.8) rotate(180deg)';
            themeIcon.style.opacity = '0.5';
            
            setTimeout(() => {
                themeIcon.className = config.icon;
                themeIcon.style.transform = 'scale(1) rotate(0deg)';
                themeIcon.style.opacity = '1';
            }, 150);
            
            // 更新按钮的title属性
            const themeButton = document.getElementById('themeToggle');
            if (themeButton) {
                themeButton.title = config.title;
            }
        }
    }
    
    // 显示主题切换提示
    static showThemeTooltip(theme) {
        const themeButton = document.getElementById('themeToggle');
        if (!themeButton) return;
        
        const themeNames = {
            'system': '跟随系统',
            'light': '浅色模式',
            'dark': '深色模式'
        };
        
        // 创建提示元素
        const tooltip = document.createElement('div');
        tooltip.className = 'theme-tooltip';
        tooltip.textContent = themeNames[theme];
        
        // 添加到按钮旁边
        themeButton.appendChild(tooltip);
        
        // 显示动画
        setTimeout(() => tooltip.classList.add('show'), 10);
        
        // 自动隐藏
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, 1500);
    }

    // 初始化主题
    static initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        Utils.setTheme(savedTheme);
        Utils.updateThemeIcon(savedTheme);
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'system') {
                Utils.setTheme('system'); // 重新应用系统主题
            }
        });
        
        return {
            theme: savedTheme,
            language: savedLanguage || 'js'
        };
    }

    // 显示提示消息
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${Utils.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        const toastContainer = document.getElementById('toast-container') || (() => {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
            return container;
        })();
        
        toastContainer.appendChild(toast);
        
        // 动画显示
        setTimeout(() => toast.classList.add('show'), 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 获取提示图标
    static getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 格式化数字
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 生成唯一ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// 加载管理器
class LoadingManager {
    constructor() {
        this.loadingElement = null;
        this.init();
    }

    init() {
        // 创建加载指示器
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'loading-indicator';
        this.loadingElement.className = 'loading-indicator';
        this.loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
        `;
        document.body.appendChild(this.loadingElement);
    }

    show(text = '加载中...') {
        if (this.loadingElement) {
            this.loadingElement.querySelector('.loading-text').textContent = text;
            this.loadingElement.style.display = 'flex';
        }
    }

    hide() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    destroy() {
        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }
}

// Toast 管理器
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // 创建 toast 容器
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // 动画显示
        setTimeout(() => toast.classList.add('show'), 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}

// 导出类供其他模块使用
export { Utils, LoadingManager, ToastManager };

// 为了向后兼容，也将类添加到全局对象
window.Utils = Utils;
window.LoadingManager = LoadingManager;
window.ToastManager = ToastManager;