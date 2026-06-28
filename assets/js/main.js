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