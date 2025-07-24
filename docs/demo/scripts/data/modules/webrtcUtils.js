// WebRTC 通信工具模块
export default {
    title: 'WebRTC 通信工具',
    icon: 'fas fa-video',
    methods: {
        createConnection: {
            name: 'createConnection',
            description: '创建 WebRTC 连接，支持音视频通话',
            params: [
                { name: 'options', type: 'WebRTCOptions', required: false, description: 'WebRTC 配置选项' }
            ],
            examples: {
                js: `// 创建 WebRTC 连接\nconst rtc = await webrtcUtils.createConnection({\n  iceServers: [\n    { urls: 'stun:stun.l.google.com:19302' }\n  ],\n  video: true,\n  audio: true\n});\n\n// 获取本地视频流\nconst localVideo = document.getElementById('localVideo');\nlocalVideo.srcObject = rtc.localStream;\n\n// 处理远程视频流\nrtc.onRemoteStream = (stream) => {\n  const remoteVideo = document.getElementById('remoteVideo');\n  remoteVideo.srcObject = stream;\n};`,
                ts: `import { webrtcUtils, WebRTCOptions } from 'general-method-utils';\n\n// 创建 WebRTC 连接\nconst options: WebRTCOptions = {\n  iceServers: [\n    { urls: 'stun:stun.l.google.com:19302' }\n  ],\n  video: true,\n  audio: true\n};\n\nconst rtc = await webrtcUtils.createConnection(options);`
            },
            demo: true
        },
        startScreenShare: {
            name: 'startScreenShare',
            description: '开始屏幕共享',
            params: [
                { name: 'options', type: 'ScreenShareOptions', required: false, description: '屏幕共享选项' }
            ],
            examples: {
                js: `// 开始屏幕共享\nconst screenShare = await webrtcUtils.startScreenShare({\n  video: true,\n  audio: true,\n  onStream: (stream) => {\n    const screenVideo = document.getElementById('screenVideo');\n    screenVideo.srcObject = stream;\n  },\n  onEnd: () => {\n    console.log('屏幕共享已结束');\n  }\n});\n\n// 停止屏幕共享\nscreenShare.stop();`,
                ts: `import { webrtcUtils, ScreenShareOptions } from 'general-method-utils';\n\n// 开始屏幕共享\nconst options: ScreenShareOptions = {\n  video: true,\n  audio: true,\n  onStream: (stream: MediaStream) => {\n    const screenVideo = document.getElementById('screenVideo') as HTMLVideoElement;\n    screenVideo.srcObject = stream;\n  }\n};\n\nconst screenShare = await webrtcUtils.startScreenShare(options);`
            },
            demo: true
        }
    }
};