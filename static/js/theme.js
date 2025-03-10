/**
 * 主题切换功能
 * 支持深色和浅色两种模式,并记住用户选择
 */
document.addEventListener('DOMContentLoaded', function() {
    // 创建主题切换按钮
    createThemeToggle();
    
    // 初始化主题
    initTheme();
    
    // 监听主题切换
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});

/**
 * 创建主题切换按钮并添加到DOM
 */
function createThemeToggle() {
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg class="sun-icon" viewBox="0 0 24 24">
            <path d="M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19M12,4.5A7.5,7.5 0 0,0 4.5,12A7.5,7.5 0 0,0 12,19.5A7.5,7.5 0 0,0 19.5,12A7.5,7.5 0 0,0 12,4.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"></path>
        </svg>
        <svg class="moon-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"></path>
        </svg>
    `;
    document.body.appendChild(themeToggle);
}

/**
 * 初始化主题,从localStorage读取用户偏好
 */
function initTheme() {
    // 从localStorage获取用户主题偏好
    const savedTheme = localStorage.getItem('theme');
    
    // 如果有已保存的主题,则应用该主题
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // 默认使用深色主题
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * 切换主题并保存到localStorage
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 应用新主题
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 保存用户偏好
    localStorage.setItem('theme', newTheme);
    
    // 添加过渡动画类
    document.body.classList.add('theme-transition');
    
    // 过渡完成后移除过渡类
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);
} 