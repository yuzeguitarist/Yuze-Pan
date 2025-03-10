/**
 * 图片库功能
 * 包含图片灯箱效果和导航功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化灯箱
    initLightbox();
    
    // 初始化图片库
    initGallery();
    
    // 添加触摸支持
    addTouchSupport();
});

/**
 * 图片库数据 - 按类别分组
 */
const galleryCategories = [
    {
        id: 'competition',
        title: '国际比赛',
        images: [
            {
                id: 1,
                src: 'static/images/gallery/Segovia International Guitar Competition Monheim,Germany.jpg',
                thumbnail: 'static/images/gallery/Segovia International Guitar Competition Monheim,Germany.jpg',
                title: '德国Segovia国际吉他比赛',
                description: '与郦嘉炯老师的获奖合影'
            },
            {
                id: 2,
                src: 'static/images/gallery/Segovia International Guitar Competition Winners\' Concert.jpg',
                thumbnail: 'static/images/gallery/Segovia International Guitar Competition Winners\' Concert.jpg',
                title: '德国Segovia国际吉他比赛',
                description: '获奖者音乐会-Yuze Pan'
            },
            {
                id: 3,
                src: 'static/images/gallery/Photos of the "Juan Crisostomo de Arriaga" International Guitar Competition in Spain.jpg',
                thumbnail: 'static/images/gallery/Photos of the "Juan Crisostomo de Arriaga" International Guitar Competition in Spain.jpg',
                title: 'Juan Crisostomo de Arriaga国际吉他比赛',
                description: '西班牙比赛获奖合影'
            }
        ]
    },
    {
        id: 'performance',
        title: '音乐会演出',
        images: [
            {
                id: 4,
                src: 'static/images/gallery/Concert at Hangzhou.jpg',
                thumbnail: 'static/images/gallery/Concert at Hangzhou.jpg',
                title: '杭州音乐会',
                description: '在杭州举办的古典吉他音乐会'
            },
            {
                id: 5,
                src: 'static/images/gallery/Hua Bin Opera House Future Stars Performance Photo.jpg',
                thumbnail: 'static/images/gallery/Hua Bin Opera House Future Stars Performance Photo.jpg',
                title: '华彬歌剧院未来之星演出',
                description: '在北京华彬歌剧院未来之星系列音乐会上的演出'
            },
            {
                id: 6,
                src: 'static/images/gallery/Hua Bin Opera House Future Stars Performance Group Photo.jpg',
                thumbnail: 'static/images/gallery/Hua Bin Opera House Future Stars Performance Group Photo.jpg',
                title: '华彬歌剧院未来之星合影',
                description: '未来之星系列音乐会后的合影'
            }
        ]
    },
    {
        id: 'masterclass',
        title: '大师课学习',
        images: [
            {
                id: 7,
                src: 'static/images/gallery/Judicael Perroy\'s masterclass, Changsha, Hunan, China.jpg',
                thumbnail: 'static/images/gallery/Judicael Perroy\'s masterclass, Changsha, Hunan, China.jpg',
                title: 'Judicael Perroy大师课',
                description: '在湖南长沙参加国际知名吉他演奏家Judicael Perroy的大师课'
            },
            {
                id: 8,
                src: 'static/images/gallery/Photo with Professor Judicael Perroy, Changsha, Hunan, China.JPG',
                thumbnail: 'static/images/gallery/Photo with Professor Judicael Perroy, Changsha, Hunan, China.JPG',
                title: '与Judicael Perroy教授合影',
                description: '在湖南长沙与国际著名吉他大师Judicael Perroy的合影'
            },
            {
                id: 9,
                src: 'static/images/gallery/Masterclass by Professor Lorenzo Micheli, Central Conservatory of Music Middle School, Beijing.jpg',
                thumbnail: 'static/images/gallery/Masterclass by Professor Lorenzo Micheli, Central Conservatory of Music Middle School, Beijing.jpg',
                title: 'Lorenzo Micheli教授大师班',
                description: '在中央音乐学院附中接受Lorenzo Micheli教授的指导'
            }
        ]
    },
    {
        id: 'others',
        title: '其他照片',
        images: [
            // 如果有其他照片,可以放在这里
        ]
    }
];

// 将所有图片平铺到一个数组中,用于灯箱导航
const galleryData = galleryCategories.reduce((acc, category) => {
    return acc.concat(category.images);
}, []);

