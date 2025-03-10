/**
 * 简单的音频播放器 - 移动设备优化版
 */
class AudioPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTrack = 0;
        this.audioElement = null;
        this.tracks = [
            {
                title: 'Villa Lobos Etude No.7 - Yuze Pan',
                file: 'static/audio/Villa Lobos Etude No.7.mp3',
                duration: '2:17'
            }
            // 可以添加更多音轨
        ];

        this.initPlayer();
        this.loadTrack(this.currentTrack);
        
        // 自动显示当前曲目名
        document.querySelectorAll('.track-name').forEach(el => {
            el.textContent = this.tracks[this.currentTrack].title;
        });
        
        // 检测移动设备并应用优化
        this.checkAndOptimizeForMobile();
        
        // 添加空格键控制
        this.setupSpacebarControl();
    }
    
    // 设置空格键控制
    setupSpacebarControl() {
        // 监听空格键来控制播放/暂停,但在视频页面不执行
        document.addEventListener('keydown', (event) => {
            // 如果在视频页面,不处理空格键事件
            if (document.body.classList.contains('video-page')) {
                return;
            }
            
            if (event.code === 'Space' || event.keyCode === 32) {
                event.preventDefault(); // 防止页面滚动
                this.togglePlay();
            }
        });
    }
    
    // 移动设备检测与优化
    checkAndOptimizeForMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log("移动设备检测:优化播放器...");
            
            // 优化移动设备上的音频加载
            this.audioElement.setAttribute('preload', 'metadata');
            
            // 确保播放按钮可见
            document.querySelectorAll('.player-btn').forEach(btn => {
                // 移动设备上添加额外类
                btn.classList.add('mobile-btn');
                
                // 添加触摸事件
                btn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    this.classList.add('touch-active');
                }, { passive: false });
                
                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    this.classList.remove('touch-active');
                    // 模拟点击
                    this.click();
                }, { passive: false });
            });
        }
    }

    initPlayer() {
        // 创建音频元素
        this.audioElement = document.createElement('audio');
        this.audioElement.setAttribute('preload', 'auto');
        document.body.appendChild(this.audioElement);

        // 获取控制按钮
        this.playBtn = document.querySelector('.play-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.trackName = document.querySelector('.track-name');
        this.trackTime = document.querySelector('.track-time');

        // 添加事件监听
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.audioElement.addEventListener('timeupdate', () => this.updateTime());
        this.audioElement.addEventListener('ended', () => this.nextTrack());
        
        // 为音频加载错误添加处理
        this.audioElement.addEventListener('error', (e) => {
            console.error('音频加载错误:', e);
            this.trackTime.textContent = '加载错误';
        });
    }

    loadTrack(index) {
        // 载入指定的音轨
        const track = this.tracks[index];
        this.audioElement.src = track.file;
        this.trackName.textContent = track.title;
        this.trackTime.textContent = `0:00/${track.duration}`;
        this.currentTrack = index;
        
        // 重置播放状态
        if (this.isPlaying) {
            this.pause();
            setTimeout(() => this.play(), 300); // 短暂延迟后播放,确保加载
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        // 使用CSS类来更改播放按钮样式
        this.playBtn.classList.add('playing');
        // 直接设置背景图片,确保在所有设备上都能显示
        this.playBtn.style.backgroundImage = "url('https://img.icons8.com/ios-filled/50/ffffff/pause.png')";
        
        const playPromise = this.audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('播放错误:', error);
                // 自动尝试切换到下一首
                if (error.name === 'NotAllowedError') {
                    // 用户交互限制,不自动切换
                    this.pause();
                    
                    // 显示用户提示 - 移动设备可能需要用户交互才能播放
                    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        this.trackTime.textContent = '点击播放';
                        
                        // 添加一次性点击监听器以启动播放
                        const bodyClickHandler = () => {
                            this.play();
                            document.body.removeEventListener('click', bodyClickHandler);
                        };
                        document.body.addEventListener('click', bodyClickHandler);
                    }
                } else {
                    this.nextTrack();
                }
            });
        }
        
        this.isPlaying = true;
    }

    pause() {
        // 使用CSS类来更改播放按钮样式
        this.playBtn.classList.remove('playing');
        // 直接设置背景图片,确保在所有设备上都能显示
        this.playBtn.style.backgroundImage = "url('https://img.icons8.com/ios-filled/50/ffffff/play.png')";
        this.audioElement.pause();
        this.isPlaying = false;
    }

    prevTrack() {
        let index = this.currentTrack - 1;
        if (index < 0) index = this.tracks.length - 1;
        this.loadTrack(index);
    }

    nextTrack() {
        let index = this.currentTrack + 1;
        if (index >= this.tracks.length) index = 0;
        this.loadTrack(index);
        if (this.isPlaying) this.play();
    }

    updateTime() {
        // 更新当前时间显示
        const current = this.audioElement.currentTime;
        const minutes = Math.floor(current / 60);
        const seconds = Math.floor(current % 60).toString().padStart(2, '0');
        const duration = this.tracks[this.currentTrack].duration;
        this.trackTime.textContent = `${minutes}:${seconds}/${duration}`;
    }
}

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', () => {
    // 确保播放器控件存在
    if (document.querySelector('.player-controls')) {
        new AudioPlayer();
    }

    // 获取所有外部链接(不是锚点链接)
    const externalLinks = document.querySelectorAll('a:not([href^="#"])');
    
    // 为每个外部链接添加点击事件处理
    externalLinks.forEach(link => {
        // 只处理同站点链接
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', function(e) {
                // 检查是否是导航到视频页面
                const isVideoPage = this.href.includes('video.html');
                const fromVideoPage = document.body.classList.contains('video-page');
                
                // 如果当前不在视频页面,且将要前往视频页面,或者相反情况
                if ((isVideoPage && !fromVideoPage) || (!isVideoPage && fromVideoPage)) {
                    e.preventDefault();
                    
                    // 添加过渡类
                    document.body.style.opacity = '0.7';
                    
                    // 如果从普通页面到视频页面,播放器下滑动画
                    if (isVideoPage && !fromVideoPage) {
                        const playerBar = document.querySelector('.player-bar');
                        const navBar = document.querySelector('.nav-bar');
                        
                        if (playerBar && navBar) {
                            playerBar.style.transform = 'translateY(100%)';
                            playerBar.style.opacity = '0';
                            navBar.style.bottom = '0';
                            
                            // 短暂延迟后跳转页面
                            setTimeout(() => {
                                window.location.href = this.href;
                            }, 300);
                            return;
                        }
                    } 
                    // 如果从视频页面返回普通页面,播放器上滑动画
                    else if (!isVideoPage && fromVideoPage) {
                        // 创建一个临时的播放器和导航栏元素用于动画
                        const playerBar = document.querySelector('.player-bar');
                        const navBar = document.querySelector('.nav-bar');
                        
                        if (playerBar && navBar) {
                            // 先保持隐藏状态,准备反向动画
                            playerBar.style.transform = 'translateY(100%)';
                            playerBar.style.opacity = '0';
                            
                            // 开始反向动画 - 导航栏向上移动,播放器滑入
                            setTimeout(() => {
                                // 动画过程中不要阻止点击
                                playerBar.style.pointerEvents = 'auto';
                                
                                // 开始导航栏向上移动的动画
                                navBar.style.transition = 'bottom 0.3s ease';
                                navBar.style.bottom = 'var(--player-height)';
                                
                                // 开始播放器滑入的动画
                                playerBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                                playerBar.style.transform = 'translateY(0)';
                                playerBar.style.opacity = '1';
                                
                                // 动画完成后跳转
                                setTimeout(() => {
                                    window.location.href = this.href;
                                }, 250);
                            }, 50);
                            return;
                        }
                    }
                    
                    // 如果以上特殊情况都不适用,使用默认跳转
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 200);
                }
            });
        }
    });
}); 