// 搜索功能模块
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = [];
        this.currentQuery = '';
        this.debouncedSearch = Utils.debounce(this.performSearch.bind(this), 300);
    }

    // 初始化搜索功能
    init() {
        this.searchInput = document.getElementById('searchInput');
        if (this.searchInput) {
            this.bindEvents();
        }
    }

    // 绑定搜索事件
    bindEvents() {
        this.searchInput.addEventListener('input', (e) => {
            this.currentQuery = e.target.value.trim();
            this.debouncedSearch();
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        // 点击搜索框外部时清除焦点
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.searchInput.blur();
            }
        });
    }

    // 执行搜索
    performSearch() {
        const query = this.currentQuery.toLowerCase();
        
        if (!query) {
            this.showAllMethods();
            return;
        }

        this.searchResults = this.findMatchingMethods(query);
        this.displaySearchResults();
        this.updateSearchStats();
    }

    // 查找匹配的方法
    findMatchingMethods(query) {
        const results = [];
        
        Object.keys(moduleData).forEach(moduleKey => {
            const module = moduleData[moduleKey];
            const moduleMatches = [];
            
            Object.keys(module.methods).forEach(methodKey => {
                const method = module.methods[methodKey];
                const score = this.calculateMatchScore(method, query);
                
                if (score > 0) {
                    moduleMatches.push({
                        moduleKey,
                        methodKey,
                        method,
                        score
                    });
                }
            });
            
            if (moduleMatches.length > 0) {
                results.push({
                    moduleKey,
                    module,
                    methods: moduleMatches.sort((a, b) => b.score - a.score)
                });
            }
        });
        
        return results.sort((a, b) => {
            const aMaxScore = Math.max(...a.methods.map(m => m.score));
            const bMaxScore = Math.max(...b.methods.map(m => m.score));
            return bMaxScore - aMaxScore;
        });
    }

    // 计算匹配分数
    calculateMatchScore(method, query) {
        let score = 0;
        const name = method.name.toLowerCase();
        const description = method.description.toLowerCase();
        
        // 名称完全匹配
        if (name === query) {
            score += 100;
        }
        // 名称开头匹配
        else if (name.startsWith(query)) {
            score += 80;
        }
        // 名称包含匹配
        else if (name.includes(query)) {
            score += 60;
        }
        
        // 描述匹配
        if (description.includes(query)) {
            score += 30;
        }
        
        // 参数匹配
        if (method.params) {
            method.params.forEach(param => {
                if (param.name.toLowerCase().includes(query) || 
                    param.description.toLowerCase().includes(query)) {
                    score += 20;
                }
            });
        }
        
        return score;
    }

    // 显示搜索结果
    displaySearchResults() {
        const moduleGroups = document.querySelectorAll('.module-group');
        const methodItems = document.querySelectorAll('.method-item');
        
        // 隐藏所有项目
        moduleGroups.forEach(group => group.style.display = 'none');
        methodItems.forEach(item => item.style.display = 'none');
        
        if (this.searchResults.length === 0) {
            this.showNoResults();
            return;
        }
        
        // 显示匹配的结果
        this.searchResults.forEach(result => {
            const moduleGroup = document.querySelector(`[data-module="${result.moduleKey}"]`);
            if (moduleGroup) {
                moduleGroup.style.display = 'block';
                
                // 展开模块
                const moduleHeader = moduleGroup.querySelector('.module-header');
                const methodsList = moduleGroup.querySelector('.methods-list');
                if (moduleHeader && methodsList) {
                    moduleHeader.classList.add('expanded');
                    methodsList.classList.add('expanded');
                }
                
                // 显示匹配的方法
                result.methods.forEach(methodResult => {
                    const methodItem = moduleGroup.querySelector(
                        `[data-method="${methodResult.methodKey}"]`
                    );
                    if (methodItem) {
                        methodItem.style.display = 'block';
                        this.highlightSearchTerm(methodItem, this.currentQuery);
                    }
                });
            }
        });
        
        this.hideNoResults();
    }

    // 高亮搜索词
    highlightSearchTerm(element, query) {
        const nameElement = element.querySelector('.method-name');
        const descElement = element.querySelector('.method-desc');
        
        if (nameElement) {
            nameElement.innerHTML = this.highlightText(nameElement.textContent, query);
        }
        
        if (descElement) {
            descElement.innerHTML = this.highlightText(descElement.textContent, query);
        }
    }

    // 高亮文本
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // 显示所有方法
    showAllMethods() {
        const moduleGroups = document.querySelectorAll('.module-group');
        const methodItems = document.querySelectorAll('.method-item');
        
        moduleGroups.forEach(group => group.style.display = 'block');
        methodItems.forEach(item => {
            item.style.display = 'block';
            this.clearHighlight(item);
        });
        
        this.hideNoResults();
        this.updateSearchStats();
    }

    // 清除高亮
    clearHighlight(element) {
        const nameElement = element.querySelector('.method-name');
        const descElement = element.querySelector('.method-desc');
        
        if (nameElement) {
            nameElement.innerHTML = nameElement.textContent;
        }
        
        if (descElement) {
            descElement.innerHTML = descElement.textContent;
        }
    }

    // 显示无结果提示
    showNoResults() {
        let noResultsElement = document.getElementById('noSearchResults');
        
        if (!noResultsElement) {
            noResultsElement = document.createElement('div');
            noResultsElement.id = 'noSearchResults';
            noResultsElement.className = 'no-results';
            noResultsElement.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>未找到匹配的方法</h3>
                    <p>尝试使用其他关键词搜索</p>
                </div>
            `;
            
            const sidebarNav = document.getElementById('sidebarNav');
            if (sidebarNav) {
                sidebarNav.appendChild(noResultsElement);
            }
        }
        
        noResultsElement.style.display = 'block';
    }

    // 隐藏无结果提示
    hideNoResults() {
        const noResultsElement = document.getElementById('noSearchResults');
        if (noResultsElement) {
            noResultsElement.style.display = 'none';
        }
    }

    // 更新搜索统计
    updateSearchStats() {
        const totalMethods = this.getTotalMethodCount();
        const visibleMethods = this.getVisibleMethodCount();
        
        let statsElement = document.getElementById('searchStats');
        if (!statsElement) {
            statsElement = document.createElement('div');
            statsElement.id = 'searchStats';
            statsElement.className = 'search-stats';
            
            const searchBox = document.querySelector('.search-box');
            if (searchBox) {
                searchBox.appendChild(statsElement);
            }
        }
        
        if (this.currentQuery) {
            statsElement.innerHTML = `找到 ${visibleMethods} / ${totalMethods} 个方法`;
            statsElement.style.display = 'block';
        } else {
            statsElement.style.display = 'none';
        }
    }

    // 获取总方法数
    getTotalMethodCount() {
        return Object.values(moduleData).reduce((total, module) => {
            return total + Object.keys(module.methods).length;
        }, 0);
    }

    // 获取可见方法数
    getVisibleMethodCount() {
        const visibleMethods = document.querySelectorAll('.method-item[style*="block"], .method-item:not([style*="none"])');
        return visibleMethods.length;
    }

    // 清除搜索
    clearSearch() {
        this.searchInput.value = '';
        this.currentQuery = '';
        this.showAllMethods();
        this.searchInput.blur();
    }

    // 获取搜索建议
    getSearchSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();
        
        Object.values(moduleData).forEach(module => {
            Object.values(module.methods).forEach(method => {
                if (method.name.toLowerCase().includes(lowerQuery)) {
                    suggestions.push(method.name);
                }
            });
        });
        
        return [...new Set(suggestions)].slice(0, 5);
    }
}

// 导出搜索管理器
window.SearchManager = SearchManager;