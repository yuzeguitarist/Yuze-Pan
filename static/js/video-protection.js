/**
 * 视频保护系统 - 双重防护方案
 * 防止YouTube嵌入视频结束后的推荐视频导致用户离开本站
 */

(function() {
    // 等待页面完全加载
    document.addEventListener('DOMContentLoaded', function() {
        // 仅在视频页面执行
        if (!document.querySelector('.video-wrapper')) return;
        
        // ===== 方案一: 网络请求拦截系统 =====
        
        // 拦截并阻止特定的YouTube API请求,防止推荐视频加载
        function setupNetworkInterception() {
            // 需要拦截的API请求URL列表 (部分匹配即可)
            const blockedEndpoints = [
                '/api/stats/watchtime',
                '/api/stats/qoe',
                '/get_endscreen',
                '/get_midroll_info',
                '/related_video',
                '/get_video_metadata'
            ];
            
            // 存储原始的fetch方法
            const originalFetch = window.fetch;
            
            // 重写fetch方法
            window.fetch = function(resource, init) {
                // 检查URL是否包含需要拦截的端点
                const url = resource.url || resource;
                const shouldBlock = blockedEndpoints.some(endpoint => 
                    typeof url === 'string' && url.includes(endpoint)
                );
                
                // 如果是需要拦截的请求,返回一个模拟的响应
                if (shouldBlock) {
                    console.log('已拦截请求:', url);
                    return Promise.resolve(new Response(null, {
                        status: 404,
                        statusText: 'Not Found',
                        headers: { 'Content-Type': 'text/plain' }
                    }));
                }
                
                // 不需要拦截的请求正常进行
                return originalFetch.apply(this, arguments);
            };
            
            // 存储原始的XMLHttpRequest open方法
            const originalOpen = XMLHttpRequest.prototype.open;
            
            // 重写XMLHttpRequest的open方法
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                // 检查URL是否包含需要拦截的端点
                this._url = url;
                this._shouldBlock = blockedEndpoints.some(endpoint => 
                    typeof url === 'string' && url.includes(endpoint)
                );
                
                // 调用原始方法
                return originalOpen.apply(this, arguments);
            };
            
            // 存储原始的XMLHttpRequest send方法
            const originalSend = XMLHttpRequest.prototype.send;
            
            // 重写XMLHttpRequest的send方法
            XMLHttpRequest.prototype.send = function(body) {
                // 如果需要拦截请求
                if (this._shouldBlock) {
                    console.log('已拦截XHR请求:', this._url);
                    
                    // 模拟请求完成,但返回404状态
                    this.onreadystatechange && setTimeout(() => {
                        Object.defineProperty(this, 'readyState', { value: 4 });
                        Object.defineProperty(this, 'status', { value: 404 });
                        Object.defineProperty(this, 'statusText', { value: 'Not Found' });
                        Object.defineProperty(this, 'response', { value: null });
                        Object.defineProperty(this, 'responseText', { value: '' });
                        this.onreadystatechange();
                    }, 10);
                    
                    // 触发load事件
                    this.onload && setTimeout(() => {
                        const event = new Event('load');
                        this.onload(event);
                    }, 20);
                    
                    return;
                }
                
                // 不需要拦截的请求正常发送
                return originalSend.apply(this, arguments);
            };
            
            // 处理可能已经通过iframe加载的YouTube视频
            setupIframeRequestBlocker();
        }
        
        // 尝试拦截iframe内的请求 (通过向iframe注入代码)
        function setupIframeRequestBlocker() {
            const videoIframe = document.querySelector('.video-wrapper iframe');
            if (!videoIframe) return;
            
            try {
                // 尝试向iframe注入代码,由于跨域限制可能会失败
                videoIframe.addEventListener('load', function() {
                    try {
                        const iframeWindow = videoIframe.contentWindow;
                        const iframeDocument = iframeWindow.document;
                        
                        // 向iframe注入拦截脚本
                        const script = iframeDocument.createElement('script');
                        script.textContent = `
                            (function() {
                                // 存储原始的fetch方法
                                const originalFetch = window.fetch;
                                
                                // 重写fetch方法
                                window.fetch = function(resource, init) {
                                    const url = resource.url || resource;
                                    // 检查URL是否包含特定的API请求
                                    if (typeof url === 'string' && 
                                        (url.includes('/api/stats/watchtime') || 
                                         url.includes('/api/stats/qoe') ||
                                         url.includes('/get_endscreen'))) {
                                        console.log('Iframe内部拦截请求:', url);
                                        return Promise.resolve(new Response(null, {
                                            status: 404,
                                            statusText: 'Not Found'
                                        }));
                                    }
                                    
                                    // 正常请求
                                    return originalFetch.apply(this, arguments);
                                };
                                
                                // 拦截XMLHttpRequest
                                const originalOpen = XMLHttpRequest.prototype.open;
                                XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                                    this._url = url;
                                    this._shouldBlock = typeof url === 'string' && 
                                        (url.includes('/api/stats/watchtime') || 
                                         url.includes('/api/stats/qoe') ||
                                         url.includes('/get_endscreen'));
                                    
                                    return originalOpen.apply(this, arguments);
                                };
                                
                                const originalSend = XMLHttpRequest.prototype.send;
                                XMLHttpRequest.prototype.send = function(body) {
                                    if (this._shouldBlock) {
                                        console.log('Iframe内部拦截XHR请求:', this._url);
                                        Object.defineProperty(this, 'readyState', { value: 4 });
                                        Object.defineProperty(this, 'status', { value: 404 });
                                        return;
                                    }
                                    
                                    return originalSend.apply(this, arguments);
                                };
                            })();
                        `;
                        iframeDocument.head.appendChild(script);
                    } catch (e) {
                        console.log('无法向iframe注入代码(跨域限制)', e);
                    }
                });
            } catch (e) {
                console.log('无法设置iframe请求拦截', e);
            }
        }
        
        // 激活网络请求拦截
        setupNetworkInterception();
        
        // ===== 方案二: 链接拦截系统 =====
        
        // 允许的链接白名单
        const allowedUrls = [
            'https://www.youtube.com/channel/UCSyJvU1NWamcfSkOAdE3hhQ?embeds_referring_euri=https%3A%2F%2Fyuzeguitar.us.kg%2F&source_ve_path=MzY5MjU',
            'https://www.youtube.com/channel/UCSyJvU1NWamcfSkOAdE3hhQ',
            'https://www.youtube.com/watch?time_continue=1&v=7NrO3vBjsos&embeds_referring_euri=https%3A%2F%2Fyuzeguitar.us.kg%2F&source_ve_path=Mjg2NjUsMjg2NjQsMjg2NjY',
            'https://www.youtube.com/watch?v=7NrO3vBjsos&t=1s&ab_channel=jerry_guitarist',
            'https://yuzeguitar.us.kg/gallery.html',
            'https://yuzeguitar.us.kg/index.html#profile',
            'https://yuzeguitar.us.kg/index.html#hero',
            'https://yuzeguitar.us.kg/',
            'https://yuzeguitar.us.kg/video.html',
            'https://yuzeguitar.us.kg/contact.html'
        ];
        
        // 简化版本的URL用于匹配(不含协议)
        const simplifiedAllowedUrls = allowedUrls.map(url => {
            return url.replace(/^https?:\/\//, '');
        });
        
        // 创建提示框
        function createBlockerOverlay() {
            // 如果已存在就不重复创建
            if (document.getElementById('linkBlockerOverlay')) return;
            
            const overlay = document.createElement('div');
            overlay.id = 'linkBlockerOverlay';
            overlay.className = 'link-blocker-overlay';
            
            const message = document.createElement('div');
            message.className = 'link-blocker-message';
            message.textContent = 'External links are not allowed.';
            
            overlay.appendChild(message);
            document.body.appendChild(overlay);
            
            return overlay;
        }
        
        // 显示提示框
        function showBlockerMessage() {
            const overlay = document.getElementById('linkBlockerOverlay') || createBlockerOverlay();
            overlay.classList.add('active');
            
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 2000);
        }
        
        // 检查URL是否在白名单中
        function isUrlAllowed(url) {
            // 如果是相对路径或内部链接,允许
            if (!url || url.startsWith('#') || url.startsWith('javascript:')) return true;
            if (url.startsWith('index.html') || 
                url === 'gallery.html' || 
                url === 'video.html' || 
                url === 'contact.html') return true;
            
            // 检查完整URL
            return allowedUrls.some(allowedUrl => url === allowedUrl) || 
                   simplifiedAllowedUrls.some(allowedUrl => url.replace(/^https?:\/\//, '') === allowedUrl);
        }
        
        // 拦截所有点击事件
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            if (!isUrlAllowed(href)) {
                e.preventDefault();
                e.stopPropagation();
                showBlockerMessage();
                return false;
            }
        }, true);
        
        // 监听页面离开尝试
        window.addEventListener('beforeunload', function(e) {
            // 检查是否是内部导航
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'A') {
                const href = activeElement.getAttribute('href');
                // 如果是内部链接,不显示提示
                if (href && (
                    href.startsWith('index.html') || 
                    href === 'gallery.html' || 
                    href === 'video.html' || 
                    href === 'contact.html' ||
                    href.startsWith('#')
                )) {
                    return;
                }
            }
            
            // 如果是外部链接,显示提示
            const destinationUrl = activeElement.href;
            if (destinationUrl && !isUrlAllowed(destinationUrl)) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
        
        // ===== 方案三: 视频结束保护层 =====
        
        // 获取视频元素
        const videoWrapper = document.querySelector('.video-wrapper');
        const iframe = videoWrapper ? videoWrapper.querySelector('iframe') : null;
        
        if (!iframe) return;
        
        // 创建一个透明保护层
        const protectionOverlay = document.createElement('div');
        protectionOverlay.className = 'video-end-protection-overlay';
        Object.assign(protectionOverlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '1045px',
            height: '1047.26px',
            margin: '16px 0px 0px',
            zIndex: '1000',
            display: 'none',
            cursor: 'default',
            pointerEvents: 'auto' // 拦截点击事件
        });
        
        // 添加到视频容器
        videoWrapper.style.position = 'relative';
        videoWrapper.appendChild(protectionOverlay);
        
        // 监听视频播放状态(使用YouTube API)
        function onYouTubeIframeAPIReady() {
            const videoId = extractVideoId(iframe.src);
            if (!videoId) return;
            
            // 创建新的播放器实例
            new YT.Player(iframe, {
                videoId: videoId,
                events: {
                    'onStateChange': onPlayerStateChange,
                    'onReady': onPlayerReady
                }
            });
        }
        
        // 从URL中提取视频ID
        function extractVideoId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }
        
        // 播放器状态变化事件
        function onPlayerStateChange(event) {
            // 监测视频进度
            checkVideoProgress(event.target);
            
            // 如果视频结束
            if (event.data === YT.PlayerState.ENDED) {
                showProtectionOverlay();
            }
        }
        
        // 播放器准备就绪
        function onPlayerReady(event) {
            // 设置定时器监测视频进度
            setInterval(function() {
                checkVideoProgress(event.target);
            }, 1000);
        }
        
        // 检查视频进度
        function checkVideoProgress(player) {
            try {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                
                // 如果视频接近结束(9:23,即563秒)或已结束
                if (currentTime >= 563 || currentTime / duration > 0.98) {
                    showProtectionOverlay();
                } else {
                    hideProtectionOverlay();
                }
            } catch (e) {
                console.log('无法检查视频进度', e);
            }
        }
        
        // 显示保护层
        function showProtectionOverlay() {
            protectionOverlay.style.display = 'block';
            
            // 调整保护层尺寸以适应不同屏幕
            adjustOverlaySize();
        }
        
        // 隐藏保护层
        function hideProtectionOverlay() {
            protectionOverlay.style.display = 'none';
        }
        
        // 根据屏幕尺寸调整保护层大小
        function adjustOverlaySize() {
            const wrapperRect = videoWrapper.getBoundingClientRect();
            
            // 为移动设备调整
            if (window.innerWidth <= 768) {
                protectionOverlay.style.width = wrapperRect.width + 'px';
                protectionOverlay.style.height = wrapperRect.height * 0.85 + 'px'; // 排除播放控制区域
            } else {
                // 桌面尺寸
                protectionOverlay.style.width = '1045px';
                protectionOverlay.style.height = '1047.26px';
            }
        }
        
        // 监听窗口大小变化,调整保护层尺寸
        window.addEventListener('resize', function() {
            if (protectionOverlay.style.display === 'block') {
                adjustOverlaySize();
            }
        });
        
        // 使用MutationObserver观察DOM变化,尤其是YouTube可能在视频结束时添加的推荐内容
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 当有节点添加时,检查是否是YouTube添加的推荐内容
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        
                        // 如果添加的是推荐视频容器,立即显示保护层
                        if (node.classList && 
                            (node.classList.contains('ytp-endscreen-content') || 
                             node.classList.contains('ytp-videowall-still'))) {
                            showProtectionOverlay();
                            break;
                        }
                    }
                }
            });
        });
        
        // 开始观察视频包装器的变化
        observer.observe(videoWrapper, { 
            childList: true, 
            subtree: true, 
            attributes: true, 
            attributeFilter: ['class', 'style']
        });
        
        // 加载YouTube API
        function loadYouTubeAPI() {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // 如果API已加载,我们需要手动调用
            if (window.YT && window.YT.Player) {
                onYouTubeIframeAPIReady();
            } else {
                // 否则设置全局回调
                window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            }
        }
        
        // 启动YouTube API
        loadYouTubeAPI();
        
        // 如果我们无法使用YouTube API,使用备用检测方法
        let backupCheckInterval;
        function setupBackupDetection() {
            // 每秒检查是否有YouTube推荐视频出现
            backupCheckInterval = setInterval(function() {
                // 检查是否有推荐视频元素
                const endScreenContent = document.querySelector('.ytp-endscreen-content');
                const videowallStills = document.querySelectorAll('.ytp-videowall-still');
                
                if (endScreenContent || videowallStills.length > 0) {
                    showProtectionOverlay();
                }
            }, 1000);
        }
        
        // 设置备用检测
        setupBackupDetection();
        
        // 清理函数,在页面卸载时清理资源
        window.addEventListener('beforeunload', function() {
            observer.disconnect();
            if (backupCheckInterval) {
                clearInterval(backupCheckInterval);
            }
        });
    });
})(); 