/**
 * 初始化图片库
 */
function initGallery() {
    // 检查是否在gallery专页还是在首页
    const isGalleryPage = window.location.pathname.includes('gallery.html');
    const gallerySection = isGalleryPage 
        ? document.getElementById('gallery') 
        : document.getElementById('gallery-preview');
    
    if (!gallerySection) return;
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 480;
    
    // 创建图片库容器
    let galleryContainer;
    if (isGalleryPage) {
        // 在专页上使用已存在的容器
        galleryContainer = document.querySelector('.gallery-container') || document.createElement('div');
        if (!galleryContainer.parentNode) {
            galleryContainer.className = 'gallery-container';
            // 标题已经在HTML中定义,不需要再添加
            gallerySection.appendChild(galleryContainer);
        }
    } else {
        // 在首页上,容器已经在HTML中创建
        galleryContainer = gallerySection.querySelector('.gallery-container');
        if (!galleryContainer) return;
    }
    
    // 清除已有图片内容(保留标题)
    const existingGrids = galleryContainer.querySelectorAll('.gallery-grid, .gallery-category');
    existingGrids.forEach(grid => grid.remove());
    
    // 创建按类别分组的图片网格
    let categoryCounter = 0;
    // 显示所有类别,不再限制为前三个类别
    galleryCategories.forEach((category, categoryIndex) => {
        if (category.images.length === 0) return;
        if (!isGalleryPage && categoryCounter >= 1) return; // 在首页只显示第一个类别
        
        categoryCounter++;
        
        // 创建类别容器
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'gallery-category';
        categoryContainer.setAttribute('data-category', category.id);
        categoryContainer.style.width = '100%'; // 确保容器占满宽度
        
        // 所有类别都显示,不再有隐藏类别
        
        // 创建图片网格
        const grid = document.createElement('div');
        grid.className = 'gallery-grid';
        grid.style.display = 'grid';
        
        // 根据设备类型设置不同的列数
        if (isMobile) {
            grid.style.gridTemplateColumns = '1fr'; // 移动设备单列布局
            grid.style.gap = '1rem';
        } else {
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 桌面设备三列布局
            grid.style.gap = '1.5rem';
        }
        
        grid.style.width = '100%';
        
        // 填充图片
        category.images.forEach((item, index) => {
            // 创建图片项
            const galleryItem = createGalleryItem(item);
            
            // 确保样式正确应用
            if (isMobile) {
                galleryItem.style.height = '250px'; // 移动设备上图片更大
                galleryItem.style.marginBottom = '1rem';
            } else {
                galleryItem.style.height = window.innerWidth <= 768 ? '180px' : '250px';
            }
            
            galleryItem.style.width = '100%';
            
            grid.appendChild(galleryItem);
        });
        
        // 如果是桌面设备且最后一行不足3个,添加空白项填充
        if (!isMobile) {
            const remainder = category.images.length % 3;
            if (remainder > 0 && remainder < 3) {
                for (let i = 0; i < (3 - remainder); i++) {
                    const emptyItem = document.createElement('div');
                    emptyItem.className = 'gallery-item empty';
                    emptyItem.style.visibility = 'hidden'; // 隐藏但保留空间
                    emptyItem.style.height = window.innerWidth <= 768 ? '180px' : '250px';
                    grid.appendChild(emptyItem);
                }
            }
        }
        
        categoryContainer.appendChild(grid);
        galleryContainer.appendChild(categoryContainer);
    });
    
    // 不再添加展开/折叠按钮
    
    // 添加响应式布局调整
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 480;
        if (isMobileNow !== isMobile) {
            // 如果设备类型改变,重新初始化图片库
            initGallery();
        }
    });

    // 添加延迟加载
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // 不支持IntersectionObserver的浏览器的后备方案
        document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}

/**
 * 创建图片库网格
 */
function createGalleryGrid() {
    // 这个函数不再需要,因为我们在initGallery中直接创建了整个布局
    // 保留此函数是为了避免其他地方可能的引用错误
    return document.createElement('div');
}

/**
 * 创建单个图片项
 */
