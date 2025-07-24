// 演示生成器模块

// Cookie 工具演示
export const cookieDemos = {
    setCookie: () => `
        <div class="demo-container">
            <h4>设置 Cookie 演示</h4>
            <div class="demo-controls">
                <input type="text" id="cookieName" placeholder="Cookie 名称" value="testCookie">
                <input type="text" id="cookieValue" placeholder="Cookie 值" value="testValue">
                <input type="number" id="cookieExpires" placeholder="过期天数" value="7">
                <button onclick="setCookieDemo()">设置 Cookie</button>
            </div>
            <div class="demo-output" id="setCookieOutput"></div>
            <script>
                function setCookieDemo() {
                    const name = document.getElementById('cookieName').value;
                    const value = document.getElementById('cookieValue').value;
                    const expires = parseInt(document.getElementById('cookieExpires').value);
                    
                    // 模拟 setCookie 方法
                    const date = new Date();
                    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
                    const expiresStr = "expires=" + date.toUTCString();
                    document.cookie = name + "=" + value + ";" + expiresStr + ";path=/";
                    
                    document.getElementById('setCookieOutput').innerHTML = 
                        '<div class="success">Cookie 设置成功: ' + name + '=' + value + '</div>';
                }
            </script>
        </div>
    `,
    
    getCookie: () => `
        <div class="demo-container">
            <h4>获取 Cookie 演示</h4>
            <div class="demo-controls">
                <input type="text" id="getCookieName" placeholder="Cookie 名称" value="testCookie">
                <button onclick="getCookieDemo()">获取 Cookie</button>
                <button onclick="getAllCookiesDemo()">获取所有 Cookies</button>
            </div>
            <div class="demo-output" id="getCookieOutput"></div>
            <script>
                function getCookieDemo() {
                    const name = document.getElementById('getCookieName').value;
                    const cookies = document.cookie.split(';');
                    let result = null;
                    
                    for (let cookie of cookies) {
                        const [cookieName, cookieValue] = cookie.trim().split('=');
                        if (cookieName === name) {
                            result = cookieValue;
                            break;
                        }
                    }
                    
                    document.getElementById('getCookieOutput').innerHTML = 
                        result ? '<div class="success">Cookie 值: ' + result + '</div>' 
                               : '<div class="error">Cookie 不存在</div>';
                }
                
                function getAllCookiesDemo() {
                    const cookies = document.cookie.split(';');
                    const cookieObj = {};
                    
                    cookies.forEach(cookie => {
                        const [name, value] = cookie.trim().split('=');
                        if (name && value) {
                            cookieObj[name] = value;
                        }
                    });
                    
                    document.getElementById('getCookieOutput').innerHTML = 
                        '<div class="info">所有 Cookies: <pre>' + JSON.stringify(cookieObj, null, 2) + '</pre></div>';
                }
            </script>
        </div>
    `
};

