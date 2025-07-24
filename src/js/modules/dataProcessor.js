/**
 * 高级数据处理模块
 * 提供数据转换、压缩、导入导出等功能
 */

/**
 * 深度克隆对象
 * @param {any} obj - 要克隆的对象
 * @returns {any}
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
    
    return obj;
}

/**
 * 数据压缩（使用 LZ 算法简化版）
 * @param {string} data - 要压缩的数据
 * @returns {string}
 */
export function compressData(data) {
    const dict = {};
    let dictSize = 256;
    let result = [];
    let w = '';
    
    for (let i = 0; i < 256; i++) {
        dict[String.fromCharCode(i)] = i;
    }
    
    for (let i = 0; i < data.length; i++) {
        const c = data.charAt(i);
        const wc = w + c;
        
        if (dict[wc]) {
            w = wc;
        } else {
            result.push(dict[w]);
            dict[wc] = dictSize++;
            w = c;
        }
    }
    
    if (w !== '') {
        result.push(dict[w]);
    }
    
    return result.join(',');
}

/**
 * 数据解压缩
 * @param {string} compressed - 压缩的数据
 * @returns {string}
 */
export function decompressData(compressed) {
    const dict = {};
    let dictSize = 256;
    const data = compressed.split(',').map(Number);
    let result = '';
    
    for (let i = 0; i < 256; i++) {
        dict[i] = String.fromCharCode(i);
    }
    
    let w = String.fromCharCode(data[0]);
    result += w;
    
    for (let i = 1; i < data.length; i++) {
        const k = data[i];
        let entry;
        
        if (dict[k]) {
            entry = dict[k];
        } else if (k === dictSize) {
            entry = w + w.charAt(0);
        } else {
            throw new Error('Invalid compressed data');
        }
        
        result += entry;
        dict[dictSize++] = w + entry.charAt(0);
        w = entry;
    }
    
    return result;
}

/**
 * 将数据导出为 CSV
 * @param {Array<Object>} data - 数据数组
 * @param {Array<string>} headers - 表头
 * @returns {string}
 */
export function exportToCSV(data, headers = null) {
    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }
    
    const csvHeaders = headers || Object.keys(data[0]);
    const csvRows = [csvHeaders.join(',')];
    
    data.forEach(row => {
        const values = csvHeaders.map(header => {
            const value = row[header] || '';
            return typeof value === 'string' && value.includes(',') 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

/**
 * 从 CSV 解析数据
 * @param {string} csvText - CSV 文本
 * @param {boolean} hasHeaders - 是否包含表头
 * @returns {Array<Object>}
 */
export function parseCSV(csvText, hasHeaders = true) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    };
    
    const headers = hasHeaders ? parseCSVLine(lines[0]) : null;
    const dataLines = hasHeaders ? lines.slice(1) : lines;
    
    return dataLines.map((line, index) => {
        const values = parseCSVLine(line);
        if (headers) {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i] || '';
            });
            return obj;
        } else {
            return values;
        }
    });
}

/**
 * 数据分页
 * @param {Array} data - 数据数组
 * @param {number} page - 页码（从1开始）
 * @param {number} pageSize - 每页大小
 * @returns {Object}
 */
export function paginateData(data, page = 1, pageSize = 10) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);
    
    return {
        items,
        pagination: {
            currentPage: page,
            pageSize,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

/**
 * 数据排序
 * @param {Array} data - 数据数组
 * @param {string|Function} key - 排序键或比较函数
 * @param {string} order - 排序顺序 'asc' 或 'desc'
 * @returns {Array}
 */
export function sortData(data, key, order = 'asc') {
    const sortedData = [...data];
    
    if (typeof key === 'function') {
        return sortedData.sort(key);
    }
    
    return sortedData.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * 数据过滤
 * @param {Array} data - 数据数组
 * @param {Object|Function} filters - 过滤条件
 * @returns {Array}
 */
export function filterData(data, filters) {
    if (typeof filters === 'function') {
        return data.filter(filters);
    }
    
    return data.filter(item => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            const itemValue = item[key];
            
            if (typeof filterValue === 'function') {
                return filterValue(itemValue);
            }
            
            if (Array.isArray(filterValue)) {
                return filterValue.includes(itemValue);
            }
            
            return itemValue === filterValue;
        });
    });
}

/**
 * 数据分组
 * @param {Array} data - 数据数组
 * @param {string|Function} key - 分组键或分组函数
 * @returns {Object}
 */
export function groupData(data, key) {
    return data.reduce((groups, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});
}