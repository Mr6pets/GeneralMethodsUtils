// 创建新文件或在现有文件中添加
class UIController {
    constructor() {
        this.config = window.globalConfig;
    }

    // 初始化UI显示状态
    initializeUI() {
        this.updateButtonVisibility();
    }

    // 更新按钮显示状态
    updateButtonVisibility() {
        const loginBtn = document.getElementById('loginBtn');
        const upgradeBtn = document.getElementById('upgradeBtn');
        const themeToggle = document.getElementById('themeToggle');

        // 控制登录按钮显示
        if (loginBtn) {
            loginBtn.style.display = this.config.ui.showLoginButton ? 'inline-flex' : 'none';
        }

        // 控制升级按钮显示
        if (upgradeBtn) {
            upgradeBtn.style.display = this.config.ui.showUpgradeButton ? 'inline-flex' : 'none';
        }

        // 控制主题切换按钮显示
        if (themeToggle) {
            themeToggle.style.display = this.config.ui.showThemeToggle ? 'inline-flex' : 'none';
        }
    }

    // 动态切换按钮显示状态
    toggleButton(buttonType, show) {
        this.config.ui[`show${buttonType}Button`] = show;
        this.updateButtonVisibility();
    }

    // 批量设置按钮显示状态
    setButtonsVisibility(config) {
        Object.assign(this.config.ui, config);
        this.updateButtonVisibility();
    }
}

// 创建全局实例
window.uiController = new UIController();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.uiController.initializeUI();
});