// URL 工具演示
export const urlDemos = {
    getQueryString: () => `
        <div class="demo-container">
            <h4>获取 URL 参数演示</h4>
            <div class="demo-controls">
                <input type="text" id="testUrl" placeholder="测试 URL" 
                       value="https://example.com?name=John&age=25&city=Beijing">
                <input type="text" id="paramName" placeholder="参数名" value="name">
                <button onclick="getQueryStringDemo()">获取参数</button>
                <button onclick="getAllParamsDemo()">获取所有参数</button>
            </div>
            <div class="demo-output" id="urlOutput"></div>
            <script>
                function getQueryStringDemo() {
                    const url = document.getElementById('testUrl').value;
                    const paramName = document.getElementById('paramName').value;
                    
                    try {
                        const urlObj = new URL(url);
                        const paramValue = urlObj.searchParams.get(paramName);
                        
                        document.getElementById('urlOutput').innerHTML = 
                            paramValue ? '<div class="success">参数值: ' + paramValue + '</div>' 
                                       : '<div class="error">参数不存在</div>';
                    } catch (e) {
                        document.getElementById('urlOutput').innerHTML = 
                            '<div class="error">无效的 URL</div>';
                    }
                }
                
                function getAllParamsDemo() {
                    const url = document.getElementById('testUrl').value;
                    
                    try {
                        const urlObj = new URL(url);
                        const params = {};
                        urlObj.searchParams.forEach((value, key) => {
                            params[key] = value;
                        });
                        
                        document.getElementById('urlOutput').innerHTML = 
                            '<div class="info">所有参数: <pre>' + JSON.stringify(params, null, 2) + '</pre></div>';
                    } catch (e) {
                        document.getElementById('urlOutput').innerHTML = 
                            '<div class="error">无效的 URL</div>';
                    }
                }
            </script>
        </div>
    `,
    
    parseUrl: () => `
        <div class="demo-container">
            <h4>解析 URL 演示</h4>
            <div class="demo-controls">
                <input type="text" id="parseUrl" placeholder="要解析的 URL" 
                       value="https://user:pass@example.com:8080/path/to/page?name=John&age=25#section1">
                <button onclick="parseUrlDemo()">解析 URL</button>
            </div>
            <div class="demo-output" id="parseUrlOutput"></div>
            <script>
                function parseUrlDemo() {
                    const url = document.getElementById('parseUrl').value;
                    
                    try {
                        const urlObj = new URL(url);
                        const parsed = {
                            protocol: urlObj.protocol,
                            hostname: urlObj.hostname,
                            port: urlObj.port,
                            pathname: urlObj.pathname,
                            search: urlObj.search,
                            hash: urlObj.hash,
                            username: urlObj.username,
                            password: urlObj.password
                        };
                        
                        document.getElementById('parseUrlOutput').innerHTML = 
                            '<div class="info">解析结果: <pre>' + JSON.stringify(parsed, null, 2) + '</pre></div>';
                    } catch (e) {
                        document.getElementById('parseUrlOutput').innerHTML = 
                            '<div class="error">无效的 URL</div>';
                    }
                }
            </script>
        </div>
    `
};

// 安全工具演示
export const securityDemos = {
    scanSecurity: () => `
        <div class="demo-container">
            <h4>安全扫描演示</h4>
            <div class="demo-controls">
                <label><input type="checkbox" id="checkXSS" checked> 检查 XSS</label>
                <label><input type="checkbox" id="checkCSRF" checked> 检查 CSRF</label>
                <label><input type="checkbox" id="checkHeaders" checked> 检查安全头</label>
                <button onclick="scanSecurityDemo()">开始扫描</button>
            </div>
            <div class="demo-output" id="securityOutput"></div>
            <script>
                function scanSecurityDemo() {
                    const checkXSS = document.getElementById('checkXSS').checked;
                    const checkCSRF = document.getElementById('checkCSRF').checked;
                    const checkHeaders = document.getElementById('checkHeaders').checked;
                    
                    // 模拟安全扫描
                    const issues = [];
                    const recommendations = [];
                    
                    if (checkXSS) {
                        issues.push('发现潜在的 XSS 漏洞');
                        recommendations.push('对用户输入进行适当的转义和验证');
                    }
                    
                    if (checkCSRF) {
                        issues.push('缺少 CSRF 保护');
                        recommendations.push('实施 CSRF 令牌验证');
                    }
                    
                    if (checkHeaders) {
                        issues.push('缺少安全响应头');
                        recommendations.push('添加 Content-Security-Policy 等安全头');
                    }
                    
                    const score = Math.max(0, 100 - issues.length * 20);
                    
                    const result = {
                        score: score,
                        issues: issues,
                        recommendations: recommendations
                    };
                    
                    document.getElementById('securityOutput').innerHTML = 
                        '<div class="info">扫描结果: <pre>' + JSON.stringify(result, null, 2) + '</pre></div>';
                }
            </script>
        </div>
    `,
    
    sanitizeInput: () => `
        <div class="demo-container">
            <h4>输入清理演示</h4>
            <div class="demo-controls">
                <textarea id="userInput" placeholder="输入要清理的内容" rows="3">&lt;script&gt;alert('XSS')&lt;/script&gt;&lt;p&gt;正常内容&lt;/p&gt;</textarea>
                <br>
                <label><input type="checkbox" id="allowP" checked> 允许 &lt;p&gt; 标签</label>
                <label><input type="checkbox" id="allowStrong" checked> 允许 &lt;strong&gt; 标签</label>
                <br>
                <button onclick="sanitizeInputDemo()">清理输入</button>
            </div>
            <div class="demo-output" id="sanitizeOutput"></div>
            <script>
                function sanitizeInputDemo() {
                    const input = document.getElementById('userInput').value;
                    const allowP = document.getElementById('allowP').checked;
                    const allowStrong = document.getElementById('allowStrong').checked;
                    
                    // 简单的 HTML 清理模拟
                    let sanitized = input;
                    
                    // 移除 script 标签
                    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
                    
                    // 移除事件处理器
                    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
                    
                    // 根据选项保留允许的标签
                    const allowedTags = [];
                    if (allowP) allowedTags.push('p');
                    if (allowStrong) allowedTags.push('strong');
                    
                    // 移除不允许的标签
                    if (allowedTags.length > 0) {
                        const tagPattern = new RegExp('<(?!/?(' + allowedTags.join('|') + ')\\b)[^>]*>', 'gi');
                        sanitized = sanitized.replace(tagPattern, '');
                    } else {
                        sanitized = sanitized.replace(/<[^>]*>/g, '');
                    }
                    
                    document.getElementById('sanitizeOutput').innerHTML = 
                        '<div class="info">原始输入: <pre>' + input + '</pre></div>' +
                        '<div class="success">清理后: <pre>' + sanitized + '</pre></div>';
                }
            </script>
        </div>
    `
};

