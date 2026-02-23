/* ==============================
   HOME.JS — Homepage interactions
   ============================== */

// ─── Particle System ───
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 30;
    const colors = ['#00d4ff', '#7c3aed', '#a855f7', '#22c55e', '#f59e0b'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 5}s;
    `;
        container.appendChild(p);
    }
})();

// ─── Counter Animation ───
function animateCounter(el, target, suffix = '') {
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-num').forEach(el => {
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.target.includes('%') ? '%' : '+';
                animateCounter(el, target, target === 98 ? '%' : '+');
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── IoT Card live updates ───
const iotCards = document.querySelectorAll('.iot-card');
setInterval(() => {
    iotCards.forEach(card => {
        const fill = card.querySelector('.iot-fill');
        if (!fill || card.querySelector('.warning')) return;
        const base = parseInt(fill.style.width);
        const wobble = (Math.random() - 0.5) * 3;
        fill.style.width = Math.max(85, Math.min(100, base + wobble)) + '%';
    });
}, 3000);

// ─── Smart City Pulse on SVG ───
let signalCycle = 0;
setInterval(() => {
    signalCycle = (signalCycle + 1) % 3;
    const redSignal = document.querySelector('.signal-red');
    const greenSignal = document.querySelector('.signal-green');
    if (!redSignal || !greenSignal) return;
    if (signalCycle === 0) {
        redSignal.style.fill = '#ef4444';
        greenSignal.style.fill = '#166534';
    } else if (signalCycle === 1) {
        redSignal.style.fill = '#7f1d1d';
        greenSignal.style.fill = '#f59e0b';
    } else {
        redSignal.style.fill = '#7f1d1d';
        greenSignal.style.fill = '#22c55e';
    }
}, 3000);
