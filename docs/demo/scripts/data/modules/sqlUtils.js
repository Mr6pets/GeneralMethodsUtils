/**
 * SQL工具模块演示数据 - 企业级SQL查询构建和数据库操作工具
 */
export default {
    title: 'SQL工具',
    icon: 'Database',
    description: '企业级SQL查询构建、数据库连接池、事务处理和ORM工具集',
    methods: {
        SQLQueryBuilder: {
            name: 'SQLQueryBuilder',
            description: '高级SQL查询构建器，支持复杂查询、子查询和窗口函数',
            params: [
                { name: 'options', type: 'object', required: false, description: '构建器配置选项' }
            ],
            examples: {
                js: `// 复杂查询示例：用户订单统计
const builder = new SQLQueryBuilder();
const query = builder
  .select([
    'u.name',
    'u.email',
    'COUNT(o.id) as order_count',
    'SUM(o.total) as total_spent',
    'AVG(o.total) as avg_order_value'
  ])
  .from('users u')
  .leftJoin('orders o', 'u.id = o.user_id')
  .where('u.status', '=', 'active')
  .where('o.created_at', '>=', '2024-01-01')
  .groupBy(['u.id', 'u.name', 'u.email'])
  .having('COUNT(o.id)', '>', 0)
  .orderBy('total_spent', 'DESC')
  .limit(50)
  .build();

// 子查询示例：高价值客户分析
const subQuery = builder
  .select('user_id')
  .from('orders')
  .where('total', '>', 1000)
  .groupBy('user_id')
  .having('COUNT(*)', '>=', 3);

const mainQuery = builder
  .select(['u.*', 'p.tier_name'])
  .from('users u')
  .join('user_profiles p', 'u.id = p.user_id')
  .whereIn('u.id', subQuery)
  .build();`,
                ts: `interface QueryOptions {
  dialect?: 'mysql' | 'postgresql' | 'sqlite';
  timezone?: string;
}

const builder = new SQLQueryBuilder<QueryOptions>({
  dialect: 'postgresql',
  timezone: 'UTC'
});

const query: string = builder
  .select(['u.name', 'COUNT(o.id) as order_count'])
  .from('users u')
  .leftJoin('orders o', 'u.id = o.user_id')
  .where('u.created_at', '>=', new Date('2024-01-01'))
  .groupBy(['u.id', 'u.name'])
  .build();`
            },
            demo: true
        },
        
        createConnectionPool: {
            name: 'createConnectionPool',
            description: '创建数据库连接池，支持连接复用和自动重连',
            params: [
                { name: 'config', type: 'object', required: true, description: '数据库配置' },
                { name: 'poolOptions', type: 'object', required: false, description: '连接池选项' }
            ],
            examples: {
                js: `// 生产环境连接池配置
const pool = createConnectionPool({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'dbuser',
  password: process.env.DB_PASSWORD
}, {
  min: 2,
  max: 20,
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200
});

// 使用连接池执行查询
const result = await pool.query(
  'SELECT * FROM users WHERE status = $1 AND created_at > $2',
  ['active', new Date('2024-01-01')]
);

// 事务处理
const transaction = await pool.transaction(async (trx) => {
  const user = await trx.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', ['John', 'john@example.com']);
  await trx.query('INSERT INTO user_profiles (user_id, tier) VALUES ($1, $2)', [user.rows[0].id, 'premium']);
  return user.rows[0];
});`,
                ts: `interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

interface PoolOptions {
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  idleTimeoutMillis: number;
}

const pool: ConnectionPool = createConnectionPool(config, poolOptions);
const result: QueryResult = await pool.query(sql, params);`
            },
            demo: true
        },
        
        buildComplexJoin: {
            name: 'buildComplexJoin',
            description: '构建复杂的多表JOIN查询，支持各种JOIN类型',
            params: [
                { name: 'tables', type: 'array', required: true, description: '表配置数组' },
                { name: 'conditions', type: 'object', required: false, description: 'JOIN条件' }
            ],
            examples: {
                js: `// 电商订单分析：多表关联查询
const query = buildComplexJoin([
  { table: 'orders o', type: 'main' },
  { table: 'users u', type: 'inner', on: 'o.user_id = u.id' },
  { table: 'order_items oi', type: 'left', on: 'o.id = oi.order_id' },
  { table: 'products p', type: 'inner', on: 'oi.product_id = p.id' },
  { table: 'categories c', type: 'left', on: 'p.category_id = c.id' },
  { table: 'user_addresses ua', type: 'left', on: 'o.shipping_address_id = ua.id' }
], {
  select: [
    'o.id as order_id',
    'o.total',
    'o.status',
    'u.name as customer_name',
    'u.email',
    'p.name as product_name',
    'p.price',
    'c.name as category',
    'ua.city',
    'ua.country'
  ],
  where: {
    'o.created_at': ['>=', '2024-01-01'],
    'o.status': ['IN', ['completed', 'shipped']],
    'p.status': ['=', 'active']
  },
  orderBy: [['o.created_at', 'DESC']]
});

// 用户行为分析：时间窗口查询
const behaviorQuery = buildComplexJoin([
  { table: 'user_events ue', type: 'main' },
  { table: 'users u', type: 'inner', on: 'ue.user_id = u.id' },
  { table: 'sessions s', type: 'left', on: 'ue.session_id = s.id' }
], {
  select: [
    'u.id',
    'u.name',
    'COUNT(DISTINCT ue.id) as total_events',
    'COUNT(DISTINCT s.id) as total_sessions',
    'AVG(s.duration) as avg_session_duration'
  ],
  where: {
    'ue.created_at': ['BETWEEN', ['2024-01-01', '2024-12-31']],
    'ue.event_type': ['IN', ['page_view', 'click', 'purchase']]
  },
  groupBy: ['u.id', 'u.name'],
  having: {
    'COUNT(DISTINCT ue.id)': ['>', 100]
  }
});`,
                ts: `interface JoinTable {
  table: string;
  type: 'main' | 'inner' | 'left' | 'right' | 'full';
  on?: string;
}

interface JoinConditions {
  select?: string[];
  where?: Record<string, [string, any]>;
  groupBy?: string[];
  having?: Record<string, [string, any]>;
  orderBy?: [string, 'ASC' | 'DESC'][];
}

const query: string = buildComplexJoin(tables, conditions);`
            },
            demo: true
        },
        
        createORM: {
            name: 'createORM',
            description: '创建轻量级ORM，支持模型定义、关联关系和查询构建',
            params: [
                { name: 'models', type: 'object', required: true, description: '模型定义' },
                { name: 'options', type: 'object', required: false, description: 'ORM配置' }
            ],
            examples: {
                js: `// 定义数据模型
const models = {
  User: {
    table: 'users',
    fields: {
      id: { type: 'integer', primaryKey: true, autoIncrement: true },
      name: { type: 'string', required: true, maxLength: 100 },
      email: { type: 'string', unique: true, validate: 'email' },
      password: { type: 'string', required: true, hidden: true },
      status: { type: 'enum', values: ['active', 'inactive', 'banned'], default: 'active' },
      created_at: { type: 'datetime', default: 'now' },
      updated_at: { type: 'datetime', onUpdate: 'now' }
    },
    relations: {
      orders: { type: 'hasMany', model: 'Order', foreignKey: 'user_id' },
      profile: { type: 'hasOne', model: 'UserProfile', foreignKey: 'user_id' }
    },
    hooks: {
      beforeCreate: (data) => {
        data.password = hashPassword(data.password);
      },
      afterCreate: (user) => {
        sendWelcomeEmail(user.email);
      }
    }
  },
  
  Order: {
    table: 'orders',
    fields: {
      id: { type: 'integer', primaryKey: true, autoIncrement: true },
      user_id: { type: 'integer', required: true, references: 'users.id' },
      total: { type: 'decimal', precision: 10, scale: 2, required: true },
      status: { type: 'enum', values: ['pending', 'completed', 'cancelled'], default: 'pending' },
      created_at: { type: 'datetime', default: 'now' }
    },
    relations: {
      user: { type: 'belongsTo', model: 'User', foreignKey: 'user_id' },
      items: { type: 'hasMany', model: 'OrderItem', foreignKey: 'order_id' }
    }
  }
};

const orm = createORM(models, {
  connection: pool,
  logging: true,
  cache: true,
  migrations: true
});

// 使用ORM进行查询
const users = await orm.User
  .where('status', 'active')
  .where('created_at', '>', '2024-01-01')
  .with(['orders', 'profile'])
  .orderBy('created_at', 'desc')
  .limit(10)
  .get();

// 创建新用户
const newUser = await orm.User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword'
});

// 复杂查询：获取高价值客户
const highValueCustomers = await orm.User
  .select(['users.*', 'SUM(orders.total) as total_spent'])
  .join('orders', 'users.id', 'orders.user_id')
  .where('orders.status', 'completed')
  .groupBy('users.id')
  .having('SUM(orders.total)', '>', 1000)
  .orderBy('total_spent', 'desc')
  .get();`,
                ts: `interface ModelField {
  type: 'string' | 'integer' | 'decimal' | 'boolean' | 'datetime' | 'enum';
  primaryKey?: boolean;
  required?: boolean;
  unique?: boolean;
  default?: any;
  validate?: string | RegExp | ((value: any) => boolean);
}

interface ModelDefinition {
  table: string;
  fields: Record<string, ModelField>;
  relations?: Record<string, any>;
  hooks?: Record<string, Function>;
}

const orm: ORM = createORM(models, options);
const users: User[] = await orm.User.where('status', 'active').get();`
            },
            demo: true
        },
        
        batchOperations: {
            name: 'batchOperations',
            description: '批量数据操作，支持批量插入、更新和删除，提高性能',
            params: [
                { name: 'operation', type: 'string', required: true, description: '操作类型：insert, update, delete' },
                { name: 'table', type: 'string', required: true, description: '目标表名' },
                { name: 'data', type: 'array', required: true, description: '数据数组' },
                { name: 'options', type: 'object', required: false, description: '批量操作选项' }
            ],
            examples: {
                js: `// 批量插入用户数据（适用于数据导入）
const users = [
  { name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
  { name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
  { name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' }
  // ... 可以是数千条记录
];

const result = await batchOperations('insert', 'users', users, {
  batchSize: 1000,  // 每批处理1000条
  onConflict: 'ignore',  // 遇到冲突时忽略
  returning: ['id', 'name'],  // 返回指定字段
  validate: true,  // 启用数据验证
  transaction: true  // 使用事务
});

// 批量更新订单状态
const orderUpdates = [
  { id: 1, status: 'shipped', tracking_number: 'TRK001' },
  { id: 2, status: 'delivered', delivered_at: new Date() },
  { id: 3, status: 'cancelled', cancelled_reason: 'Customer request' }
];

await batchOperations('update', 'orders', orderUpdates, {
  keyField: 'id',  // 用于匹配的字段
  batchSize: 500,
  onError: 'continue'  // 遇到错误继续处理其他记录
});

// 批量软删除（标记为删除而不是物理删除）
const idsToDelete = [1, 2, 3, 4, 5];
await batchOperations('update', 'users', 
  idsToDelete.map(id => ({ id, deleted_at: new Date(), status: 'deleted' })),
  { keyField: 'id' }
);

// 批量数据同步（Upsert操作）
const syncData = [
  { external_id: 'EXT001', name: 'Updated Name', last_sync: new Date() },
  { external_id: 'EXT002', name: 'New Record', last_sync: new Date() }
];

await batchOperations('upsert', 'external_users', syncData, {
  conflictFields: ['external_id'],
  updateFields: ['name', 'last_sync'],
  insertFields: ['external_id', 'name', 'last_sync', 'created_at']
});`,
                ts: `interface BatchOptions {
  batchSize?: number;
  onConflict?: 'ignore' | 'update' | 'error';
  returning?: string[];
  validate?: boolean;
  transaction?: boolean;
  keyField?: string;
  onError?: 'stop' | 'continue';
}

interface BatchResult {
  success: boolean;
  affectedRows: number;
  errors: any[];
  insertedIds?: any[];
}

const result: BatchResult = await batchOperations(
  'insert',
  'users',
  userData,
  options
);`
            },
            demo: true
        },
        
        queryOptimizer: {
            name: 'queryOptimizer',
            description: '查询优化器，分析和优化SQL查询性能',
            params: [
                { name: 'query', type: 'string', required: true, description: 'SQL查询语句' },
                { name: 'options', type: 'object', required: false, description: '优化选项' }
            ],
            examples: {
                js: `// 分析查询性能
const slowQuery = \`
  SELECT u.*, p.*, o.* 
  FROM users u 
  LEFT JOIN profiles p ON u.id = p.user_id 
  LEFT JOIN orders o ON u.id = o.user_id 
  WHERE u.created_at > '2024-01-01' 
  AND o.total > 100
\`;

const analysis = await queryOptimizer(slowQuery, {
  analyze: true,
  suggest: true,
  benchmark: true
});

console.log('执行计划:', analysis.executionPlan);
console.log('性能指标:', analysis.performance);
console.log('优化建议:', analysis.suggestions);

// 自动优化查询
const optimizedQuery = await queryOptimizer(slowQuery, {
  autoOptimize: true,
  addIndexHints: true,
  rewriteSubqueries: true,
  optimizeJoins: true
});

console.log('优化后的查询:', optimizedQuery.optimized);
console.log('预期性能提升:', optimizedQuery.improvement);

// 索引建议
const indexSuggestions = await queryOptimizer(slowQuery, {
  suggestIndexes: true,
  analyzeTableStats: true
});

console.log('建议创建的索引:');
indexSuggestions.indexes.forEach(index => {
  console.log(\`CREATE INDEX \${index.name} ON \${index.table} (\${index.columns.join(', ')});\`);
});`,
                ts: `interface OptimizationOptions {
  analyze?: boolean;
  suggest?: boolean;
  benchmark?: boolean;
  autoOptimize?: boolean;
  addIndexHints?: boolean;
  rewriteSubqueries?: boolean;
  optimizeJoins?: boolean;
  suggestIndexes?: boolean;
}

interface QueryAnalysis {
  executionPlan: any;
  performance: {
    estimatedCost: number;
    estimatedRows: number;
    executionTime: number;
  };
  suggestions: string[];
  optimized?: string;
  improvement?: number;
  indexes?: IndexSuggestion[];
}

const analysis: QueryAnalysis = await queryOptimizer(query, options);`
            },
            demo: true
        }
    }
};