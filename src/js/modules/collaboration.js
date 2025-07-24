/**
 * 实时协作工具模块
 * 提供实时通信、协同编辑、状态同步等功能
 */

/**
 * 实时通信管理器
 */
class RealtimeManager {
  constructor(options = {}) {
    this.connections = new Map();
    this.rooms = new Map();
    this.eventHandlers = new Map();
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      reconnectAttempts: options.reconnectAttempts || 5,
      reconnectDelay: options.reconnectDelay || 1000
    };
  }

  /**
   * 创建WebSocket连接
   * @param {string} url WebSocket URL
   * @param {Object} options 连接选项
   * @returns {Promise<WebSocket>} WebSocket连接
   */
  async connect(url, options = {}) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      const connectionId = this.generateConnectionId();
      
      const connection = {
        id: connectionId,
        ws,
        url,
        status: 'connecting',
        reconnectAttempts: 0,
        lastHeartbeat: Date.now(),
        rooms: new Set()
      };
      
      ws.onopen = () => {
        connection.status = 'connected';
        this.connections.set(connectionId, connection);
        this.startHeartbeat(connectionId);
        resolve(ws);
      };
      
      ws.onclose = (event) => {
        connection.status = 'disconnected';
        this.handleDisconnection(connectionId, event);
      };
      
      ws.onerror = (error) => {
        connection.status = 'error';
        reject(error);
      };
      
      ws.onmessage = (event) => {
        this.handleMessage(connectionId, event.data);
      };
    });
  }

  /**
   * 发送消息
   * @param {string} connectionId 连接ID
   * @param {Object} message 消息内容
   */
  send(connectionId, message) {
    const connection = this.connections.get(connectionId);
    if (connection && connection.status === 'connected') {
      connection.ws.send(JSON.stringify(message));
    }
  }

  /**
   * 广播消息到房间
   * @param {string} roomId 房间ID
   * @param {Object} message 消息内容
   * @param {string} excludeConnectionId 排除的连接ID
   */
  broadcast(roomId, message, excludeConnectionId = null) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.members.forEach(connectionId => {
        if (connectionId !== excludeConnectionId) {
          this.send(connectionId, message);
        }
      });
    }
  }

  /**
   * 加入房间
   * @param {string} connectionId 连接ID
   * @param {string} roomId 房间ID
   */
  joinRoom(connectionId, roomId) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    // 创建房间（如果不存在）
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        members: new Set(),
        createdAt: Date.now(),
        metadata: {}
      });
    }
    
    const room = this.rooms.get(roomId);
    room.members.add(connectionId);
    connection.rooms.add(roomId);
    
    // 通知房间其他成员
    this.broadcast(roomId, {
      type: 'user_joined',
      connectionId,
      roomId,
      timestamp: Date.now()
    }, connectionId);
  }

  /**
   * 离开房间
   * @param {string} connectionId 连接ID
   * @param {string} roomId 房间ID
   */
  leaveRoom(connectionId, roomId) {
    const connection = this.connections.get(connectionId);
    const room = this.rooms.get(roomId);
    
    if (connection && room) {
      room.members.delete(connectionId);
      connection.rooms.delete(roomId);
      
      // 通知房间其他成员
      this.broadcast(roomId, {
        type: 'user_left',
        connectionId,
        roomId,
        timestamp: Date.now()
      });
      
      // 如果房间为空，删除房间
      if (room.members.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  /**
   * 注册事件处理器
   * @param {string} event 事件名称
   * @param {Function} handler 处理函数
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {any} data 事件数据
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 处理消息
   * @param {string} connectionId 连接ID
   * @param {string} data 消息数据
   */
  handleMessage(connectionId, data) {
    try {
      const message = JSON.parse(data);
      
      // 更新心跳时间
      const connection = this.connections.get(connectionId);
      if (connection) {
        connection.lastHeartbeat = Date.now();
      }
      
      // 处理不同类型的消息
      switch (message.type) {
        case 'heartbeat':
          this.send(connectionId, { type: 'heartbeat_ack' });
          break;
        case 'join_room':
          this.joinRoom(connectionId, message.roomId);
          break;
        case 'leave_room':
          this.leaveRoom(connectionId, message.roomId);
          break;
        default:
          this.emit('message', { connectionId, message });
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * 处理断开连接
   * @param {string} connectionId 连接ID
   * @param {CloseEvent} event 关闭事件
   */
  handleDisconnection(connectionId, event) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    // 从所有房间中移除
    connection.rooms.forEach(roomId => {
      this.leaveRoom(connectionId, roomId);
    });
    
    // 尝试重连
    if (connection.reconnectAttempts < this.options.reconnectAttempts) {
      setTimeout(() => {
        this.reconnect(connectionId);
      }, this.options.reconnectDelay * Math.pow(2, connection.reconnectAttempts));
    } else {
      this.connections.delete(connectionId);
      this.emit('connection_lost', { connectionId });
    }
  }

  /**
   * 重连
   * @param {string} connectionId 连接ID
   */
  async reconnect(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    connection.reconnectAttempts++;
    
    try {
      await this.connect(connection.url);
      connection.reconnectAttempts = 0;
      this.emit('reconnected', { connectionId });
    } catch (error) {
      this.handleDisconnection(connectionId, { code: 1006, reason: 'Reconnection failed' });
    }
  }

  /**
   * 开始心跳检测
   * @param {string} connectionId 连接ID
   */
  startHeartbeat(connectionId) {
    const interval = setInterval(() => {
      const connection = this.connections.get(connectionId);
      if (!connection || connection.status !== 'connected') {
        clearInterval(interval);
        return;
      }
      
      // 检查心跳超时
      if (Date.now() - connection.lastHeartbeat > this.options.heartbeatInterval * 2) {
        connection.ws.close(1000, 'Heartbeat timeout');
        clearInterval(interval);
        return;
      }
      
      // 发送心跳
      this.send(connectionId, { type: 'heartbeat' });
    }, this.options.heartbeatInterval);
  }

  /**
   * 生成连接ID
   * @returns {string} 连接ID
   */
  generateConnectionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

/**
 * 协同编辑器
 */
class CollaborativeEditor {
  constructor(options = {}) {
    this.content = '';
    this.operations = [];
    this.version = 0;
    this.cursors = new Map();
    this.selections = new Map();
    this.eventHandlers = new Map();
    this.options = {
      maxOperations: options.maxOperations || 1000,
      conflictResolution: options.conflictResolution || 'operational-transform'
    };
  }

  /**
   * 应用操作
   * @param {Object} operation 操作对象
   * @param {string} userId 用户ID
   */
  applyOperation(operation, userId) {
    // 验证操作
    if (!this.validateOperation(operation)) {
      throw new Error('Invalid operation');
    }
    
    // 应用操作转换（如果需要）
    const transformedOperation = this.transformOperation(operation);
    
    // 执行操作
    this.executeOperation(transformedOperation);
    
    // 记录操作
    this.operations.push({
      ...transformedOperation,
      userId,
      timestamp: Date.now(),
      version: this.version
    });
    
    // 增加版本号
    this.version++;
    
    // 清理旧操作
    if (this.operations.length > this.options.maxOperations) {
      this.operations = this.operations.slice(-this.options.maxOperations);
    }
    
    // 触发事件
    this.emit('operation_applied', {
      operation: transformedOperation,
      userId,
      content: this.content,
      version: this.version
    });
  }

  /**
   * 执行操作
   * @param {Object} operation 操作对象
   */
  executeOperation(operation) {
    switch (operation.type) {
      case 'insert':
        this.content = 
          this.content.slice(0, operation.position) +
          operation.text +
          this.content.slice(operation.position);
        break;
      
      case 'delete':
        this.content = 
          this.content.slice(0, operation.position) +
          this.content.slice(operation.position + operation.length);
        break;
      
      case 'replace':
        this.content = 
          this.content.slice(0, operation.position) +
          operation.text +
          this.content.slice(operation.position + operation.length);
        break;
    }
  }

  /**
   * 验证操作
   * @param {Object} operation 操作对象
   * @returns {boolean} 是否有效
   */
  validateOperation(operation) {
    if (!operation || typeof operation !== 'object') return false;
    
    const { type, position } = operation;
    
    if (!['insert', 'delete', 'replace'].includes(type)) return false;
    if (typeof position !== 'number' || position < 0 || position > this.content.length) return false;
    
    switch (type) {
      case 'insert':
        return typeof operation.text === 'string';
      case 'delete':
        return typeof operation.length === 'number' && operation.length > 0;
      case 'replace':
        return typeof operation.text === 'string' && typeof operation.length === 'number';
      default:
        return false;
    }
  }

  /**
   * 操作转换
   * @param {Object} operation 操作对象
   * @returns {Object} 转换后的操作
   */
  transformOperation(operation) {
    // 简化的操作转换实现
    // 在实际应用中，这里需要更复杂的冲突解决算法
    const pendingOperations = this.operations.filter(op => op.version > operation.baseVersion);
    
    let transformedOperation = { ...operation };
    
    for (const pendingOp of pendingOperations) {
      transformedOperation = this.transformAgainstOperation(transformedOperation, pendingOp);
    }
    
    return transformedOperation;
  }

  /**
   * 针对单个操作进行转换
   * @param {Object} op1 要转换的操作
   * @param {Object} op2 参考操作
   * @returns {Object} 转换后的操作
   */
  transformAgainstOperation(op1, op2) {
    if (op1.position <= op2.position) {
      return op1;
    }
    
    const transformed = { ...op1 };
    
    switch (op2.type) {
      case 'insert':
        transformed.position += op2.text.length;
        break;
      case 'delete':
        transformed.position -= Math.min(op2.length, op1.position - op2.position);
        break;
      case 'replace':
        transformed.position += op2.text.length - op2.length;
        break;
    }
    
    return transformed;
  }

  /**
   * 更新光标位置
   * @param {string} userId 用户ID
   * @param {number} position 光标位置
   */
  updateCursor(userId, position) {
    this.cursors.set(userId, {
      position,
      timestamp: Date.now()
    });
    
    this.emit('cursor_updated', {
      userId,
      position,
      cursors: Object.fromEntries(this.cursors)
    });
  }

  /**
   * 更新选择区域
   * @param {string} userId 用户ID
   * @param {Object} selection 选择区域
   */
  updateSelection(userId, selection) {
    this.selections.set(userId, {
      ...selection,
      timestamp: Date.now()
    });
    
    this.emit('selection_updated', {
      userId,
      selection,
      selections: Object.fromEntries(this.selections)
    });
  }

  /**
   * 获取当前状态
   * @returns {Object} 当前状态
   */
  getState() {
    return {
      content: this.content,
      version: this.version,
      cursors: Object.fromEntries(this.cursors),
      selections: Object.fromEntries(this.selections),
      operationsCount: this.operations.length
    };
  }

  /**
   * 同步状态
   * @param {Object} state 状态对象
   */
  syncState(state) {
    if (state.version > this.version) {
      this.content = state.content;
      this.version = state.version;
      
      if (state.cursors) {
        this.cursors = new Map(Object.entries(state.cursors));
      }
      
      if (state.selections) {
        this.selections = new Map(Object.entries(state.selections));
      }
      
      this.emit('state_synced', state);
    }
  }

  /**
   * 注册事件处理器
   * @param {string} event 事件名称
   * @param {Function} handler 处理函数
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * 移除事件处理器
   * @param {string} event 事件名称
   * @param {Function} handler 处理函数
   */
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {any} data 事件数据
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 清理资源
   */
  destroy() {
    this.eventHandlers.clear();
    this.cursors.clear();
    this.selections.clear();
    this.operations = [];
  }
}

/**
 * 状态同步管理器
 */
class StateSyncManager {
  constructor(options = {}) {
    this.state = new Map();
    this.subscribers = new Map();
    this.options = {
      syncInterval: options.syncInterval || 1000,
      maxStateHistory: options.maxStateHistory || 100
    };
    this.syncTimer = null;
  }

  /**
   * 设置状态
   * @param {string} key 状态键
   * @param {any} value 状态值
   * @param {string} userId 用户ID
   */
  setState(key, value, userId) {
    const previousValue = this.state.get(key);
    
    this.state.set(key, {
      value,
      userId,
      timestamp: Date.now(),
      version: (previousValue?.version || 0) + 1
    });
    
    this.notifySubscribers(key, value, userId);
  }

  /**
   * 获取状态
   * @param {string} key 状态键
   * @returns {any} 状态值
   */
  getState(key) {
    const state = this.state.get(key);
    return state ? state.value : undefined;
  }

  /**
   * 订阅状态变化
   * @param {string} key 状态键
   * @param {Function} callback 回调函数
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);
  }

  /**
   * 取消订阅
   * @param {string} key 状态键
   * @param {Function} callback 回调函数
   */
  unsubscribe(key, callback) {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 通知订阅者
   * @param {string} key 状态键
   * @param {any} value 状态值
   * @param {string} userId 用户ID
   */
  notifySubscribers(key, value, userId) {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value, userId, key);
        } catch (error) {
          console.error('Error in state subscriber:', error);
        }
      });
    }
  }

  /**
   * 开始自动同步
   */
  startAutoSync() {
    if (this.syncTimer) return;
    
    this.syncTimer = setInterval(() => {
      this.syncStates();
    }, this.options.syncInterval);
  }

  /**
   * 停止自动同步
   */
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * 同步状态
   */
  syncStates() {
    // 这里可以实现与服务器的状态同步逻辑
    // 例如发送状态到服务器或从服务器获取最新状态
  }

  /**
   * 清理资源
   */
  destroy() {
    this.stopAutoSync();
    this.state.clear();
    this.subscribers.clear();
  }
}

// 导出模块
const collaborationUtils = {
  RealtimeManager,
  CollaborativeEditor,
  StateSyncManager,
  
  /**
   * 创建实时管理器实例
   * @param {Object} options 配置选项
   * @returns {RealtimeManager} 实时管理器实例
   */
  createRealtimeManager(options) {
    return new RealtimeManager(options);
  },
  
  /**
   * 创建协同编辑器实例
   * @param {Object} options 配置选项
   * @returns {CollaborativeEditor} 协同编辑器实例
   */
  createCollaborativeEditor(options) {
    return new CollaborativeEditor(options);
  },
  
  /**
   * 创建状态同步管理器实例
   * @param {Object} options 配置选项
   * @returns {StateSyncManager} 状态同步管理器实例
   */
  createStateSyncManager(options) {
    return new StateSyncManager(options);
  }
};

export default collaborationUtils;