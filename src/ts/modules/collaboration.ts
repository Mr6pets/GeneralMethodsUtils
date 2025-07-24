import {
  CollaborationOptions,
  CollaborationUser,
  CursorPosition,
  SelectionRange,
  CollaborationOperation,
  OperationTransformResult,
  DocumentState,
  ConflictResolution,
  SyncOptions,
  CollaborationEvent,
  RealtimeConnection,
  PresenceInfo
} from '../types';

/**
 * 实时协作管理器
 */
export class RealtimeManager {
  private connection: WebSocket | null = null;
  private connectionInfo: RealtimeConnection;
  private users: Map<string, CollaborationUser> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private heartbeatInterval: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private options: CollaborationOptions;

  constructor(options: CollaborationOptions = {}) {
    this.options = {
      reconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options
    };
    
    this.maxReconnectAttempts = this.options.reconnectAttempts!;
    
    this.connectionInfo = {
      id: this.generateConnectionId(),
      status: 'disconnected',
      lastPing: 0,
      reconnectAttempts: 0
    };
  }

  /**
   * 连接到协作服务器
   */
  async connect(): Promise<void> {
    if (!this.options.serverUrl) {
      throw new Error('Server URL is required');
    }

    try {
      this.connectionInfo.status = 'connecting';
      this.connection = new WebSocket(this.options.serverUrl);

      this.connection.onopen = () => {
        this.connectionInfo.status = 'connected';
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('connected', { connectionId: this.connectionInfo.id });
        
        // 发送加入房间消息
        if (this.options.roomId) {
          this.send({
            type: 'join-room',
            roomId: this.options.roomId,
            userId: this.options.userId,
            userName: this.options.userName
          });
        }
      };

      this.connection.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.connection.onclose = () => {
        this.connectionInfo.status = 'disconnected';
        this.stopHeartbeat();
        this.emit('disconnected', { connectionId: this.connectionInfo.id });
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect();
        }
      };

      this.connection.onerror = (error) => {
        this.connectionInfo.status = 'error';
        this.emit('error', { error, connectionId: this.connectionInfo.id });
      };
    } catch (error) {
      this.connectionInfo.status = 'error';
      throw new Error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.stopHeartbeat();
    this.connectionInfo.status = 'disconnected';
  }

