// 显示主题切换提示
static showThemeTooltip(theme) {
    const themeButton = document.getElementById('themeToggle');
    if (!themeButton) return;
    
    const themeNames = {
        'system': '跟随系统',
        'light': '浅色模式', 
        'dark': '深色模式'
    };
    
    // ... existing code ...
    
    // 创建提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'theme-tooltip';
    tooltip.textContent = themeNames[theme];
    
    // 添加更好的样式
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // ... existing code ...
}