import {
  DataTransformOptions,
  CompressionOptions,
  ExportOptions,
  ImportOptions,
  PaginationOptions,
  PaginationResult,
  SortOptions,
  FilterOptions,
  GroupOptions
} from '../types/index';

/**
 * 高级数据处理模块
 * 提供数据转换、压缩、导入导出、分页、排序、过滤等功能
 */

/**
 * 深度转换数据结构
 * @param data 原始数据
 * @param options 转换选项
 * @returns 转换后的数据
 */
export function transformData<T = any>(data: any, options: DataTransformOptions = {}): T {
  const {
    keyMapping = {},
    valueTransforms = {},
    removeEmpty = false,
    flattenArrays = false
  } = options;

  function transform(obj: any): any {
    if (Array.isArray(obj)) {
      const transformed = obj.map(transform);
      return flattenArrays ? transformed.flat() : transformed;
    }

    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = keyMapping[key] || key;
      let newValue = transform(value);

      // 应用值转换
      if (valueTransforms[key]) {
        newValue = valueTransforms[key](newValue);
      }

      // 移除空值
      if (removeEmpty && (newValue === null || newValue === undefined || newValue === '')) {
        continue;
      }

      result[newKey] = newValue;
    }

    return result;
  }

  return transform(data);
}

/**
 * 压缩数据
 * @param data 要压缩的数据
 * @param options 压缩选项
 * @returns Promise<string> 压缩后的数据
 */
export async function compressData(
  data: any,
  options: CompressionOptions = {}
): Promise<string> {
  const jsonString = JSON.stringify(data);
  
  // 简单的 LZ 压缩算法实现
  if (options.algorithm === 'lz4' || !options.algorithm) {
    return lzCompress(jsonString);
  }
  
  // 对于真实的 gzip/deflate，需要使用 pako 等库
  console.warn('gzip/deflate compression requires additional library');
  return jsonString;
}

/**
 * 解压数据
 * @param compressedData 压缩的数据
 * @param options 压缩选项
 * @returns Promise<any> 解压后的数据
 */
export async function decompressData(
  compressedData: string,
  options: CompressionOptions = {}
): Promise<any> {
  let jsonString: string;
  
  if (options.algorithm === 'lz4' || !options.algorithm) {
    jsonString = lzDecompress(compressedData);
  } else {
    jsonString = compressedData;
  }
  
  return JSON.parse(jsonString);
}

/**
 * 导出数据
 * @param data 要导出的数据
 * @param options 导出选项
 * @returns Promise<Blob>
 */
