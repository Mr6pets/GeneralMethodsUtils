// 工具函数模块
class Utils {
    // 代码高亮
    static highlightCode(code, language) {
        // 简单的语法高亮实现
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
            .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
            .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|async|await)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
            .replace(/(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="string">$&</span>')
            .replace(/\b\d+\b/g, '<span class="number">$&</span>');
    }

    // HTML 转义
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 复制代码
    static async copyCode(button) {
        const code = button.dataset.code;
        try {
            await navigator.clipboard.writeText(code);
            Utils.showToast('代码已复制到剪贴板', 'success');
            
            // 临时改变按钮文本
            const originalText = button.innerHTML;
            button.innerHTML = '✅ 已复制';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            Utils.showToast('复制失败，请手动复制', 'error');
        }
    }

    // 主题切换
    static toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', isDark);
        Utils.showToast(`已切换到${isDark ? '深色' : '浅色'}主题`, 'info');
    }

    // 初始化主题
    static initTheme() {
        const savedTheme = localStorage.getItem('darkTheme');
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
        }
        
        return {
            theme: savedTheme === 'true' ? 'dark' : 'light',
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

// 导出工具类
window.Utils = Utils;
window.LoadingManager = LoadingManager;
window.ToastManager = ToastManager;