/* ── CURSOR ── */
const ring = document.getElementById('cursor-ring');
const dot = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
(function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.project-card,.btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── SCROLL PROGRESS ── */
window.addEventListener('scroll', () => {
    const s = document.documentElement;
    const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    document.getElementById('scroll-bar').style.width = pct + '%';
});

/* ── PARTICLES ── */
(function () {
    const c = document.getElementById('particles');
    const ctx = c.getContext('2d');
    let W, H, pts = [];
    const N = 60;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < N; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.2 + .3 });
    let mouseX = W / 2, mouseY = H / 2;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(201,169,75,0.35)';
            ctx.fill();
        });
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(201,169,75,${.12 * (1 - d / 120)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
            // connect to mouse
            const dx = pts[i].x - mouseX, dy = pts[i].y - mouseY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 160) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(201,169,75,${.25 * (1 - d / 160)})`;
                ctx.lineWidth = .7;
                ctx.stroke();
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ── TERMINAL TYPING ── */
(function () {
    const lines = [
        'init portfolio.sh',
        'loading skills...',
        'AI · C++ · Automotive · Embedded',
        'ready. welcome.'
    ];
    const el = document.getElementById('typed-text');
    let li = 0, ci = 0, deleting = false, pause = 0;
    function type() {
        if (pause > 0) { pause--; setTimeout(type, 50); return; }
        const cur = lines[li];
        if (!deleting) {
            el.textContent = cur.slice(0, ++ci);
            if (ci === cur.length) { deleting = true; pause = 40; }
        } else {
            el.textContent = cur.slice(0, --ci);
            if (ci === 0) { deleting = false; li = (li + 1) % lines.length; pause = 8; }
        }
        setTimeout(type, deleting ? 30 : 70);
    }
    setTimeout(type, 1400);
})();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animCount(el, target, decimals, duration) {
    const start = performance.now();
    const step = t => {
        const p = Math.min((t - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (ease * target).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            const target = parseFloat(el.dataset.target);
            const dec = target % 1 !== 0 ? 1 : 0;
            animCount(el, target, dec, 1800);
            statObs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .3;
        const y = (e.clientY - r.top - r.height / 2) * .3;
        el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});