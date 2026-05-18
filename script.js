// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNumberCounter();
    initMessageBoard();
    initParticles();
    initButtonEffects();
    initHobbyCards();
});

// ===== 滚动进入动画 =====
function initScrollAnimations() {
    // 为各区域添加滚动动画类
    const animateTargets = [
        { selector: '.about-section', type: '' },
        { selector: '.python-course-section', type: 'from-left' },
        { selector: '.learning-section', type: 'from-right' },
        { selector: '.hobbies-section', type: '' },
        { selector: '.food-section', type: 'from-left' },
        { selector: '.message-section', type: 'from-right' },
    ];

    animateTargets.forEach(({ selector, type }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('scroll-animate');
            if (type) el.classList.add(type);
        }
    });

    // 为卡片添加延迟动画
    document.querySelectorAll('.hobby-card, .food-item, .learning-card, .message-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'scale-in');
        el.style.transitionDelay = (i % 6) * 0.1 + 's';
    });

    // IntersectionObserver 触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}

// ===== 数字跳动动画 =====
function initNumberCounter() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500;
                    const step = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.personal-stats');
    if (statsSection) observer.observe(statsSection);
}

// ===== 留言板功能 =====
function initMessageBoard() {
    const textarea = document.getElementById('msgContent');
    const charCount = document.getElementById('charCount');

    // 字数统计
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
            charCount.style.color = textarea.value.length > 180 ? '#e8789a' : '#9ca3af';
        });
    }

    // 从 localStorage 加载留言
    loadMessages();
}

function submitMessage() {
    const nameInput = document.getElementById('msgName');
    const emojiSelect = document.getElementById('msgEmoji');
    const contentInput = document.getElementById('msgContent');

    const name = nameInput.value.trim() || '匿名访客';
    const emoji = emojiSelect.value;
    const content = contentInput.value.trim();

    if (!content) {
        contentInput.style.borderColor = '#e8789a';
        contentInput.setAttribute('placeholder', '请输入留言内容哦~ ✏️');
        setTimeout(() => {
            contentInput.style.borderColor = '#f3e8ed';
            contentInput.setAttribute('placeholder', '写下你想说的话...');
        }, 2000);
        return;
    }

    // 创建留言
    const message = {
        name: name,
        emoji: emoji,
        content: content,
        time: new Date().toLocaleDateString('zh-CN')
    };

    // 保存到 localStorage
    let messages = JSON.parse(localStorage.getItem('guestMessages') || '[]');
    messages.unshift(message);
    localStorage.setItem('guestMessages', JSON.stringify(messages));

    // 添加到页面
    addMessageToDOM(message, true);

    // 清空表单
    nameInput.value = '';
    contentInput.value = '';
    document.getElementById('charCount').textContent = '0';

    // 滚动到新留言
    const list = document.getElementById('messageList');
    list.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function addMessageToDOM(message, prepend = false) {
    const list = document.getElementById('messageList');
    const item = document.createElement('div');
    item.className = 'message-item';
    item.innerHTML = `
        <div class="message-avatar">${message.emoji}</div>
        <div class="message-body">
            <div class="message-header">
                <span class="message-name">${escapeHtml(message.name)}</span>
                <span class="message-time">${message.time}</span>
            </div>
            <p class="message-text">${escapeHtml(message.content)}</p>
        </div>
    `;

    if (prepend) {
        list.insertBefore(item, list.firstChild);
    } else {
        list.appendChild(item);
    }
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('guestMessages') || '[]');
    messages.forEach(msg => addMessageToDOM(msg, false));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== 背景粒子效果 =====
function initParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        const size = Math.random() * 5 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const colors = ['#ffffff', '#ffd700', '#ffb6c1', '#dda0dd'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const duration = Math.random() * 10 + 5;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 5 + 's';

        heroSection.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.4;
            z-index: 1;
            pointer-events: none;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== 按钮悬停效果 =====
function initButtonEffects() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ===== 兴趣爱好卡片效果 =====
function initHobbyCards() {
    const hobbyCards = document.querySelectorAll('.hobby-card');
    hobbyCards.forEach(card => {
        card.addEventListener('click', function() {
            hobbyCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .hobby-card.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
        }
        .hobby-card.active h3,
        .hobby-card.active p,
        .hobby-card.active .card-link {
            color: white;
        }
    `;
    document.head.appendChild(activeStyle);
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