function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-id', item.id);
    
    const img = document.createElement('img');
    // 使用延迟加载
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'; // 透明占位符
    img.setAttribute('data-src', item.thumbnail);
    img.alt = item.title;
    img.loading = 'lazy';
    
    const caption = document.createElement('div');
    caption.className = 'gallery-item-caption';
    
    // 在移动设备上默认显示标题
    if (window.innerWidth <= 480) {
        caption.style.transform = 'translateY(0)';
        caption.style.opacity = '0.9';
        caption.style.display = 'block';
        caption.style.padding = '0.75rem';
    }
    
    const title = document.createElement('h3');
    title.className = 'gallery-item-title';
    title.textContent = item.title;
    
    const description = document.createElement('p');
    description.className = 'gallery-item-description';
    description.textContent = item.description;
    
    caption.appendChild(title);
    caption.appendChild(description);
    
    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);
    
    // 添加加载效果
    img.onload = function() {
        this.classList.add('loaded');
    };
    
    // 点击打开灯箱
    galleryItem.addEventListener('click', function() {
        openLightbox(item.id);
    });
    
    // 添加键盘可访问性
    galleryItem.setAttribute('tabindex', '0');
    galleryItem.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(item.id);
        }
    });
    
    return galleryItem;
}

/**
 * 初始化灯箱功能
 */
function initLightbox() {
    // 创建灯箱元素
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="" class="lightbox-image">
            <button class="lightbox-close" aria-label="关闭灯箱">&times;</button>
            <div class="lightbox-nav">
                <button class="lightbox-prev" aria-label="上一张图片">&lt;</button>
                <button class="lightbox-next" aria-label="下一张图片">&gt;</button>
            </div>
            <div class="lightbox-caption"></div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // 点击关闭按钮
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // 点击上一张/下一张
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    
    // 点击背景关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!document.querySelector('.lightbox.active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

/**
 * 添加触摸支持
 */
function addTouchSupport() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // 向左滑动,显示下一张
            showNextImage();
        } else if (touchEndX > touchStartX + threshold) {
            // 向右滑动,显示上一张
            showPrevImage();
        }
    }
}

/**
 * 当前显示的图片ID
 */
let currentImageId = null;

/**
 * 打开灯箱显示指定图片
 */
function openLightbox(imageId) {
    currentImageId = imageId;
    const item = galleryData.find(item => item.id === imageId);
    
    if (!item) return;
    
    const lightbox = document.getElementById('lightbox');
    const image = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    // 设置加载状态
    image.classList.add('loading');
    
    // 预加载图片
    const preloadImage = new Image();
    preloadImage.src = item.src;
    preloadImage.onload = function() {
        // 设置图片和说明
        image.src = item.src;
        image.alt = item.title;
        image.classList.remove('loading');
        caption.textContent = `${item.title} - ${item.description}`;
        
        // 显示灯箱
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        
        // 禁止滚动
        document.body.style.overflow = 'hidden';
        
        // 设置焦点
        setTimeout(() => {
            lightbox.querySelector('.lightbox-close').focus();
        }, 100);
    };
    
    preloadImage.onerror = function() {
        console.error('图片加载失败:', item.src);
        image.classList.remove('loading');
        // 如果加载失败,也打开灯箱,只是显示错误信息
        caption.textContent = `${item.title} - 图片加载失败`;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
    };
}

/**
 * 关闭灯箱
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // 恢复滚动
    document.body.style.overflow = '';
    
    // 重置当前图片
    currentImageId = null;
    
    // 返回焦点到之前的元素
    const galleryItem = document.querySelector(`.gallery-item[data-id="${currentImageId}"]`);
    if (galleryItem) {
        galleryItem.focus();
    }
}

/**
 * 显示上一张图片
 */
function showPrevImage() {
    if (currentImageId === null) return;
    
    // 获取当前索引
    const currentIndex = galleryData.findIndex(item => item.id === currentImageId);
    
    // 计算上一张索引
    const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    
    // 显示上一张
    openLightbox(galleryData[prevIndex].id);
}

/**
 * 显示下一张图片
 */
function showNextImage() {
    if (currentImageId === null) return;
    
    // 获取当前索引
    const currentIndex = galleryData.findIndex(item => item.id === currentImageId);
    
    // 计算下一张索引
    const nextIndex = (currentIndex + 1) % galleryData.length;
    
    // 显示下一张
    openLightbox(galleryData[nextIndex].id);
} 