  /**
   * 重新连接
   */
  private async reconnect(): Promise<void> {
    this.reconnectAttempts++;
    this.connectionInfo.reconnectAttempts = this.reconnectAttempts;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * 发送消息
   */
  private send(message: any): void {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message));
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: any): void {
    switch (message.type) {
      case 'user-joined':
        this.handleUserJoined(message.user);
        break;
      case 'user-left':
        this.handleUserLeft(message.userId);
        break;
      case 'operation':
        this.handleOperation(message.operation);
        break;
      case 'cursor-update':
        this.handleCursorUpdate(message.userId, message.cursor);
        break;
      case 'selection-update':
        this.handleSelectionUpdate(message.userId, message.selection);
        break;
      case 'sync':
        this.handleSync(message.state);
        break;
      case 'pong':
        this.connectionInfo.lastPing = Date.now();
        break;
      default:
        this.emit('message', message);
    }
  }

  /**
   * 处理用户加入
   */
  private handleUserJoined(user: CollaborationUser): void {
    this.users.set(user.id, user);
    this.emit('user-join', { user });
  }

  /**
   * 处理用户离开
   */
  private handleUserLeft(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      this.emit('user-leave', { user });
    }
  }

  /**
   * 处理操作
   */
  private handleOperation(operation: CollaborationOperation): void {
    this.emit('operation', { operation });
  }

  /**
   * 处理光标更新
   */
  private handleCursorUpdate(userId: string, cursor: CursorPosition): void {
    const user = this.users.get(userId);
    if (user) {
      user.cursor = cursor;
      this.emit('cursor-move', { userId, cursor });
    }
  }

  /**
   * 处理选择更新
   */
  private handleSelectionUpdate(userId: string, selection: SelectionRange): void {
    const user = this.users.get(userId);
    if (user) {
      user.selection = selection;
      this.emit('selection-change', { userId, selection });
    }
  }

  /**
   * 处理同步
   */
  private handleSync(state: DocumentState): void {
    this.emit('sync', { state });
  }

  /**
   * 发送操作
   */
  sendOperation(operation: Omit<CollaborationOperation, 'id' | 'userId' | 'timestamp'>): void {
    const fullOperation: CollaborationOperation = {
      id: this.generateOperationId(),
      userId: this.options.userId || 'anonymous',
      timestamp: Date.now(),
      ...operation
    };

    this.send({
      type: 'operation',
      operation: fullOperation
    });
  }

  /**
   * 更新光标位置
   */
  updateCursor(cursor: CursorPosition): void {
    this.send({
      type: 'cursor-update',
      cursor
    });
  }

  /**
   * 更新选择范围
   */
  updateSelection(selection: SelectionRange): void {
    this.send({
      type: 'selection-update',
      selection
    });
  }

  /**
   * 开始心跳
   */
  private startHeartbeat(): void {
    if (this.options.heartbeatInterval) {
      this.heartbeatInterval = window.setInterval(() => {
        this.send({ type: 'ping' });
      }, this.options.heartbeatInterval);
    }
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 生成连接 ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成操作 ID
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 事件监听
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * 移除事件监听
   */
  off(event: string, callback?: Function): void {
    if (!callback) {
      this.eventListeners.delete(event);
    } else {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): RealtimeConnection {
    return { ...this.connectionInfo };
  }

  /**
   * 获取在线用户
   */
  getUsers(): CollaborationUser[] {
    return Array.from(this.users.values());
  }

  /**
   * 获取用户信息
   */
  getUser(userId: string): CollaborationUser | undefined {
    return this.users.get(userId);
  }
}

/**
 * 协同编辑器
 */
export class CollaborativeEditor {
  private operations: CollaborationOperation[] = [];
  private documentState: DocumentState;
  private realtimeManager: RealtimeManager;
  private syncOptions: SyncOptions;
  private syncInterval: number | null = null;

  constructor(realtimeManager: RealtimeManager, initialContent: string = '', syncOptions: SyncOptions = {}) {
    this.realtimeManager = realtimeManager;
    this.syncOptions = {
      interval: 5000,
      batchSize: 10,
      conflictResolution: { strategy: 'operational-transform' },
      ...syncOptions
    };

    this.documentState = {
      content: initialContent,
      version: 0,
      operations: [],
      lastModified: Date.now()
    };

    this.setupEventListeners();
    this.startSync();
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.realtimeManager.on('operation', ({ operation }: { operation: CollaborationOperation }) => {
      this.applyOperation(operation);
    });

    this.realtimeManager.on('sync', ({ state }: { state: DocumentState }) => {
      this.handleSync(state);
    });
  }

  /**
   * 应用操作
   */
  applyOperation(operation: CollaborationOperation): void {
    try {
      const transformedOp = this.transformOperation(operation);
      this.executeOperation(transformedOp);
      this.operations.push(transformedOp);
      this.documentState.version++;
      this.documentState.lastModified = Date.now();
    } catch (error) {
      console.error('Failed to apply operation:', error);
    }
  }

  /**
   * 执行操作
   */
  private executeOperation(operation: CollaborationOperation): void {
    let content = this.documentState.content;

    switch (operation.type) {
      case 'insert':
        if (operation.content) {
          content = content.slice(0, operation.position) + 
                   operation.content + 
                   content.slice(operation.position);
        }
        break;
      case 'delete':
        if (operation.length) {
          content = content.slice(0, operation.position) + 
                   content.slice(operation.position + operation.length);
        }
        break;
      case 'retain':
        // 保留操作，不修改内容
        break;
      case 'format':
        // 格式化操作，应用属性
        break;
    }

    this.documentState.content = content;
  }

  /**
   * 操作转换
   */
  private transformOperation(operation: CollaborationOperation): CollaborationOperation {
    // 简化的操作转换实现
    // 实际应用中需要更复杂的 OT 算法
    let transformedOp = { ...operation };

    // 根据已有操作调整位置
    for (const existingOp of this.operations) {
      if (existingOp.timestamp < operation.timestamp) {
        if (existingOp.type === 'insert' && existingOp.position <= transformedOp.position) {
          transformedOp.position += existingOp.content?.length || 0;
        } else if (existingOp.type === 'delete' && existingOp.position < transformedOp.position) {
          transformedOp.position -= existingOp.length || 0;
        }
      }
    }

    return transformedOp;
  }

  /**
   * 插入文本
   */
  insert(position: number, content: string): void {
    const operation: Omit<CollaborationOperation, 'id' | 'userId' | 'timestamp'> = {
      type: 'insert',
      position,
      content
    };

    this.realtimeManager.sendOperation(operation);
    this.applyOperation({
      id: `local_${Date.now()}`,
      userId: 'local',
      timestamp: Date.now(),
      ...operation
    });
  }

  /**
   * 删除文本
   */
  delete(position: number, length: number): void {
    const operation: Omit<CollaborationOperation, 'id' | 'userId' | 'timestamp'> = {
      type: 'delete',
      position,
      length
    };

    this.realtimeManager.sendOperation(operation);
    this.applyOperation({
      id: `local_${Date.now()}`,
      userId: 'local',
      timestamp: Date.now(),
      ...operation
    });
  }

  /**
   * 处理同步
   */
  private handleSync(remoteState: DocumentState): void {
    if (remoteState.version > this.documentState.version) {
      // 远程版本更新，需要合并
      this.mergeState(remoteState);
    }

    if (this.syncOptions.onSync) {
      this.syncOptions.onSync(this.documentState);
    }
  }

  /**
   * 合并状态
   */
  private mergeState(remoteState: DocumentState): void {
    if (this.syncOptions.conflictResolution?.strategy === 'last-write-wins') {
      this.documentState = { ...remoteState };
    } else if (this.syncOptions.conflictResolution?.strategy === 'operational-transform') {
      // 实现操作转换合并
      this.mergeWithOT(remoteState);
    } else if (this.syncOptions.conflictResolution?.strategy === 'three-way-merge') {
      // 实现三路合并
      this.mergeWithThreeWay(remoteState);
    }
  }

  /**
   * 操作转换合并
   */
  private mergeWithOT(remoteState: DocumentState): void {
    // 简化的 OT 合并实现
    const newOperations = remoteState.operations.filter(
      remoteOp => !this.operations.some(localOp => localOp.id === remoteOp.id)
    );

    newOperations.forEach(op => {
      this.applyOperation(op);
    });
  }

  /**
   * 三路合并
   */
  private mergeWithThreeWay(remoteState: DocumentState): void {
    if (this.syncOptions.conflictResolution?.resolver) {
      const mergedContent = this.syncOptions.conflictResolution.resolver(
        this.documentState.content,
        remoteState.content
      );
      this.documentState.content = mergedContent;
      this.documentState.version = Math.max(this.documentState.version, remoteState.version) + 1;
    }
  }

  /**
   * 开始同步
   */
  private startSync(): void {
    if (this.syncOptions.interval) {
      this.syncInterval = window.setInterval(() => {
        this.sync();
      }, this.syncOptions.interval);
    }
  }

  /**
   * 停止同步
   */
  private stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * 手动同步
   */
  sync(): void {
    // 发送当前状态到服务器
    // 实际实现中需要根据具体协议发送同步请求
  }

  /**
   * 获取文档内容
   */
  getContent(): string {
    return this.documentState.content;
  }

  /**
   * 获取文档状态
   */
  getState(): DocumentState {
    return { ...this.documentState };
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    this.stopSync();
    this.realtimeManager.off('operation');
    this.realtimeManager.off('sync');
  }
}

/**
 * 状态同步管理器
 */
export class StateSyncManager {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  private realtimeManager: RealtimeManager;

  constructor(realtimeManager: RealtimeManager) {
    this.realtimeManager = realtimeManager;
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.realtimeManager.on('state-change', ({ key, value }: { key: string; value: any }) => {
      this.handleRemoteStateChange(key, value);
    });
  }

  /**
   * 设置状态
   */
  setState(key: string, value: any): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    // 通知本地监听器
    this.notifyListeners(key, value, oldValue);

    // 发送到远程
    this.realtimeManager.send({
      type: 'state-change',
      key,
      value
    });
  }

  /**
   * 获取状态
   */
  getState(key: string): any {
    return this.state.get(key);
  }

  /**
   * 监听状态变化
   */
  onStateChange(key: string, callback: (value: any, oldValue: any) => void): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  /**
   * 移除状态监听
   */
  offStateChange(key: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(key);
    } else {
      const listeners = this.listeners.get(key);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  /**
   * 处理远程状态变化
   */
  private handleRemoteStateChange(key: string, value: any): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    this.notifyListeners(key, value, oldValue);
  }

  /**
   * 通知监听器
   */
  private notifyListeners(key: string, value: any, oldValue: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(value, oldValue);
        } catch (error) {
          console.error(`Error in state change listener for ${key}:`, error);
        }
      });
    }
  }

  /**
   * 获取所有状态
   */
  getAllState(): Record<string, any> {
    return Object.fromEntries(this.state);
  }

  /**
   * 清除状态
   */
  clearState(key?: string): void {
    if (key) {
      this.state.delete(key);
    } else {
      this.state.clear();
    }
  }
}

