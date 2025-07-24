/**
 * SQL工具模块
 * 提供SQL查询构建、解析和处理的常用功能
 */

// 类型定义
export interface JoinClause {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    condition: string;
}

export interface OrderByClause {
    column: string;
    direction: 'ASC' | 'DESC';
}

export interface ParsedSQL {
    type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | null;
    table: string | null;
    columns: string[];
    conditions: string[];
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export type SQLValue = string | number | boolean | null;
export type DataObject = Record<string, SQLValue>;

/**
 * SQL查询构建器类
 */
export class SQLQueryBuilder {
    private _select: string[] = [];
    private _from: string = '';
    private _joins: JoinClause[] = [];
    private _where: string[] = [];
    private _groupBy: string[] = [];
    private _having: string[] = [];
    private _orderBy: OrderByClause[] = [];
    private _limit: number | null = null;
    private _offset: number | null = null;
    
    constructor() {
        this.reset();
    }
    
    reset(): this {
        this._select = [];
        this._from = '';
        this._joins = [];
        this._where = [];
        this._groupBy = [];
        this._having = [];
        this._orderBy = [];
        this._limit = null;
        this._offset = null;
        return this;
    }
    
    select(columns: string | string[]): this {
        if (Array.isArray(columns)) {
            this._select = [...this._select, ...columns];
        } else {
            this._select.push(columns);
        }
        return this;
    }
    
    from(table: string): this {
        this._from = table;
        return this;
    }
    
    join(table: string, condition: string, type: JoinClause['type'] = 'INNER'): this {
        this._joins.push({ type, table, condition });
        return this;
    }
    
    leftJoin(table: string, condition: string): this {
        return this.join(table, condition, 'LEFT');
    }
    
    rightJoin(table: string, condition: string): this {
        return this.join(table, condition, 'RIGHT');
    }
    
    innerJoin(table: string, condition: string): this {
        return this.join(table, condition, 'INNER');
    }
    
    where(condition: string): this {
        this._where.push(condition);
        return this;
    }
    
    groupBy(columns: string | string[]): this {
        if (Array.isArray(columns)) {
            this._groupBy = [...this._groupBy, ...columns];
        } else {
            this._groupBy.push(columns);
        }
        return this;
    }
    
    having(condition: string): this {
        this._having.push(condition);
        return this;
    }
    
    orderBy(column: string, direction: OrderByClause['direction'] = 'ASC'): this {
        this._orderBy.push({ column, direction });
        return this;
    }
    
    limit(count: number): this {
        this._limit = count;
        return this;
    }
    
    offset(count: number): this {
        this._offset = count;
        return this;
    }
    
