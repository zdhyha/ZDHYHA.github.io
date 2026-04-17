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
    initCodeRunner();
});

// ===== Python 代码运行器 =====
let pyodide = null;
let isPyodideLoading = false;

async function initCodeRunner() {
    const codeRunner = document.getElementById('codeRunner');
    const runnerHeader = document.getElementById('runnerHeader');
    const runnerBody = document.getElementById('runnerBody');
    const runnerToggle = document.getElementById('runnerToggle');
    const runBtn = document.getElementById('runCode');
    const clearCodeBtn = document.getElementById('clearCode');
    const clearOutputBtn = document.getElementById('clearOutput');
    const minimizeBtn = document.getElementById('runnerMinimize');
    const closeBtn = document.getElementById('runnerClose');
    const codeInput = document.getElementById('codeInput');
    const codeOutput = document.getElementById('codeOutput');
    const statusEl = document.getElementById('runnerStatus');

    // 拖拽功能
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    runnerHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('.runner-btn')) return;
        isDragging = true;
        const rect = codeRunner.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        codeRunner.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // 边界限制
        const maxX = window.innerWidth - codeRunner.offsetWidth;
        const maxY = window.innerHeight - codeRunner.offsetHeight;
        
        codeRunner.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        codeRunner.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        codeRunner.style.right = 'auto';
        codeRunner.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        codeRunner.style.transition = '';
    });

    // 最小化
    minimizeBtn.addEventListener('click', () => {
        codeRunner.classList.add('minimized');
        runnerBody.style.display = 'none';
    });

    // 点击头部展开
    runnerHeader.addEventListener('dblclick', () => {
        if (codeRunner.classList.contains('minimized')) {
            codeRunner.classList.remove('minimized');
            runnerBody.style.display = '';
        }
    });

    // 关闭
    closeBtn.addEventListener('click', () => {
        codeRunner.classList.add('hidden');
        runnerToggle.style.display = 'flex';
    });

    // 展开按钮
    runnerToggle.addEventListener('click', () => {
        codeRunner.classList.remove('hidden', 'minimized');
        runnerBody.style.display = '';
        runnerToggle.style.display = 'none';
        // 重置位置
        codeRunner.style.left = '';
        codeRunner.style.top = '';
        codeRunner.style.right = '20px';
        codeRunner.style.bottom = '20px';
    });

    // 清空代码
    clearCodeBtn.addEventListener('click', () => {
        codeInput.value = '';
        codeInput.focus();
    });

    // 清空输出
    clearOutputBtn.addEventListener('click', () => {
        codeOutput.innerHTML = '<span class="output-placeholder">运行代码后，输出结果将显示在这里...</span>';
        codeOutput.classList.remove('error');
    });

    // 运行代码
    runBtn.addEventListener('click', runPythonCode);

    // 快捷键 Ctrl+Enter 运行
    codeInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            runPythonCode();
        }
    });

    async function runPythonCode() {
        const code = codeInput.value.trim();
        if (!code) {
            codeOutput.innerHTML = '<span class="output-placeholder">请先输入代码</span>';
            return;
        }

        // 初始化 Pyodide
        if (!pyodide && !isPyodideLoading) {
            isPyodideLoading = true;
            runBtn.disabled = true;
            statusEl.textContent = '正在加载 Python 环境...';
            statusEl.className = 'runner-status loading';

            try {
                pyodide = await loadPyodide();
                statusEl.textContent = 'Python 环境已就绪';
                statusEl.className = 'runner-status ready';
            } catch (err) {
                statusEl.textContent = 'Python 环境加载失败';
                statusEl.className = 'runner-status';
                codeOutput.innerHTML = '<span class="error">❌ 加载失败: ' + err.message + '</span>';
                codeOutput.classList.add('error');
                isPyodideLoading = false;
                runBtn.disabled = false;
                return;
            }
            isPyodideLoading = false;
            runBtn.disabled = false;
        }

        if (!pyodide) {
            codeOutput.innerHTML = '<span class="error">❌ Python 环境未就绪，请稍候...</span>';
            codeOutput.classList.add('error');
            return;
        }

        // 运行代码
        runBtn.disabled = true;
        statusEl.textContent = '运行中...';
        statusEl.className = 'runner-status loading';

        try {
            // 重定向 stdout
            pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

            // 运行用户代码
            await pyodide.runPythonAsync(code);

            // 获取输出
            const stdout = pyodide.runPython('sys.stdout.getvalue()');
            const stderr = pyodide.runPython('sys.stderr.getvalue()');

            if (stdout || stderr) {
                let output = stdout;
                if (stderr) {
                    output += (stdout ? '\n' : '') + stderr;
                }
                codeOutput.textContent = output;
                codeOutput.classList.remove('error');
            } else {
                codeOutput.innerHTML = '<span class="output-placeholder">代码执行完成，无输出</span>';
            }

            statusEl.textContent = '运行完成';
            statusEl.className = 'runner-status ready';
        } catch (err) {
            codeOutput.textContent = '❌ ' + err.message;
            codeOutput.classList.add('error');
            statusEl.textContent = '运行出错';
            statusEl.className = 'runner-status';
        }

        runBtn.disabled = false;

        // 3秒后清除状态
        setTimeout(() => {
            if (statusEl.classList.contains('ready')) {
                statusEl.textContent = '';
            }
        }, 3000);
    }
}
