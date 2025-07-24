// 地理位置工具模块
export default {
    title: '地理位置工具',
    icon: 'fas fa-map-marker-alt',
    methods: {
        getCurrentPosition: {
            name: 'getCurrentPosition',
            description: '获取当前地理位置',
            params: [
                { name: 'options', type: 'object', required: false, description: '位置获取选项' }
            ],
            examples: {
                js: `// 获取当前位置\ngetCurrentPosition()\n  .then(position => {\n    console.log('纬度:', position.latitude);\n    console.log('经度:', position.longitude);\n    console.log('精度:', position.accuracy);\n  })\n  .catch(error => {\n    console.error('获取位置失败:', error);\n  });\n\n// 带选项的位置获取\ngetCurrentPosition({\n  enableHighAccuracy: true,\n  timeout: 10000,\n  maximumAge: 60000\n});`,
                ts: `import { getCurrentPosition } from 'general-method-utils';\n\ninterface Position {\n  latitude: number;\n  longitude: number;\n  accuracy: number;\n  altitude?: number;\n  heading?: number;\n  speed?: number;\n}\n\ngetCurrentPosition()\n  .then((position: Position) => {\n    console.log('纬度:', position.latitude);\n    console.log('经度:', position.longitude);\n  });`
            },
            demo: true
        },
        calculateDistance: {
            name: 'calculateDistance',
            description: '计算两个地理坐标之间的距离',
            params: [
                { name: 'lat1', type: 'number', required: true, description: '第一个点的纬度' },
                { name: 'lon1', type: 'number', required: true, description: '第一个点的经度' },
                { name: 'lat2', type: 'number', required: true, description: '第二个点的纬度' },
                { name: 'lon2', type: 'number', required: true, description: '第二个点的经度' },
                { name: 'unit', type: 'string', required: false, description: '距离单位：km、mi、m' }
            ],
            examples: {
                js: `// 计算两点距离（公里）\nconst distance = calculateDistance(\n  39.9042, 116.4074, // 北京\n  31.2304, 121.4737  // 上海\n);\nconsole.log(\`距离: \${distance.toFixed(2)} 公里\`);\n\n// 计算距离（米）\nconst distanceInMeters = calculateDistance(\n  39.9042, 116.4074,\n  39.9142, 116.4174,\n  'm'\n);\n\n// 查找附近的地点\nconst nearbyPlaces = places.filter(place => {\n  const dist = calculateDistance(userLat, userLon, place.lat, place.lon);\n  return dist <= 5; // 5公里内\n});`,
                ts: `import { calculateDistance } from 'general-method-utils';\n\nconst distance: number = calculateDistance(\n  39.9042, 116.4074,\n  31.2304, 121.4737\n);\n\nconst distanceInMeters: number = calculateDistance(\n  39.9042, 116.4074,\n  39.9142, 116.4174,\n  'm'\n);`
            },
            demo: true
        },
        isPointInRadius: {
            name: 'isPointInRadius',
            description: '检查点是否在指定半径范围内',
            params: [
                { name: 'centerLat', type: 'number', required: true, description: '中心点纬度' },
                { name: 'centerLon', type: 'number', required: true, description: '中心点经度' },
                { name: 'pointLat', type: 'number', required: true, description: '检查点纬度' },
                { name: 'pointLon', type: 'number', required: true, description: '检查点经度' },
                { name: 'radius', type: 'number', required: true, description: '半径（公里）' }
            ],
            examples: {
                js: `// 检查是否在范围内\nconst inRange = isPointInRadius(\n  39.9042, 116.4074, // 中心点（北京）\n  39.9142, 116.4174, // 检查点\n  10 // 10公里半径\n);\nconsole.log(inRange); // true 或 false\n\n// 地理围栏检查\nfunction checkGeofence(userLat, userLon) {\n  const homeLocation = { lat: 39.9042, lon: 116.4074 };\n  const isAtHome = isPointInRadius(\n    homeLocation.lat, homeLocation.lon,\n    userLat, userLon,\n    0.5 // 500米范围\n  );\n  \n  if (isAtHome) {\n    console.log('用户在家');\n  }\n}`,
                ts: `import { isPointInRadius } from 'general-method-utils';\n\nconst inRange: boolean = isPointInRadius(\n  39.9042, 116.4074,\n  39.9142, 116.4174,\n  10\n);\n\nfunction checkGeofence(userLat: number, userLon: number): void {\n  const isAtHome = isPointInRadius(\n    39.9042, 116.4074,\n    userLat, userLon,\n    0.5\n  );\n}`
            },
            demo: true
        },
        formatCoordinates: {
            name: 'formatCoordinates',
            description: '格式化地理坐标显示',
            params: [
                { name: 'latitude', type: 'number', required: true, description: '纬度' },
                { name: 'longitude', type: 'number', required: true, description: '经度' },
                { name: 'format', type: 'string', required: false, description: '格式类型：decimal、dms、dm' }
            ],
            examples: {
                js: `// 格式化坐标\nconst lat = 39.9042;\nconst lon = 116.4074;\n\n// 十进制格式（默认）\nconst decimal = formatCoordinates(lat, lon);\nconsole.log(decimal); // '39.9042°N, 116.4074°E'\n\n// 度分秒格式\nconst dms = formatCoordinates(lat, lon, 'dms');\nconsole.log(dms); // '39°54\'15\"N, 116°24\'27\"E'\n\n// 度分格式\nconst dm = formatCoordinates(lat, lon, 'dm');\nconsole.log(dm); // '39°54.25\'N, 116°24.44\'E'`,
                ts: `import { formatCoordinates } from 'general-method-utils';\n\nconst lat: number = 39.9042;\nconst lon: number = 116.4074;\n\nconst decimal: string = formatCoordinates(lat, lon);\nconst dms: string = formatCoordinates(lat, lon, 'dms');\nconst dm: string = formatCoordinates(lat, lon, 'dm');`
            },
            demo: true
        },
        getLocationInfo: {
            name: 'getLocationInfo',
            description: '根据坐标获取位置信息（反向地理编码）',
            params: [
                { name: 'latitude', type: 'number', required: true, description: '纬度' },
                { name: 'longitude', type: 'number', required: true, description: '经度' },
                { name: 'apiKey', type: 'string', required: false, description: 'API密钥' }
            ],
            examples: {
                js: `// 获取位置信息\ngetLocationInfo(39.9042, 116.4074)\n  .then(info => {\n    console.log('国家:', info.country);\n    console.log('城市:', info.city);\n    console.log('地址:', info.address);\n  })\n  .catch(error => {\n    console.error('获取位置信息失败:', error);\n  });\n\n// 显示当前位置\ngetCurrentPosition()\n  .then(position => {\n    return getLocationInfo(position.latitude, position.longitude);\n  })\n  .then(info => {\n    document.getElementById('location').textContent = info.address;\n  });`,
                ts: `import { getLocationInfo } from 'general-method-utils';\n\ninterface LocationInfo {\n  country: string;\n  city: string;\n  address: string;\n  postalCode?: string;\n}\n\ngetLocationInfo(39.9042, 116.4074)\n  .then((info: LocationInfo) => {\n    console.log('国家:', info.country);\n    console.log('城市:', info.city);\n  });`
            },
            demo: true
        },
        watchPosition: {
            name: 'watchPosition',
            description: '持续监听位置变化',
            params: [
                { name: 'callback', type: 'function', required: true, description: '位置变化回调函数' },
                { name: 'options', type: 'object', required: false, description: '监听选项' }
            ],
            examples: {
                js: `// 监听位置变化\nconst watchId = watchPosition((position) => {\n  console.log('新位置:', position.latitude, position.longitude);\n  updateMapMarker(position);\n}, {\n  enableHighAccuracy: true,\n  timeout: 5000,\n  maximumAge: 1000\n});\n\n// 停止监听\nfunction stopWatching() {\n  navigator.geolocation.clearWatch(watchId);\n}\n\n// 实时跟踪示例\nlet currentPath = [];\nwatchPosition((position) => {\n  currentPath.push({\n    lat: position.latitude,\n    lon: position.longitude,\n    timestamp: Date.now()\n  });\n  drawPath(currentPath);\n});`,
                ts: `import { watchPosition } from 'general-method-utils';\n\nconst watchId: number = watchPosition((position: Position) => {\n  console.log('新位置:', position.latitude, position.longitude);\n  updateMapMarker(position);\n}, {\n  enableHighAccuracy: true,\n  timeout: 5000\n});\n\nfunction stopWatching(): void {\n  navigator.geolocation.clearWatch(watchId);\n}`
            },
            demo: true
        }
    }
};