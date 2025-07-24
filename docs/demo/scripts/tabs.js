// 标签页管理模块
import { Utils } from './utils.js';

class TabManager {
    constructor() {
        this.currentTab = 'usage';
        this.currentLanguage = 'js';
    }

    // 初始化标签页
    init() {
        this.bindEvents();
    }

    // 初始化标签页内容
    initTabs(moduleKey, methodKey) {
        // 这个方法用于初始化特定方法的标签页内容
        // 可以在这里进行标签页的初始化逻辑
        console.log(`初始化标签页: ${moduleKey}.${methodKey}`);
        
        // 确保默认显示第一个标签页
        this.switchTab(this.currentTab);
        
        // 恢复用户的语言偏好
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && (savedLanguage === 'js' || savedLanguage === 'ts')) {
            this.switchLanguage(savedLanguage);
        }
    }

    // 绑定标签页事件
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            }
            
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.dataset.lang;
                if (lang) {
                    this.switchLanguage(lang);
                }
            }
        });
    }

    // 切换标签页
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // 更新标签内容显示
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.tab === tabName);
        });
        
        // 触发标签切换事件
        this.onTabSwitch(tabName);
    }

    // 切换编程语言
    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        
        // 更新所有语言按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // 更新所有代码块显示
        document.querySelectorAll('.code-block').forEach(block => {
            block.classList.toggle('active', block.dataset.lang === lang);
        });
        
        // 保存用户偏好
        localStorage.setItem('preferredLanguage', lang);
        
        // 触发语言切换事件
        this.onLanguageSwitch(lang);
    }

    // 渲染使用说明标签页
    renderUsageTab(method) {
        return `
            <div class="usage-content">
                <div class="usage-section">
                    <h3>📝 方法说明</h3>
                    <p class="method-description">${method.description}</p>
                </div>
                
                <div class="usage-section">
                    <h3>📥 参数说明</h3>
                    <div class="params-table">
                        ${method.params ? method.params.map(param => `
                            <div class="param-row">
                                <div class="param-name">
                                    <code>${param.name}</code>
                                    ${param.required ? '<span class="required">*</span>' : ''}
                                </div>
                                <div class="param-type">
                                    <span class="type-badge">${param.type}</span>
                                </div>
                                <div class="param-desc">${param.description}</div>
                            </div>
                        `).join('') : '<p class="no-params">该方法无需参数</p>'}
                    </div>
                </div>
                
                <div class="usage-section">
                    <h3>🎯 使用场景</h3>
                    <ul class="usage-scenarios">
                        <li>适用于需要${method.description.toLowerCase()}的场景</li>
                        <li>可以在前端和Node.js环境中使用</li>
                        <li>支持TypeScript类型定义</li>
                        ${method.demo ? '<li>提供在线演示功能</li>' : ''}
                    </ul>
                </div>
                
                <div class="usage-section">
                    <h3>💡 注意事项</h3>
                    <div class="usage-notes">
                        <div class="note-item">
                            <i class="fas fa-info-circle"></i>
                            <span>请确保在使用前正确引入工具库</span>
                        </div>
                        <div class="note-item">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>部分方法可能需要特定的浏览器环境支持</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染代码示例标签页
    renderExamplesTab(method) {
        return `
            <div class="examples-content">
                <div class="language-switch">
                    <button class="lang-btn ${this.currentLanguage === 'js' ? 'active' : ''}" 
                            data-lang="js">JavaScript</button>
                    <button class="lang-btn ${this.currentLanguage === 'ts' ? 'active' : ''}" 
                            data-lang="ts">TypeScript</button>
                </div>
                
                <div class="code-examples">
                    <div class="code-block ${this.currentLanguage === 'js' ? 'active' : ''}" data-lang="js">
                        <div class="code-header">
                            <span class="code-title">
                                <i class="fab fa-js-square"></i>
                                JavaScript 示例
                            </span>
                            <div class="code-actions">
                                <button class="copy-btn" onclick="Utils.copyCode(this)" 
                                        data-code="${Utils.escapeHtml(method.examples.js)}">
                                    <i class="fas fa-copy"></i> 复制代码
                                </button>
                                <button class="run-btn" onclick="window.app.tabManager.runCode('${Utils.escapeHtml(method.examples.js)}', 'js')">
                                    <i class="fas fa-play"></i> 运行
                                </button>
                            </div>
                        </div>
                        <pre><code class="language-javascript">${Utils.highlightCode(method.examples.js, 'javascript')}</code></pre>
                    </div>
                    
                    <div class="code-block ${this.currentLanguage === 'ts' ? 'active' : ''}" data-lang="ts">
                        <div class="code-header">
                            <span class="code-title">
                                <i class="fab fa-js-square"></i>
                                TypeScript 示例
                            </span>
                            <div class="code-actions">
                                <button class="copy-btn" onclick="Utils.copyCode(this)" 
                                        data-code="${Utils.escapeHtml(method.examples.ts)}">
                                    <i class="fas fa-copy"></i> 复制代码
                                </button>
                                <button class="run-btn" onclick="window.app.tabManager.runCode('${Utils.escapeHtml(method.examples.ts)}', 'ts')">
                                    <i class="fas fa-play"></i> 运行
                                </button>
                            </div>
                        </div>
                        <pre><code class="language-typescript">${Utils.highlightCode(method.examples.ts, 'typescript')}</code></pre>
                    </div>
                </div>
                
                <div class="example-output" id="exampleOutput" style="display: none;">
                    <div class="output-header">
                        <h4>运行结果</h4>
                        <button class="clear-output" onclick="window.app.tabManager.clearOutput()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="output-content" id="outputContent"></div>
                </div>
            </div>
        `;
    }

    // 渲染演示标签页
    renderDemoTab(methodKey) {
        // 检查是否有可用的演示生成器
        const demoGenerator = window.allDemos && window.allDemos[methodKey];
        if (!demoGenerator) {
            return `
                <div class="demo-placeholder">
                    <div class="placeholder-content">
                        <i class="fas fa-flask"></i>
                        <h3>演示功能开发中</h3>
                        <p>该方法的交互式演示功能正在开发中，敬请期待！</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="demo-content">
                <div class="demo-header">
                    <h3>
                        <i class="fas fa-play-circle"></i>
                        交互式演示
                    </h3>
                    <p>在下方尝试使用该方法的功能</p>
                </div>
                <div class="demo-container">
                    ${demoGenerator()}
                </div>
                <div class="demo-tips">
                    <div class="tip-item">
                        <i class="fas fa-lightbulb"></i>
                        <span>可以修改参数值来查看不同的效果</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染API文档标签页
    renderApiTab(method) {
        return `
            <div class="api-content">
                <div class="api-section">
                    <h3>📋 方法签名</h3>
                    <div class="method-signature">
                        <code class="signature-code">
                            ${method.name}(${method.params ? method.params.map(p => 
                                `${p.name}${p.required ? '' : '?'}: ${p.type}`
                            ).join(', ') : ''})
                        </code>
                    </div>
                </div>
                
                <div class="api-section">
                    <h3>📥 参数详情</h3>
                    <div class="api-params">
                        ${method.params ? method.params.map(param => `
                            <div class="api-param">
                                <div class="param-header">
                                    <code class="param-name">${param.name}</code>
                                    <span class="param-type">${param.type}</span>
                                    ${param.required ? 
                                        '<span class="param-required">必需</span>' : 
                                        '<span class="param-optional">可选</span>'
                                    }
                                </div>
                                <div class="param-description">${param.description}</div>
                                ${param.default ? `<div class="param-default">默认值: <code>${param.default}</code></div>` : ''}
                            </div>
                        `).join('') : '<p class="no-params">该方法无需参数</p>'}
                    </div>
                </div>
                
                <div class="api-section">
                    <h3>📤 返回值</h3>
                    <div class="api-returns">
                        <div class="return-info">
                            <span class="return-type">${method.returnType || 'any'}</span>
                            <span class="return-desc">${method.returnDescription || '返回处理结果'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="api-section">
                    <h3>🔗 相关方法</h3>
                    <div class="related-methods">
                        <p>暂无相关方法</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 运行代码示例
    runCode(code, language) {
        const outputElement = document.getElementById('exampleOutput');
        const contentElement = document.getElementById('outputContent');
        
        if (!outputElement || !contentElement) return;
        
        try {
            // 简单的代码执行模拟
            const result = eval(code);
            contentElement.innerHTML = `
                <div class="output-success">
                    <strong>执行成功:</strong>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                </div>
            `;
        } catch (error) {
            contentElement.innerHTML = `
                <div class="output-error">
                    <strong>执行错误:</strong>
                    <pre>${error.message}</pre>
                </div>
            `;
        }
        
        outputElement.style.display = 'block';
    }

    // 清除输出
    clearOutput() {
        const outputElement = document.getElementById('exampleOutput');
        if (outputElement) {
            outputElement.style.display = 'none';
        }
    }

    // 标签切换回调
    onTabSwitch(tabName) {
        // 可以在这里添加标签切换的额外逻辑
        console.log(`切换到标签页: ${tabName}`);
    }

    // 语言切换回调
    onLanguageSwitch(language) {
        // 可以在这里添加语言切换的额外逻辑
        console.log(`切换到语言: ${language}`);
    }

    // 获取当前标签
    getCurrentTab() {
        return this.currentTab;
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 设置当前语言
    setCurrentLanguage(language) {
        this.currentLanguage = language;
    }
}

// 导出标签页管理器
export { TabManager };

// 为了向后兼容，也将类添加到全局对象
window.TabManager = TabManager;