// 数据处理演示
export const dataDemos = {
    formatData: () => `
        <div class="demo-container">
            <h4>数据格式化演示</h4>
            <div class="demo-controls">
                <select id="dataType">
                    <option value="number">数字</option>
                    <option value="date">日期</option>
                    <option value="filesize">文件大小</option>
                </select>
                <input type="text" id="inputData" placeholder="输入数据">
                <button onclick="formatDataDemo()">格式化</button>
            </div>
            <div class="demo-output" id="formatOutput"></div>
            <script>
                function formatDataDemo() {
                    const type = document.getElementById('dataType').value;
                    const input = document.getElementById('inputData').value;
                    let formatted = '';
                    
                    try {
                        switch (type) {
                            case 'number':
                                const num = parseFloat(input);
                                formatted = new Intl.NumberFormat('zh-CN', {
                                    style: 'currency',
                                    currency: 'CNY'
                                }).format(num);
                                break;
                            case 'date':
                                const date = new Date(input);
                                formatted = date.toLocaleString('zh-CN');
                                break;
                            case 'filesize':
                                const bytes = parseInt(input);
                                const sizes = ['B', 'KB', 'MB', 'GB'];
                                let i = 0;
                                let size = bytes;
                                while (size >= 1024 && i < sizes.length - 1) {
                                    size /= 1024;
                                    i++;
                                }
                                formatted = size.toFixed(2) + ' ' + sizes[i];
                                break;
                        }
                        
                        document.getElementById('formatOutput').innerHTML = 
                            '<div class="success">格式化结果: ' + formatted + '</div>';
                    } catch (e) {
                        document.getElementById('formatOutput').innerHTML = 
                            '<div class="error">格式化失败: ' + e.message + '</div>';
                    }
                }
            </script>
        </div>
    `,
    
    validateData: () => `
        <div class="demo-container">
            <h4>数据验证演示</h4>
            <div class="demo-controls">
                <input type="text" id="userName" placeholder="姓名" value="John Doe">
                <input type="email" id="userEmail" placeholder="邮箱" value="john@example.com">
                <input type="number" id="userAge" placeholder="年龄" value="25">
                <button onclick="validateDataDemo()">验证数据</button>
            </div>
            <div class="demo-output" id="validateOutput"></div>
            <script>
                function validateDataDemo() {
                    const name = document.getElementById('userName').value;
                    const email = document.getElementById('userEmail').value;
                    const age = parseInt(document.getElementById('userAge').value);
                    
                    const errors = [];
                    
                    // 验证姓名
                    if (!name || name.length < 2) {
                        errors.push('姓名至少需要2个字符');
                    }
                    
                    // 验证邮箱
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!email || !emailRegex.test(email)) {
                        errors.push('邮箱格式不正确');
                    }
                    
                    // 验证年龄
                    if (!age || age < 0 || age > 120) {
                        errors.push('年龄必须在0-120之间');
                    }
                    
                    const result = {
                        isValid: errors.length === 0,
                        errors: errors,
                        data: { name, email, age }
                    };
                    
                    document.getElementById('validateOutput').innerHTML = 
                        '<div class="info">验证结果: <pre>' + JSON.stringify(result, null, 2) + '</pre></div>';
                }
            </script>
        </div>
    `
};

