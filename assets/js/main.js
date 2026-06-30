const contactLinks = document.querySelectorAll('#contact .contact-link');
const contactLinksWrap = document.querySelector('.contact-links');
if (contactLinks.length && contactLinksWrap && 'IntersectionObserver' in window) {
    contactLinksWrap.classList.add('reveal-init');
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.prototype.indexOf.call(contactLinks, entry.target);
                setTimeout(() => entry.target.classList.add('is-visible'), index * 120);
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    contactLinks.forEach((link) => contactObserver.observe(link));
}

const header = document.querySelector('.site-header');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.from(navAnchors).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = '#' + section.id;
        }
    });

    navAnchors.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === current);
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

(function () {
    const canvas = document.querySelector('.hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, ovalLeft, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        ovalLeft = W * 0.62;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function createParticle() {
        let x;
        do { x = rand(0, W); } while (x > ovalLeft);
        return {
            x,
            y: rand(H * 0.4, H),
            size: rand(0.4, 1.4),
            speedY: rand(0.25, 0.7),
            speedX: rand(-0.18, 0.18),
            opacity: rand(0.18, 0.55),
            life: 0,
            maxLife: rand(130, 300),
            flicker: rand(0, Math.PI * 2),
        };
    }

    for (let i = 0; i < 80; i++) {
        const p = createParticle();
        p.life = rand(0, p.maxLife);
        particles.push(p);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            p.life++;
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.life * 0.035 + p.flicker) * 0.15;
            p.flicker += 0.035;

            const progress = p.life / p.maxLife;
            const fadeIn = Math.min(progress * 5, 1);
            const fadeOut = Math.max(1 - (progress - 0.65) * 2.8, 0);
            const alpha = p.opacity * fadeIn * fadeOut;

            const r = p.size * 1.8;
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            grad.addColorStop(0,   `rgba(255, 175, 90,  ${alpha})`);
            grad.addColorStop(0.45,`rgba(255, 130, 40,  ${alpha * 0.5})`);
            grad.addColorStop(1,   `rgba(255, 100, 10,  0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            if (p.life >= p.maxLife || p.x > ovalLeft) {
                particles[i] = createParticle();
                particles[i].life = 0;
            }
        });

        requestAnimationFrame(draw);
    }

    draw();
})();

const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('is-visible', window.scrollY > 320);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const scrollProgressEl = document.getElementById('scrollProgress');
if (scrollProgressEl) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgressEl.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
}

(function () {
    const canvas = document.querySelector('.contact-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(a, b) { return a + Math.random() * (b - a); }

    function createPt() {
        return {
            x: rand(0, W),
            y: rand(H * 0.3, H),
            size: rand(0.4, 1.3),
            vy: rand(0.28, 0.72),
            vx: rand(-0.18, 0.18),
            opacity: rand(0.18, 0.52),
            life: 0,
            maxLife: rand(130, 300),
            flicker: rand(0, Math.PI * 2),
        };
    }

    for (let i = 0; i < 70; i++) {
        const p = createPt();
        p.life = rand(0, p.maxLife);
        pts.push(p);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach((p, i) => {
            p.life++;
            p.y -= p.vy;
            p.x += p.vx + Math.sin(p.flicker + p.life * 0.035) * 0.15;
            p.flicker += 0.035;

            const progress = p.life / p.maxLife;
            const fadeIn = Math.min(progress * 5, 1);
            const fadeOut = Math.max(1 - (progress - 0.65) * 2.8, 0);
            const alpha = p.opacity * fadeIn * fadeOut;
            const r = p.size * 1.8;

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            g.addColorStop(0,    `rgba(255, 185, 80,  ${alpha})`);
            g.addColorStop(0.45, `rgba(255, 120, 30,  ${alpha * 0.5})`);
            g.addColorStop(1,    `rgba(200, 60,  10,  0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            if (p.life >= p.maxLife) {
                pts[i] = createPt();
                pts[i].life = 0;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

(function () {
    const canvas = document.querySelector('.bonfire-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const zone = canvas.parentElement;
    let W, H, embers = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function createEmber() {
        const startY = rand(0.9, 1.04);
        return {
            x: rand(0.25, 0.75),
            y: startY,
            startY,
            topY: rand(0.3, 0.72),
            size: rand(0.5, 1.8),
            speed: rand(0.0007, 0.0017),
            drift: rand(-0.0005, 0.0005),
            flicker: rand(0, Math.PI * 2),
            opacity: rand(0.45, 1),
        };
    }

    function resize() {
        W = canvas.width = zone.offsetWidth;
        H = canvas.height = zone.offsetHeight;
    }

    function init() {
        embers = [];
        const count = Math.min(Math.round(W / 10), 200);
        for (let i = 0; i < count; i++) {
            const e = createEmber();
            e.y = rand(e.topY, e.startY);
            embers.push(e);
        }
    }

    resize();
    init();
    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

    let t = 0;
    function draw() {
        t += 1;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';

        embers.forEach((e, i) => {
            e.y -= e.speed;
            e.x += e.drift + Math.sin(e.flicker + e.y * 14) * 0.0005;
            e.flicker += 0.045;

            const range = e.startY - e.topY;
            const traveled = (e.startY - e.y) / range;
            const fade = Math.sin(Math.min(Math.max(traveled, 0), 1) * Math.PI);
            const hf = Math.min(Math.max((e.y - 0.55) / 0.45, 0), 1);
            const alpha = e.opacity * fade * (0.3 + hf * 0.7);

            if (alpha > 0.01) {
                const px = e.x * W, py = e.y * H, r = e.size * (0.8 + hf * 1.6);
                const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.4);
                grad.addColorStop(0, `rgba(255, 225, 150, ${alpha})`);
                grad.addColorStop(0.4, `rgba(255, 140, 45, ${alpha * 0.6})`);
                grad.addColorStop(1, 'rgba(220, 60, 10, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, r * 2.4, 0, Math.PI * 2);
                ctx.fill();
            }

            if (e.y <= e.topY) embers[i] = createEmber();
        });

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(draw);
    }
    draw();
})();

let openAboutModal = function () {};

(function () {
    const btn = document.getElementById('aboutBtn');
    const overlay = document.getElementById('aboutOverlay');
    const closeBtn = document.getElementById('aboutClose');
    if (!btn || !overlay || !closeBtn) return;

    function openAbout() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function closeAbout() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        btn.focus();
    }

    btn.addEventListener('click', openAbout);
    closeBtn.addEventListener('click', closeAbout);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeAbout();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeAbout();
    });

    openAboutModal = openAbout;
})();

(function () {
    const toggle = document.getElementById('mobileMenuToggle');
    const panel = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (!toggle || !panel || !backdrop) return;

    function openMenu() {
        panel.classList.add('is-open');
        backdrop.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-locked');
    }

    function closeMenu() {
        panel.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-locked');
    }

    toggle.addEventListener('click', function () {
        if (panel.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) closeMenu();
    });

    panel.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    const aboutItem = document.getElementById('mobileMenuAbout');
    if (aboutItem) {
        aboutItem.addEventListener('click', function (e) {
            e.preventDefault();
            closeMenu();
            setTimeout(openAboutModal, 320);
        });
    }
})();