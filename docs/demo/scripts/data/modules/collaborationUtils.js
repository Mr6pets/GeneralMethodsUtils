// 实时协作工具模块
export default {
    title: '实时协作工具',
    icon: 'fas fa-users',
    methods: {
        RealtimeManager: {
            name: 'RealtimeManager',
            description: '实时通信管理器，提供WebSocket连接、房间管理、消息广播等功能',
            params: [
                { name: 'options', type: 'object', required: false, description: '配置选项' }
            ],
            examples: {
                js: `// 创建实时通信管理器\nconst manager = new RealtimeManager({\n  heartbeatInterval: 30000,\n  reconnectAttempts: 5\n});\n\n// 连接WebSocket\nconst ws = await manager.connect('ws://localhost:8080');\n\n// 加入房间\nmanager.joinRoom(connectionId, 'room1');\n\n// 发送消息\nmanager.send(connectionId, {\n  type: 'chat',\n  message: 'Hello World!'\n});`,
                ts: `import { RealtimeManager } from 'general-method-utils';\n\n// 创建实时通信管理器\nconst manager = new RealtimeManager({\n  heartbeatInterval: 30000,\n  reconnectAttempts: 5\n});\n\n// 连接WebSocket\nconst ws: WebSocket = await manager.connect('ws://localhost:8080');\n\n// 加入房间\nmanager.joinRoom(connectionId, 'room1');`
            },
            demo: true
        },
        OperationalTransform: {
            name: 'OperationalTransform',
            description: '操作变换算法，用于协同编辑中的冲突解决',
            params: [
                { name: 'options', type: 'object', required: false, description: '配置选项' }
            ],
            examples: {
                js: `// 创建操作变换实例\nconst ot = new OperationalTransform();\n\n// 应用操作\nconst operation = {\n  type: 'insert',\n  position: 5,\n  content: 'Hello'\n};\n\nconst result = ot.apply(document, operation);`,
                ts: `import { OperationalTransform } from 'general-method-utils';\n\nconst ot = new OperationalTransform();\nconst operation = {\n  type: 'insert',\n  position: 5,\n  content: 'Hello'\n};\n\nconst result = ot.apply(document, operation);`
            },
            demo: true
        },
        ConflictResolver: {
            name: 'ConflictResolver',
            description: '冲突解决器，处理并发编辑时的冲突',
            params: [
                { name: 'strategy', type: 'string', required: false, description: '解决策略：last-write-wins, operational-transform' }
            ],
            examples: {
                js: `// 创建冲突解决器\nconst resolver = new ConflictResolver('operational-transform');\n\n// 解决冲突\nconst resolved = resolver.resolve(localChanges, remoteChanges);`,
                ts: `import { ConflictResolver } from 'general-method-utils';\n\nconst resolver = new ConflictResolver('operational-transform');\nconst resolved = resolver.resolve(localChanges, remoteChanges);`
            },
            demo: true
        },
        PresenceManager: {
            name: 'PresenceManager',
            description: '在线状态管理器，跟踪用户在线状态和光标位置',
            params: [
                { name: 'options', type: 'object', required: false, description: '配置选项' }
            ],
            examples: {
                js: `// 创建在线状态管理器\nconst presence = new PresenceManager();\n\n// 更新用户状态\npresence.updateUser('user1', {\n  online: true,\n  cursor: { line: 10, column: 5 },\n  selection: { start: 100, end: 120 }\n});\n\n// 获取所有在线用户\nconst onlineUsers = presence.getOnlineUsers();`,
                ts: `import { PresenceManager } from 'general-method-utils';\n\nconst presence = new PresenceManager();\n\npresence.updateUser('user1', {\n  online: true,\n  cursor: { line: 10, column: 5 },\n  selection: { start: 100, end: 120 }\n});`
            },
            demo: true
        },
        DocumentSynchronizer: {
            name: 'DocumentSynchronizer',
            description: '文档同步器，实现多用户文档的实时同步',
            params: [
                { name: 'documentId', type: 'string', required: true, description: '文档ID' },
                { name: 'options', type: 'object', required: false, description: '同步选项' }
            ],
            examples: {
                js: `// 创建文档同步器\nconst sync = new DocumentSynchronizer('doc123', {\n  autoSave: true,\n  saveInterval: 5000\n});\n\n// 监听文档变化\nsync.on('change', (change) => {\n  console.log('文档已更新:', change);\n});\n\n// 应用本地更改\nsync.applyLocalChange({\n  type: 'insert',\n  position: 10,\n  content: 'New text'\n});`,
                ts: `import { DocumentSynchronizer } from 'general-method-utils';\n\nconst sync = new DocumentSynchronizer('doc123', {\n  autoSave: true,\n  saveInterval: 5000\n});\n\nsync.on('change', (change) => {\n  console.log('文档已更新:', change);\n});`
            },
            demo: true
        }
    }
};