// 性能优化演示
export const performanceDemos = {
    measurePerformance: () => `
        <div class="demo-container">
            <h4>性能测量演示</h4>
            <div class="demo-controls">
                <input type="number" id="iterations" placeholder="迭代次数" value="1000000">
                <button onclick="measurePerformanceDemo()">测量性能</button>
            </div>
            <div class="demo-output" id="performanceOutput"></div>
            <script>
                function measurePerformanceDemo() {
                    const iterations = parseInt(document.getElementById('iterations').value);
                    
                    // 测量函数执行时间
                    const startTime = performance.now();
                    
                    let sum = 0;
                    for (let i = 0; i < iterations; i++) {
                        sum += i;
                    }
                    
                    const endTime = performance.now();
                    const executionTime = endTime - startTime;
                    
                    const result = {
                        iterations: iterations,
                        result: sum,
                        executionTime: executionTime.toFixed(2) + ' ms',
                        averageTime: (executionTime / iterations * 1000).toFixed(6) + ' μs/iteration'
                    };
                    
                    document.getElementById('performanceOutput').innerHTML = 
                        '<div class="info">性能测试结果: <pre>' + JSON.stringify(result, null, 2) + '</pre></div>';
                }
            </script>
        </div>
    `,
    
    debounce: () => `
        <div class="demo-container">
            <h4>防抖函数演示</h4>
            <div class="demo-controls">
                <input type="text" id="searchInput" placeholder="输入搜索内容...">
                <input type="number" id="debounceDelay" placeholder="延迟(ms)" value="300">
                <div class="demo-info">快速输入文字，观察防抖效果</div>
            </div>
            <div class="demo-output" id="debounceOutput"></div>
            <script>
                let debounceTimer;
                
                function debounce(func, delay) {
                    return function(...args) {
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => func.apply(this, args), delay);
                    };
                }
                
                function searchFunction(query) {
                    const timestamp = new Date().toLocaleTimeString();
                    document.getElementById('debounceOutput').innerHTML += 
                        '<div class="info">[' + timestamp + '] 搜索: "' + query + '"</div>';
                }
                
                document.getElementById('searchInput').addEventListener('input', function(e) {
                    const delay = parseInt(document.getElementById('debounceDelay').value) || 300;
                    const debouncedSearch = debounce(searchFunction, delay);
                    debouncedSearch(e.target.value);
                });
                
                // 清空输出
                function clearOutput() {
                    document.getElementById('debounceOutput').innerHTML = '';
                }
            </script>
            <button onclick="clearOutput()">清空输出</button>
        </div>
    `
};

// 演示生成器类
export class DemoGenerator {
    constructor() {
        this.demos = {
            ...cookieDemos,
            ...urlDemos,
            ...securityDemos,
            ...dataDemos,
            ...performanceDemos
        };
    }

    // 获取演示HTML
    getDemo(moduleKey, methodKey) {
        const moduleDemos = this.getDemosByModule(moduleKey);
        if (moduleDemos && moduleDemos[methodKey]) {
            return moduleDemos[methodKey]();
        }
        return '<div class="demo-container"><p>暂无演示</p></div>';
    }

    // 根据模块获取演示
    getDemosByModule(moduleKey) {
        const demoMap = {
            'cookieUtils': cookieDemos,
            'urlUtils': urlDemos,
            'securityUtils': securityDemos,
            'dataUtils': dataDemos,
            'performanceUtils': performanceDemos
        };
        return demoMap[moduleKey] || null;
    }

    // 检查是否有演示
    hasDemo(moduleKey, methodKey) {
        const moduleDemos = this.getDemosByModule(moduleKey);
        return moduleDemos && typeof moduleDemos[methodKey] === 'function';
    }

    // 获取所有可用的演示
    getAllDemos() {
        return this.demos;
    }
}

// 导出所有演示
export const allDemos = {
    ...cookieDemos,
    ...urlDemos,
    ...securityDemos,
    ...dataDemos,
    ...performanceDemos
};

// 创建默认实例
export const demoGenerator = new DemoGenerator();
export default DemoGenerator;

// 将演示生成器导出到全局对象
if (typeof window !== 'undefined') {
    window.allDemos = allDemos;
    window.demoGenerator = demoGenerator;
}