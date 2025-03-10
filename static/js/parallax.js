/**
 * 视差滚动效果
 * 为首页添加视差滚动,增强视觉体验
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化视差滚动
    initParallax();
    
    // 监听滚动事件以更新视差效果
    window.addEventListener('scroll', updateParallax);
});

/**
 * 初始化视差滚动效果
 */
function initParallax() {
    // 给首页英雄区域添加视差能力
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('parallax-enabled');
        
        // 为英雄区域添加标题和副标题
        // 检查是否已经有hero-content,避免重复添加
        if (!document.querySelector('.hero-content')) {
            const heroContent = document.createElement('div');
            heroContent.className = 'hero-content';
            heroContent.innerHTML = `
                <h1 class="hero-title">Yuze Pan</h1>
                <div class="hero-subtitle">Classical Guitarist</div>
            `;
            heroSection.appendChild(heroContent);
        }
    }
    
    // 应用初始视差效果
    updateParallax();
}

/**
 * 更新视差滚动效果
 */
function updateParallax() {
    const scrollY = window.scrollY;
    
    // 更新英雄区域的视差效果
    const heroSection = document.querySelector('.hero-section.parallax-enabled');
    if (heroSection) {
        const heroImage = heroSection.querySelector('.hero-image');
        if (heroImage) {
            // 计算视差位移
            const yPos = -scrollY * 0.3;
            heroImage.style.transform = `translateZ(-2px) scale(1.25) translateY(${yPos}px)`;
        }
        
        // 淡出效果 - 当滚动时标题逐渐消失
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            const opacity = Math.max(0, 1 - scrollY / 500);
            heroContent.style.opacity = opacity;
        }
    }
    
    // 检测视差区域可见性并添加入场动画
    const parallaxElements = document.querySelectorAll('.profile-item');
    
    parallaxElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            if (!element.classList.contains('active')) {
                element.classList.add('active');
                
                // 添加入场动画类
                element.style.animation = 'fadeIn 0.8s ease forwards';
                element.style.opacity = '0';
                
                // 错开动画时间以产生序列效果
                const items = document.querySelectorAll('.profile-item.active');
                const index = Array.from(items).indexOf(element);
                element.style.animationDelay = `${index * 0.15}s`;
            }
        }
    });
} 