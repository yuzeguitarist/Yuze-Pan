// 文件: Yuze-Pan/static/js/theme-switcher.js

// 函数:设置主题
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  // 可选:将用户选择保存到 localStorage
  // localStorage.setItem('theme', themeName);
}

// 函数:根据时间自动设置主题
function autoSetTheme() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 判断时间是否在 6:30 到 18:00 之间
  const isDayTime = (hour > 6 || (hour === 6 && minute >= 30)) && hour < 18;

  if (isDayTime) {
    setTheme('light');
    console.log("已设置为浅色主题 (时间)"); // 方便调试
  } else {
    setTheme('dark');
    console.log("已设置为深色主题 (时间)"); // 方便调试
  }
}

// --- 页面加载时自动执行 --- 
// 检查 localStorage 中是否有用户手动设置的主题 (这部分逻辑暂时注释掉,优先执行自动切换)
/*
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
  console.log(`已加载保存的主题: ${savedTheme}`);
} else {
  // 如果没有保存的主题,则根据时间自动设置
  // autoSetTheme(); // 不再需要在这里调用
}
*/

// 当前:直接根据时间自动设置主题
// autoSetTheme(); // <<-- 移除这一行，初始设置由内联脚本完成


// --- 手动切换功能 (暂时注释掉) ---
/*
// 函数:手动切换主题
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  console.log(`手动切换到: ${newTheme}`);
}

// 获取切换按钮 (假设你有一个 id 为 'theme-toggle' 的按钮)
const themeToggleButton = document.getElementById('theme-toggle');

// 为按钮添加点击事件监听器
if (themeToggleButton) {
  themeToggleButton.addEventListener('click', toggleTheme);
}
*/ 