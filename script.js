// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.hobby-card, .food-item, .stat-item').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 按钮悬停效果
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// 背景粒子效果
function createParticles() {
    const heroSection = document.querySelector('.hero-section');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机大小
        const size = Math.random() * 5 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机颜色
        const colors = ['#ffffff', '#ffd700', '#667eea', '#764ba2'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机动画持续时间
        const duration = Math.random() * 10 + 5;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;
        
        // 随机动画延迟
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        heroSection.appendChild(particle);
    }
}

// 添加粒子动画样式
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.5;
        z-index: 1;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后创建粒子
window.addEventListener('load', createParticles);

// 兴趣爱好卡片点击效果
const hobbyCards = document.querySelectorAll('.hobby-card');
hobbyCards.forEach(card => {
    card.addEventListener('click', function() {
        // 移除其他卡片的激活状态
        hobbyCards.forEach(c => c.classList.remove('active'));
        // 添加当前卡片的激活状态
        this.classList.add('active');
    });
});

// 添加激活状态样式
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .hobby-card.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
    }
    
    .hobby-card.active h3,
    .hobby-card.active p {
        color: white;
    }
`;
document.head.appendChild(activeStyle);