/**
 * WebRTC 通信工具模块
 * 提供点对点通信、音视频通话、数据传输等功能
 */

/**
 * WebRTC 连接管理器
 */
class WebRTCManager {
  constructor(options = {}) {
    this.connections = new Map();
    this.localStream = null;
    this.eventHandlers = new Map();
    this.options = {
      iceServers: options.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ],
      dataChannelOptions: options.dataChannelOptions || {
        ordered: true
      },
      mediaConstraints: options.mediaConstraints || {
        video: true,
        audio: true
      }
    };
  }

  /**
   * 初始化本地媒体流
   * @param {Object} constraints 媒体约束
   * @returns {Promise<MediaStream>} 本地媒体流
   */
  async initLocalStream(constraints = this.options.mediaConstraints) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.emit('local_stream_ready', this.localStream);
      return this.localStream;
    } catch (error) {
      this.emit('error', { type: 'media_access_denied', error });
      throw error;
    }
  }

  /**
   * 创建点对点连接
   * @param {string} peerId 对等方ID
   * @param {Object} options 连接选项
   * @returns {RTCPeerConnection} 点对点连接
   */
  createPeerConnection(peerId, options = {}) {
    const config = {
      iceServers: this.options.iceServers,
      ...options
    };
    
    const pc = new RTCPeerConnection(config);
    
    const connection = {
      id: peerId,
      pc,
      dataChannels: new Map(),
      status: 'connecting',
      createdAt: Date.now()
    };
    
    // 设置事件监听器
    this.setupPeerConnectionEvents(connection);
    
    // 添加本地流（如果存在）
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }
    
    this.connections.set(peerId, connection);
    return pc;
  }

  /**
   * 设置点对点连接事件
   * @param {Object} connection 连接对象
   */
  setupPeerConnectionEvents(connection) {
    const { pc, id } = connection;
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('ice_candidate', {
          peerId: id,
          candidate: event.candidate
        });
      }
    };
    
    pc.ontrack = (event) => {
      this.emit('remote_stream', {
        peerId: id,
        stream: event.streams[0]
      });
    };
    
    pc.onconnectionstatechange = () => {
      connection.status = pc.connectionState;
      this.emit('connection_state_change', {
        peerId: id,
        state: pc.connectionState
      });
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        this.handleConnectionFailure(id);
      }
    };
    
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      this.setupDataChannelEvents(id, channel);
    };
  }

  /**
   * 创建数据通道
   * @param {string} peerId 对等方ID
   * @param {string} label 通道标签
   * @param {Object} options 通道选项
   * @returns {RTCDataChannel} 数据通道
   */
  createDataChannel(peerId, label, options = {}) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    const channelOptions = {
      ...this.options.dataChannelOptions,
      ...options
    };
    
    const channel = connection.pc.createDataChannel(label, channelOptions);
    this.setupDataChannelEvents(peerId, channel);
    
    connection.dataChannels.set(label, channel);
    return channel;
  }

  /**
   * 设置数据通道事件
   * @param {string} peerId 对等方ID
   * @param {RTCDataChannel} channel 数据通道
   */
  setupDataChannelEvents(peerId, channel) {
    channel.onopen = () => {
      this.emit('data_channel_open', {
        peerId,
        label: channel.label
      });
    };
    
    channel.onmessage = (event) => {
      this.emit('data_channel_message', {
        peerId,
        label: channel.label,
        data: event.data
      });
    };
    
    channel.onclose = () => {
      this.emit('data_channel_close', {
        peerId,
        label: channel.label
      });
    };
    
    channel.onerror = (error) => {
      this.emit('data_channel_error', {
        peerId,
        label: channel.label,
        error
      });
    };
  }

  /**
   * 创建 Offer
   * @param {string} peerId 对等方ID
   * @returns {Promise<RTCSessionDescription>} Offer 描述
   */
  async createOffer(peerId) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    const offer = await connection.pc.createOffer();
    await connection.pc.setLocalDescription(offer);
    
    this.emit('offer_created', {
      peerId,
      offer
    });
    
    return offer;
  }

  /**
   * 创建 Answer
   * @param {string} peerId 对等方ID
   * @returns {Promise<RTCSessionDescription>} Answer 描述
   */
  async createAnswer(peerId) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    const answer = await connection.pc.createAnswer();
    await connection.pc.setLocalDescription(answer);
    
    this.emit('answer_created', {
      peerId,
      answer
    });
    
    return answer;
  }

  /**
   * 设置远程描述
   * @param {string} peerId 对等方ID
   * @param {RTCSessionDescription} description 远程描述
   */
  async setRemoteDescription(peerId, description) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    await connection.pc.setRemoteDescription(description);
  }

  /**
   * 添加 ICE 候选
   * @param {string} peerId 对等方ID
   * @param {RTCIceCandidate} candidate ICE 候选
   */
  async addIceCandidate(peerId, candidate) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    await connection.pc.addIceCandidate(candidate);
  }

  /**
   * 发送数据
   * @param {string} peerId 对等方ID
   * @param {string} channelLabel 通道标签
   * @param {any} data 数据
   */
  sendData(peerId, channelLabel, data) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    const channel = connection.dataChannels.get(channelLabel);
    if (!channel || channel.readyState !== 'open') {
      throw new Error(`Data channel '${channelLabel}' is not open`);
    }
    
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    channel.send(message);
  }

  /**
   * 处理连接失败
   * @param {string} peerId 对等方ID
   */
  handleConnectionFailure(peerId) {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.pc.close();
      this.connections.delete(peerId);
      this.emit('connection_failed', { peerId });
    }
  }

  /**
   * 关闭连接
   * @param {string} peerId 对等方ID
   */
  closeConnection(peerId) {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.pc.close();
      this.connections.delete(peerId);
      this.emit('connection_closed', { peerId });
    }
  }

  /**
   * 获取连接统计信息
   * @param {string} peerId 对等方ID
   * @returns {Promise<RTCStatsReport>} 统计信息
   */
  async getConnectionStats(peerId) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    return await connection.pc.getStats();
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
   * 清理资源
   */
  destroy() {
    // 关闭所有连接
    this.connections.forEach((connection, peerId) => {
      this.closeConnection(peerId);
    });
    
    // 停止本地流
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.eventHandlers.clear();
  }
}