    build(): string {
        let query = 'SELECT ';
        
        // SELECT
        if (this._select.length === 0) {
            query += '*';
        } else {
            query += this._select.join(', ');
        }
        
        // FROM
        if (!this._from) {
            throw new Error('FROM clause is required');
        }
        query += ` FROM ${this._from}`;
        
        // JOIN
        this._joins.forEach(join => {
            query += ` ${join.type} JOIN ${join.table} ON ${join.condition}`;
        });
        
        // WHERE
        if (this._where.length > 0) {
            query += ` WHERE ${this._where.join(' AND ')}`;
        }
        
        // GROUP BY
        if (this._groupBy.length > 0) {
            query += ` GROUP BY ${this._groupBy.join(', ')}`;
        }
        
        // HAVING
        if (this._having.length > 0) {
            query += ` HAVING ${this._having.join(' AND ')}`;
        }
        
        // ORDER BY
        if (this._orderBy.length > 0) {
            const orderClauses = this._orderBy.map(order => `${order.column} ${order.direction}`);
            query += ` ORDER BY ${orderClauses.join(', ')}`;
        }
        
        // LIMIT
        if (this._limit !== null) {
            query += ` LIMIT ${this._limit}`;
        }
        
        // OFFSET
        if (this._offset !== null) {
            query += ` OFFSET ${this._offset}`;
        }
        
        return query;
    }
}

/**
 * 创建SELECT查询
 * @param columns - 列名
 * @returns 查询构建器实例
 */
export function select(columns: string | string[] = '*'): SQLQueryBuilder {
    return new SQLQueryBuilder().select(columns);
}

/**
 * SQL转义函数
 * @param value - 需要转义的值
 * @returns 转义后的值
 */
export function escapeSQL(value: SQLValue): string | number | boolean | null {
    if (typeof value === 'string') {
        return value.replace(/'/g, "''");
    }
    return value;
}

/**
 * 构建INSERT语句
 * @param table - 表名
 * @param data - 数据对象
 * @returns INSERT语句
 */
export function buildInsert(table: string, data: DataObject): string {
    const columns = Object.keys(data);
    const values = columns.map(col => {
        const value = data[col];
        if (typeof value === 'string') {
            return `'${escapeSQL(value)}'`;
        }
        return value;
    });
    
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
}

/**
 * 构建UPDATE语句
 * @param table - 表名
 * @param data - 更新数据
 * @param whereClause - WHERE条件
 * @returns UPDATE语句
 */
export function buildUpdate(table: string, data: DataObject, whereClause?: string): string {
    const setClauses = Object.keys(data).map(col => {
        const value = data[col];
        if (typeof value === 'string') {
            return `${col} = '${escapeSQL(value)}'`;
        }
        return `${col} = ${value}`;
    });
    
    let query = `UPDATE ${table} SET ${setClauses.join(', ')}`;
    
    if (whereClause) {
        query += ` WHERE ${whereClause}`;
    }
    
    return query;
}

/**
 * 构建DELETE语句
 * @param table - 表名
 * @param whereClause - WHERE条件
 * @returns DELETE语句
 */
export function buildDelete(table: string, whereClause?: string): string {
    let query = `DELETE FROM ${table}`;
    
    if (whereClause) {
        query += ` WHERE ${whereClause}`;
    }
    
    return query;
}

/**
 * 解析SQL查询
 * @param sql - SQL语句
 * @returns 解析结果
 */
export function parseSQL(sql: string): ParsedSQL {
    const trimmedSQL = sql.trim().toUpperCase();
    
    const result: ParsedSQL = {
        type: null,
        table: null,
        columns: [],
        conditions: []
    };
    
    // 确定查询类型
    if (trimmedSQL.startsWith('SELECT')) {
        result.type = 'SELECT';
    } else if (trimmedSQL.startsWith('INSERT')) {
        result.type = 'INSERT';
    } else if (trimmedSQL.startsWith('UPDATE')) {
        result.type = 'UPDATE';
    } else if (trimmedSQL.startsWith('DELETE')) {
        result.type = 'DELETE';
    }
    
    // 简单的表名提取
    const fromMatch = sql.match(/FROM\s+(\w+)/i);
    if (fromMatch) {
        result.table = fromMatch[1];
    }
    
    const intoMatch = sql.match(/INTO\s+(\w+)/i);
    if (intoMatch) {
        result.table = intoMatch[1];
    }
    
    const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (updateMatch) {
        result.table = updateMatch[1];
    }
    
    return result;
}

/**
 * 格式化SQL语句
 * @param sql - SQL语句
 * @returns 格式化后的SQL
 */
export function formatSQL(sql: string): string {
    return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*(=|<|>|<=|>=|!=)\s*/g, ' $1 ')
        .replace(/\bSELECT\b/gi, 'SELECT')
        .replace(/\bFROM\b/gi, '\nFROM')
        .replace(/\bWHERE\b/gi, '\nWHERE')
        .replace(/\bJOIN\b/gi, '\nJOIN')
        .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
        .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
        .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
        .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
        .replace(/\bHAVING\b/gi, '\nHAVING')
        .replace(/\bORDER BY\b/gi, '\nORDER BY')
        .replace(/\bLIMIT\b/gi, '\nLIMIT')
        .trim();
}

/**
 * 验证SQL语句
 * @param sql - SQL语句
 * @returns 验证结果
 */
export function validateSQL(sql: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 基本语法检查
    if (!sql || sql.trim().length === 0) {
        errors.push('SQL语句不能为空');
    }
    
    // 检查是否有未闭合的引号
    const singleQuotes = (sql.match(/'/g) || []).length;
    const doubleQuotes = (sql.match(/"/g) || []).length;
    
    if (singleQuotes % 2 !== 0) {
        errors.push('存在未闭合的单引号');
    }
    
    if (doubleQuotes % 2 !== 0) {
        errors.push('存在未闭合的双引号');
    }
    
    // 检查是否有SELECT但没有FROM
    if (/SELECT/i.test(sql) && !/FROM/i.test(sql)) {
        warnings.push('SELECT语句通常需要FROM子句');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

export default {
    SQLQueryBuilder,
    select,
    escapeSQL,
    buildInsert,
    buildUpdate,
    buildDelete,
    parseSQL,
    formatSQL,
    validateSQL
};