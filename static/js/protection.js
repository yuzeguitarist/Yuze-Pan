/**
 * 内容保护脚本 - 防止复制和右键菜单
 * 注意:这些方法可以提供基本保护,但技术娴熟的用户仍可绕过
 */
document.addEventListener('DOMContentLoaded', function() {
    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 禁用复制功能
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 禁用剪切功能
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 阻止拖动选择
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 增强键盘快捷键拦截 - 全面禁用各种保存组合
    document.addEventListener('keydown', function(e) {
        // 检查是否在输入框中,如果是则允许正常操作
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        // 更完整地检测F12键 - 处理Mac上的fn+F12组合
        if (e.key === 'F12' || e.code === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // 检查各种保存快捷键组合
        if ((e.ctrlKey || e.metaKey) && (
            e.key === 's' || // Ctrl+S / Command+S (保存)
            e.key === 'S' || 
            e.keyCode === 83
        )) {
            e.preventDefault();
            return false;
        }
        
        // 检查"另存为"快捷键
        if (
            (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) || // Ctrl+Shift+S
            (e.metaKey && e.altKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) // Command+Option+S
        ) {
            e.preventDefault();
            return false;
        }
        
        // 检查打印快捷键
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
            e.preventDefault();
            return false;
        }
        
        // 检查查看源代码快捷键
        if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
        
        // 检查常见快捷键
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'c': // 复制
                case 'x': // 剪切
                case 'a': // 全选
                    e.preventDefault();
                    return false;
            }
        }
        
        // 阻止Ctrl+Shift+I / Command+Option+I (开发者工具)
        if ((e.ctrlKey || e.metaKey) && (
            (e.shiftKey && (e.key === 'i' || e.key === 'I' || e.keyCode === 73)) || // Windows: Ctrl+Shift+I
            (e.altKey && (e.key === 'i' || e.key === 'I' || e.keyCode === 73)) // Mac: Command+Option+I
        )) {
            e.preventDefault();
            return false;
        }
        
        // 阻止Ctrl+Shift+C / Command+Option+C (审查元素)
        if ((e.ctrlKey || e.metaKey) && (
            (e.shiftKey && (e.key === 'c' || e.key === 'C' || e.keyCode === 67)) || // Windows: Ctrl+Shift+C
            (e.altKey && (e.key === 'c' || e.key === 'C' || e.keyCode === 67)) // Mac: Command+Option+C
        )) {
            e.preventDefault();
            return false;
        }
        
        // 阻止开发者工具的其他Mac特有快捷键
        if (e.metaKey && e.altKey && e.keyCode === 74) { // Command+Option+J (Chrome控制台)
            e.preventDefault();
            return false;
        }
    }, true); // 使用捕获阶段,确保在事件传播最早阶段拦截
    
    // 通用保护 - 捕获所有函数键F1-F12
    document.addEventListener('keydown', function(e) {
        // 拦截所有F1-F12键,特别关注F12
        if (e.key && e.key.match(/^F(1[0-2]|[1-9])$/)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true); // 使用捕获阶段
}); 
