// ===== Python 语法高亮 =====
function highlightPython() {
    const codeBlocks = document.querySelectorAll('.code-block code');

    codeBlocks.forEach(block => {
        let html = block.innerHTML;

        // 转义 HTML 实体（保护已有的）
        // 注释
        html = html.replace(/(#.*$)/gm, '<span class="comment">$1</span>');

        // 多行注释（三引号）
        html = html.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, '<span class="string">$1</span>');

        // 字符串（f-string, 双引号, 单引号）
        html = html.replace(/(f?"[^"]*"|f?'[^']*')/g, function(match) {
            // 避免重复高亮
            if (match.includes('class="')) return match;
            return '<span class="string">' + match + '</span>';
        });

        // 关键字
        const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return',
            'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'in', 'not',
            'and', 'or', 'is', 'True', 'False', 'None', 'lambda', 'yield', 'pass',
            'break', 'continue', 'raise', 'global', 'nonlocal', 'assert', 'del'];

        keywords.forEach(kw => {
            const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
            html = html.replace(regex, function(match, p1, offset, str) {
                // 检查是否已在某个 span 内
                const before = str.substring(0, offset);
                const openSpans = (before.match(/<span/g) || []).length;
                const closeSpans = (before.match(/<\/span>/g) || []).length;
                if (openSpans > closeSpans) return match;
                return '<span class="keyword">' + p1 + '</span>';
            });
        });

        // 内置函数
        const builtins = ['print', 'len', 'range', 'type', 'int', 'str', 'float', 'list',
            'dict', 'set', 'tuple', 'input', 'sorted', 'enumerate', 'zip', 'map', 'filter',
            'open', 'isinstance', 'hasattr', 'getattr', 'super', 'abs', 'max', 'min', 'sum'];

        builtins.forEach(fn => {
            const regex = new RegExp('\\b(' + fn + ')(\\()', 'g');
            html = html.replace(regex, function(match, p1, p2, offset, str) {
                const before = str.substring(0, offset);
                const openSpans = (before.match(/<span/g) || []).length;
                const closeSpans = (before.match(/<\/span>/g) || []).length;
                if (openSpans > closeSpans) return match;
                return '<span class="builtin">' + p1 + '</span>' + p2;
            });
        });

        // 数字
        html = html.replace(/\b(\d+\.?\d*)\b/g, function(match, p1, offset, str) {
            const before = str.substring(0, offset);
            const openSpans = (before.match(/<span/g) || []).length;
            const closeSpans = (before.match(/<\/span>/g) || []).length;
            if (openSpans > closeSpans) return match;
            return '<span class="number">' + p1 + '</span>';
        });

        block.innerHTML = html;
    });
}

// ===== 复制代码功能 =====
function copyCode(btn) {
    const codeBlock = btn.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        btn.style.background = 'rgba(72, 187, 120, 0.3)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(() => {
        // fallback
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.textContent = '✅ 已复制';
        setTimeout(() => { btn.textContent = '📋 复制'; }, 2000);
    });
}

// ===== 侧边栏章节导航 =====
function initSidebar() {
    const links = document.querySelectorAll('.chapter-link');
    const chapters = document.querySelectorAll('.chapter');
    const progressFill = document.getElementById('progressFill');

    // 点击导航
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 滚动监听 - 高亮当前章节
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const chapterNum = id.replace('ch', '');

                // 更新侧边栏高亮
                links.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.chapter-link[data-chapter="${chapterNum}"]`);
                if (activeLink) activeLink.classList.add('active');

                // 更新进度条
                const progress = (parseInt(chapterNum) / chapters.length) * 100;
                progressFill.style.width = progress + '%';
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    chapters.forEach(ch => observer.observe(ch));
}

// ===== 回到顶部按钮 =====
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== 移动端侧边栏切换 =====
function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');

    // 检查是否为移动端
    function checkMobile() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
        } else {
            sidebar.classList.remove('hidden', 'show');
        }
    }

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    window.addEventListener('resize', checkMobile);
    checkMobile();
}

// ===== 平滑滚动（章节导航链接）=====
function initSmoothScroll() {
    document.querySelectorAll('.nav-prev, .nav-next').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    highlightPython();
    initSidebar();
    initBackToTop();
    initMobileSidebar();
    initSmoothScroll();
});
