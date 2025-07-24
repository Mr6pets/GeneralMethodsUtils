/**
 * WebRTC 通信工具模块
 * 提供点对点通信、音视频通话、数据传输等功能
 */

import {
  WebRTCOptions,
  WebRTCConnection,
  WebRTCMessage,
  ScreenShareOptions,
  WebRTCStats
} from '../types';

/**
 * WebRTC 连接管理器
 */
export class WebRTCManager {
  private connections = new Map<string, WebRTCConnection>();
  private localStream: MediaStream | null = null;
  private eventHandlers = new Map<string, Function[]>();
  private options: Required<WebRTCOptions>;

  constructor(options: WebRTCOptions = {}) {
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
   */
  async initLocalStream(constraints: MediaStreamConstraints = this.options.mediaConstraints): Promise<MediaStream> {
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
   */
  createPeerConnection(peerId: string, options: RTCConfiguration = {}): RTCPeerConnection {
    const config: RTCConfiguration = {
      iceServers: this.options.iceServers,
      ...options
    };
    
    const pc = new RTCPeerConnection(config);
    
    const connection: WebRTCConnection = {
      id: peerId,
      pc,
      dataChannels: new Map(),
      status: 'connecting',
      createdAt: Date.now()
    };
    
    this.setupPeerConnectionEvents(connection);
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }
    
    this.connections.set(peerId, connection);
    return pc;
  }

  /**
   * 设置点对点连接事件
   */
  private setupPeerConnectionEvents(connection: WebRTCConnection): void {
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
      connection.status = pc.connectionState as any;
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
   */
  createDataChannel(peerId: string, label: string, options: RTCDataChannelInit = {}): RTCDataChannel {
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
   */
  private setupDataChannelEvents(peerId: string, channel: RTCDataChannel): void {
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
   */
  async createOffer(peerId: string): Promise<RTCSessionDescription> {
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
   */
  async createAnswer(peerId: string): Promise<RTCSessionDescription> {
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
   */
  async setRemoteDescription(peerId: string, description: RTCSessionDescriptionInit): Promise<void> {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    await connection.pc.setRemoteDescription(description);
  }

  /**
   * 添加 ICE 候选
   */
  async addIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    await connection.pc.addIceCandidate(candidate);
  }

  /**
   * 发送数据
   */
  sendData(peerId: string, channelLabel: string, data: any): void {
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
   */
  private handleConnectionFailure(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.pc.close();
      this.connections.delete(peerId);
      this.emit('connection_failed', { peerId });
    }
  }

  /**
   * 关闭连接
   */
  closeConnection(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.pc.close();
      this.connections.delete(peerId);
      this.emit('connection_closed', { peerId });
    }
  }

  /**
   * 获取连接统计信息
   */
  async getConnectionStats(peerId: string): Promise<RTCStatsReport> {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error(`No connection found for peer: ${peerId}`);
    }
    
    return await connection.pc.getStats();
  }

  /**
   * 注册事件处理器
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.connections.forEach((connection, peerId) => {
      this.closeConnection(peerId);
    });
    
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
export class ScreenShareManager {
  private screenStream: MediaStream | null = null;
  private eventHandlers = new Map<string, Function[]>();

  /**
   * 开始屏幕共享
   */
  async startScreenShare(options: ScreenShareOptions = {}): Promise<MediaStream> {
    try {
      const constraints: DisplayMediaStreamConstraints = {
        video: {
          mediaSource: 'screen' as any,
          ...options.video
        },
        audio: options.audio || false
      };
      
      this.screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
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
  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
      this.emit('screen_share_stopped');
    }
  }

  /**
   * 注册事件处理器
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * 触发事件
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// 工具函数
export const webrtcUtils = {
  WebRTCManager,
  ScreenShareManager,
  
  /**
   * 创建 WebRTC 管理器实例
   */
  createWebRTCManager(options?: WebRTCOptions): WebRTCManager {
    return new WebRTCManager(options);
  },
  
  /**
   * 创建屏幕共享管理器实例
   */
  createScreenShareManager(): ScreenShareManager {
    return new ScreenShareManager();
  },
  
  /**
   * 检查 WebRTC 支持
   */
  checkWebRTCSupport(): Record<string, boolean> {
    return {
      webrtc: !!window.RTCPeerConnection,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      getDisplayMedia: !!navigator.mediaDevices?.getDisplayMedia,
      dataChannel: !!window.RTCDataChannel
    };
  }
};

export default webrtcUtils;