export async function exportData(data: any[], options: ExportOptions = {}): Promise<Blob> {
  const { format = 'json', filename = 'data', headers, delimiter = ',' } = options;

  switch (format) {
    case 'json':
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    case 'csv':
      const csvContent = arrayToCSV(data, { headers, delimiter });
      return new Blob([csvContent], { type: 'text/csv' });
    
    case 'xml':
      const xmlContent = arrayToXML(data);
      return new Blob([xmlContent], { type: 'application/xml' });
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * 导入数据
 * @param file 要导入的文件
 * @param options 导入选项
 * @returns Promise<any[]>
 */
export async function importData(file: File, options: ImportOptions = {}): Promise<any[]> {
  const { format, delimiter = ',', headers = true, encoding = 'utf-8' } = options;
  
  const text = await readFileAsText(file, encoding);
  
  const detectedFormat = format || detectFormat(file.name);
  
  switch (detectedFormat) {
    case 'json':
      return JSON.parse(text);
    
    case 'csv':
      return parseCSV(text, { delimiter, headers });
    
    case 'xml':
      return parseXML(text);
    
    default:
      throw new Error(`Unsupported import format: ${detectedFormat}`);
  }
}

/**
 * 分页处理
 * @param data 原始数据
 * @param options 分页选项
 * @returns 分页结果
 */
export function paginate<T>(data: T[], options: PaginationOptions): PaginationResult<T> {
  const { page, pageSize, total = data.length } = options;
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

/**
 * 排序数据
 * @param data 要排序的数据
 * @param options 排序选项
 * @returns 排序后的数据
 */
export function sortData<T>(data: T[], options: SortOptions): T[] {
  const { field, order, type = 'string' } = options;
  
  return [...data].sort((a: any, b: any) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // 类型转换
    if (type === 'number') {
      valueA = Number(valueA) || 0;
      valueB = Number(valueB) || 0;
    } else if (type === 'date') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else {
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
    }
    
    let result = 0;
    if (valueA < valueB) result = -1;
    else if (valueA > valueB) result = 1;
    
    return order === 'desc' ? -result : result;
  });
}

/**
 * 过滤数据
 * @param data 要过滤的数据
 * @param filters 过滤条件
 * @returns 过滤后的数据
 */
export function filterData<T>(data: T[], filters: FilterOptions[]): T[] {
  return data.filter(item => {
    return filters.every(filter => {
      const { field, operator, value } = filter;
      const itemValue = (item as any)[field];
      
      switch (operator) {
        case 'eq': return itemValue === value;
        case 'ne': return itemValue !== value;
        case 'gt': return itemValue > value;
        case 'gte': return itemValue >= value;
        case 'lt': return itemValue < value;
        case 'lte': return itemValue <= value;
        case 'contains': return String(itemValue).includes(String(value));
        case 'startsWith': return String(itemValue).startsWith(String(value));
        case 'endsWith': return String(itemValue).endsWith(String(value));
        default: return true;
      }
    });
  });
}

/**
 * 分组数据
 * @param data 要分组的数据
 * @param options 分组选项
 * @returns 分组后的数据
 */
export function groupData<T>(data: T[], options: GroupOptions): Record<string, any> {
  const { field, aggregations = {} } = options;
  
  const groups = data.reduce((acc: Record<string, T[]>, item: any) => {
    const key = item[field];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  
  // 应用聚合函数
  const result: Record<string, any> = {};
  
  for (const [key, items] of Object.entries(groups)) {
    result[key] = {
      items,
      ...(aggregations.count && { count: items.length }),
      ...(aggregations.sum && aggregations.sum.reduce((acc, sumField) => {
        acc[`${sumField}_sum`] = items.reduce((sum, item: any) => sum + (Number(item[sumField]) || 0), 0);
        return acc;
      }, {} as Record<string, number>)),
      ...(aggregations.avg && aggregations.avg.reduce((acc, avgField) => {
        const sum = items.reduce((sum, item: any) => sum + (Number(item[avgField]) || 0), 0);
        acc[`${avgField}_avg`] = sum / items.length;
        return acc;
      }, {} as Record<string, number>)),
      ...(aggregations.min && aggregations.min.reduce((acc, minField) => {
        acc[`${minField}_min`] = Math.min(...items.map((item: any) => Number(item[minField]) || 0));
        return acc;
      }, {} as Record<string, number>)),
      ...(aggregations.max && aggregations.max.reduce((acc, maxField) => {
        acc[`${maxField}_max`] = Math.max(...items.map((item: any) => Number(item[maxField]) || 0));
        return acc;
      }, {} as Record<string, number>))
    };
  }
  
  return result;
}

// 辅助函数
function lzCompress(str: string): string {
  // 简单的 LZ 压缩实现
  const dict: Record<string, number> = {};
  const result: (string | number)[] = [];
  let dictSize = 256;
  let w = '';
  
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const wc = w + c;
    
    if (dict[wc] !== undefined) {
      w = wc;
    } else {
      result.push(dict[w] !== undefined ? dict[w] : w);
      dict[wc] = dictSize++;
      w = c;
    }
  }
  
  if (w) {
    result.push(dict[w] !== undefined ? dict[w] : w);
  }
  
  return JSON.stringify(result);
}

function lzDecompress(compressed: string): string {
  // 简单的 LZ 解压实现
  const data = JSON.parse(compressed);
  const dict: Record<number, string> = {};
  let dictSize = 256;
  let result = '';
  let w = String(data[0]);
  result += w;
  
  for (let i = 1; i < data.length; i++) {
    const k = data[i];
    let entry: string;
    
    if (dict[k] !== undefined) {
      entry = dict[k];
    } else if (k === dictSize) {
      entry = w + w[0];
    } else {
      entry = String(k);
    }
    
    result += entry;
    dict[dictSize++] = w + entry[0];
    w = entry;
  }
  
  return result;
}

function arrayToCSV(data: any[], options: { headers?: string[], delimiter: string }): string {
  if (!data.length) return '';
  
  const { headers, delimiter } = options;
  const keys = headers || Object.keys(data[0]);
  
  const csvHeaders = keys.join(delimiter);
  const csvRows = data.map(row => 
    keys.map(key => {
      const value = row[key];
      const stringValue = value === null || value === undefined ? '' : String(value);
      return stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    }).join(delimiter)
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

function arrayToXML(data: any[]): string {
  const xmlRows = data.map(item => {
    const fields = Object.entries(item)
      .map(([key, value]) => `<${key}>${value}</${key}>`)
      .join('');
    return `<item>${fields}</item>`;
  }).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?><root>${xmlRows}</root>`;
}

function readFileAsText(file: File, encoding: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, encoding);
  });
}

function detectFormat(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'json': return 'json';
    case 'csv': return 'csv';
    case 'xml': return 'xml';
    default: return 'json';
  }
}

function parseCSV(text: string, options: { delimiter: string, headers: boolean }): any[] {
  const { delimiter, headers } = options;
  const lines = text.split('\n').filter(line => line.trim());
  
  if (!lines.length) return [];
  
  const headerRow = headers ? lines[0].split(delimiter) : null;
  const dataRows = headers ? lines.slice(1) : lines;
  
  return dataRows.map(line => {
    const values = line.split(delimiter);
    if (headerRow) {
      return headerRow.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
        return obj;
      }, {} as Record<string, string>);
    } else {
      return values.map(value => value.trim());
    }
  });
}

function parseXML(text: string): any[] {
  // 简单的 XML 解析实现
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const items = doc.querySelectorAll('item');
  
  return Array.from(items).map(item => {
    const obj: Record<string, string> = {};
    Array.from(item.children).forEach(child => {
      obj[child.tagName] = child.textContent || '';
    });
    return obj;
  });
}