/**
 * 屏幕共享管理器
 */
class ScreenShareManager {
  constructor() {
    this.screenStream = null;
    this.eventHandlers = new Map();
  }

  /**
   * 开始屏幕共享
   * @param {Object} options 共享选项
   * @returns {Promise<MediaStream>} 屏幕流
   */
  async startScreenShare(options = {}) {
    try {
      const constraints = {
        video: {
          mediaSource: 'screen',
          ...options.video
        },
        audio: options.audio || false
      };
      
      this.screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      // 监听屏幕共享结束
      this.screenStream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare();
      };
      
      this.emit('screen_share_started', this.screenStream);
      return this.screenStream;
    } catch (error) {
      this.emit('screen_share_error', error);
      throw error;
    }
  }

  /**
   * 停止屏幕共享
   */
  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
      this.emit('screen_share_stopped');
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
}

// 导出模块
const webrtcUtils = {
  WebRTCManager,
  ScreenShareManager,
  
  /**
   * 创建 WebRTC 管理器实例
   * @param {Object} options 配置选项
   * @returns {WebRTCManager} WebRTC 管理器实例
   */
  createWebRTCManager(options) {
    return new WebRTCManager(options);
  },
  
  /**
   * 创建屏幕共享管理器实例
   * @returns {ScreenShareManager} 屏幕共享管理器实例
   */
  createScreenShareManager() {
    return new ScreenShareManager();
  },
  
  /**
   * 检查 WebRTC 支持
   * @returns {Object} 支持情况
   */
  checkWebRTCSupport() {
    return {
      webrtc: !!window.RTCPeerConnection,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      getDisplayMedia: !!navigator.mediaDevices?.getDisplayMedia,
      dataChannel: !!window.RTCDataChannel
    };
  }
};

export default webrtcUtils;