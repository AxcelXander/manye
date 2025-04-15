/**
 * 慢野自驾游地图工具函数
 * 统一管理高德地图API的调用和通用功能
 */

// 高德地图API密钥
const AMAP_KEY = '90e1c6ecd1322b3d3fc32afadd55d714'; // 慢野自驾网站JS API密钥

// 设置安全密钥
if (!window._AMapSecurityConfig) {
    window._AMapSecurityConfig = {
        securityJsCode: '6512b470a154fdfc777257a088527d63'
    };
}

/**
 * 加载高德地图API脚本
 * @param {string} plugins - 需要加载的插件列表，逗号分隔
 * @param {Function} callback - 加载完成后的回调函数
 */
function loadAmapScript(plugins, callback) {
    console.log('loadAmapScript called with plugins:', plugins);
    
    // 如果AMap已经加载，直接调用回调
    if (window.AMap) {
        console.log('AMap already loaded, calling callback directly');
        callback && callback();
        return;
    }

    console.log('Creating AMap script with key:', AMAP_KEY);
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=${plugins}`;
    script.async = true;
    
    // 添加超时处理
    const timeoutId = setTimeout(function() {
        console.error('AMap script load timeout');
        if (callback) {
            callback(new Error('地图API加载超时'));
        }
    }, 10000); // 10秒超时
    
    // 设置加载成功回调
    script.onload = function() {
        clearTimeout(timeoutId);
        console.log('AMap script loaded successfully');
        if (window.AMap) {
            console.log('AMap object exists, calling callback');
            callback && callback();
        } else {
            console.error('AMap script loaded but AMap object not found');
            callback && callback(new Error('地图API加载失败：AMap对象不存在'));
        }
    };
    
    // 设置加载失败回调
    script.onerror = function(e) {
        clearTimeout(timeoutId);
        const errorMsg = 'AMap script failed to load';
        console.error(errorMsg, e);
        if (callback) {
            callback(new Error('地图API加载失败：网络错误'));
        }
    };
    
    document.body.appendChild(script);
    console.log('AMap script added to document body');
}

/**
 * 创建标准地图实例
 * @param {string} containerId - 地图容器ID
 * @param {Object} options - 地图选项
 * @returns {Promise<AMap.Map>} 创建的地图实例
 */
function createMap(containerId, options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            resizeEnable: true,
            zoom: 6,
            center: [104.066801, 30.572961], // 默认中心点（成都）
            mapStyle: 'amap://styles/normal',
            viewMode: '3D'
        };

        const container = document.getElementById(containerId);
        if (!container) {
            reject(new Error(`地图容器 ${containerId} 不存在`));
            return;
        }

        try {
            const map = new AMap.Map(containerId, { ...defaultOptions, ...options });
            
            // 添加标准控件
            map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.Geolocation'], function() {
                map.addControl(new AMap.ToolBar({ position: 'RB' }));
                map.addControl(new AMap.Scale());
                map.addControl(new AMap.MapType({ defaultType: 0 }));
                map.addControl(new AMap.Geolocation({
                    position: 'RB',
                    offset: [10, 70]
                }));
            });
            
            resolve(map);
        } catch (error) {
            console.error('地图初始化失败:', error);
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <i class="fas fa-exclamation-circle" style="font-size: 32px; color: #ff7e67; margin-bottom: 10px;"></i>
                    <p>地图加载失败，请刷新页面重试</p>
                </div>
            `;
            reject(error);
        }
    });
}

/**
 * 创建标记并添加到地图
 * @param {AMap.Map} map - 地图实例
 * @param {Array} position - 标记位置 [lng, lat]
 * @param {string} title - 标记标题
 * @param {Object} options - 标记选项
 * @returns {AMap.Marker} 创建的标记实例
 */
function createMarker(map, position, title, options = {}) {
    const marker = new AMap.Marker({
        position,
        title,
        ...options
    });
    
    marker.setMap(map);
    return marker;
}

/**
 * 创建信息窗体
 * @param {string} content - 信息窗体内容
 * @param {Object} options - 信息窗体选项
 * @returns {AMap.InfoWindow} 创建的信息窗体实例
 */
function createInfoWindow(content, options = {}) {
    return new AMap.InfoWindow({
        content,
        offset: new AMap.Pixel(0, -30),
        ...options
    });
}

/**
 * 规划驾车路线
 * @param {AMap.Map} map - 地图实例
 * @param {Array} start - 起点位置 [lng, lat]
 * @param {Array} end - 终点位置 [lng, lat]
 * @param {Array} waypoints - 途经点位置数组 [[lng, lat], [lng, lat], ...]
 * @param {Function} callback - 规划完成后的回调函数
 */
function planRoute(map, start, end, waypoints = [], callback) {
    AMap.plugin('AMap.Driving', function() {
        // 确保先清除之前可能存在的路线
        if (window.drivingInstance && typeof window.drivingInstance.clear === 'function') {
            window.drivingInstance.clear();
        }
        
        // 创建新的驾车规划实例
        const driving = new AMap.Driving({
            map: map,
            policy: AMap.DrivingPolicy.LEAST_TIME,
            autoFitView: true
        });
        
        // 保存实例以便后续操作
        window.drivingInstance = driving;
        
        // 搜索路线
        driving.search(start, end, { waypoints }, function(status, result) {
            if (status === 'complete') {
                if (result.routes && result.routes.length) {
                    try {
                        // 清除之前可能已有的路线
                        driving.clear();
                        // 绘制新路线
                        driving.drawRoute(result.routes[0]);
                        // 调整地图视野以适应路线
                        map.setFitView();
                        if (callback) callback(null, result);
                    } catch (error) {
                        console.error('路线绘制失败:', error);
                        if (callback) callback(new Error('路线绘制失败: ' + error.message), null);
                    }
                } else {
                    console.error('路线规划成功但没有找到路线');
                    if (callback) callback(new Error('未找到合适的路线'), null);
                }
            } else {
                console.error('路线规划失败:', result);
                if (callback) callback(new Error('路线规划失败: ' + status), null);
            }
        });
    });
}

/**
 * 计算两点之间的距离（单位：公里）
 * @param {Array} point1 - 第一个点的坐标 [lng, lat]
 * @param {Array} point2 - 第二个点的坐标 [lng, lat]
 * @returns {number} 距离（公里）
 */
function calculateDistance(point1, point2) {
    const distance = AMap.GeometryUtil.distance(point1, point2);
    return parseFloat((distance / 1000).toFixed(1));
}

// 导出工具函数
window.MapUtils = {
    AMAP_KEY,
    loadAmapScript,
    createMap,
    createMarker,
    createInfoWindow,
    planRoute,
    calculateDistance
}; 