// 创建默认实例
let defaultRealtimeManager: RealtimeManager | null = null;

// 导出工具函数
export const collaborationUtils = {
  // 创建实时管理器
  createRealtimeManager: (options?: CollaborationOptions) => new RealtimeManager(options),
  
  // 创建协同编辑器
  createCollaborativeEditor: (realtimeManager: RealtimeManager, initialContent?: string, syncOptions?: SyncOptions) => 
    new CollaborativeEditor(realtimeManager, initialContent, syncOptions),
  
  // 创建状态同步管理器
  createStateSyncManager: (realtimeManager: RealtimeManager) => new StateSyncManager(realtimeManager),
  
  // 获取默认实时管理器
  getDefaultManager: () => {
    if (!defaultRealtimeManager) {
      defaultRealtimeManager = new RealtimeManager();
    }
    return defaultRealtimeManager;
  },
  
  // 设置默认实时管理器
  setDefaultManager: (manager: RealtimeManager) => {
    defaultRealtimeManager = manager;
  },
  
  // 操作转换工具
  transformOperations: (op1: CollaborationOperation, op2: CollaborationOperation): OperationTransformResult => {
    // 简化的操作转换实现
    let transformedOp1 = { ...op1 };
    let transformedOp2 = { ...op2 };
    
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position <= op2.position) {
        transformedOp2.position += op1.content?.length || 0;
      } else {
        transformedOp1.position += op2.content?.length || 0;
      }
    } else if (op1.type === 'delete' && op2.type === 'insert') {
      if (op1.position < op2.position) {
        transformedOp2.position -= op1.length || 0;
      }
    } else if (op1.type === 'insert' && op2.type === 'delete') {
      if (op2.position < op1.position) {
        transformedOp1.position -= op2.length || 0;
      }
    }
    
    return {
      transformedOp: transformedOp1,
      transformedAgainst: transformedOp2
    };
  }
};

export default collaborationUtils;