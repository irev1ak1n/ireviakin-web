const countups = document.querySelectorAll('.countup');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 1200;
            const step = Math.ceil(duration / target);
            let current = 0;
            const timer = setInterval(() => {
                current++;
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, step);
            observer.unobserve(el);
        }
    });
}, { threshold: 0.5 });

countups.forEach(el => observer.observe(el));

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