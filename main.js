/* ==============================
   MAIN.JS — Global functionality
   ============================== */

// ─── Theme Toggle ───
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!moonIcon || !sunIcon) return;
  if (theme === 'dark') { moonIcon.style.display = ''; sunIcon.style.display = 'none'; }
  else { moonIcon.style.display = 'none'; sunIcon.style.display = ''; }
}

// ─── Hamburger Menu ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close nav on link click
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
  });
});

// ─── Navbar Scroll Effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');
});

// ─── Active Nav Link ───
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'nav-home',
    'traffic.html': 'nav-traffic',
    'parking.html': 'nav-parking',
    'analytics.html': 'nav-analytics',
    'admin.html': 'nav-admin',
    'citizen.html': 'nav-citizen',
    'about.html': 'nav-about',
    '': 'nav-home'
  };
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const targetId = map[page];
  if (targetId) document.getElementById(targetId)?.classList.add('active');
})();

// ─── SOS ───
const sosBtn = document.getElementById('sosBtn');
const sosModal = document.getElementById('sosModal');

sosBtn?.addEventListener('click', openSOS);
sosModal?.addEventListener('click', (e) => { if (e.target === sosModal) closeSOS(); });

function openSOS() {
  sosModal?.classList.add('active');
  showToast('🚨 Emergency SOS activated! Contacting authorities...', 'danger');
}
window.closeSOS = function() {
  sosModal?.classList.remove('active');
};
window.callEmergency = function() {
  showToast('📞 Connecting to Emergency Services (112)...', 'info');
  setTimeout(() => closeSOS(), 1500);
};

// ─── Toast System ───
window.showToast = function(msg, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '🚨' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ─── Chatbot ───
const chatbotWidget = document.getElementById('chatbotWidget');
const chatBadge = document.getElementById('chatBadge');

window.toggleChatbot = function() {
  chatbotWidget?.classList.toggle('open');
  if (chatBadge) chatBadge.style.display = 'none';
};

const botResponses = {
  'traffic': 'Current traffic on Solapur-Pune Highway: MODERATE. Hotspot: Akkalkot Road junction — 12 min delay. Suggest using Vijapur Road as alternate.',
  'parking': 'Nearest available parking: Super Market Parking (28 free slots) — 0.4 km. SMC Parking Zone B (42 free) — 0.7 km. Want me to book a slot?',
  'route': 'Best route: Solapur Station → Dagadmal → Osmanabad Road → Destination. Estimated time: 14 min. Avoid: Hutatma Chowk (heavy congestion).',
  'congestion': 'High congestion detected at: 1) Hutatma Chowk, 2) Vijapur Road, 3) Railway Station Road. Signal optimization in progress.',
  'accident': '⚠️ Accident reported near Bhuinj Road at 09:23 AM. Emergency services dispatched. Route being redirected via Bhigwan Road.',
  'pollution': 'Current AQI in Solapur: 87 (Moderate). PM2.5: 34 µg/m³. Area with highest pollution: Industrial Area, Hotgi Road.',
  'signal': 'Signal status: 31 of 34 signals operating normally. 3 signals on adaptive AI mode due to peak hour. Avg wait time reduced by 28% today.',
  'default': 'I can help with: traffic status, parking availability, route suggestions, congestion updates, and accident alerts. What would you like to know?'
};

window.sendChat = function() {
  const input = document.getElementById('chatInput');
  if (!input?.value.trim()) return;
  addChatMessage(input.value, 'user');
  const query = input.value.toLowerCase();
  input.value = '';
  setTimeout(() => {
    let response = botResponses.default;
    for (const [key, val] of Object.entries(botResponses)) {
      if (query.includes(key)) { response = val; break; }
    }
    addChatMessage(response, 'bot');
  }, 800);
};

window.quickReply = function(text) {
  const input = document.getElementById('chatInput');
  if (input) input.value = text;
  sendChat();
};

window.chatEnter = function(e) { if (e.key === 'Enter') sendChat(); };

function addChatMessage(text, role) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ─── Intersection Observer (scroll animations) ───
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.feature-card, .iot-card, .kpi-card, .chart-card, .signal-card, .park-stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ─── Real-time Clock ───
function updateClock() {
  const clocks = document.querySelectorAll('.live-clock');
  const now = new Date();
  const str = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  clocks.forEach(c => c.textContent = str);
}
setInterval(updateClock, 1000);
updateClock();

// ─── Simulated Notification System ───
const notifications = [
  { msg: '🚦 Signal at Hutatma Chowk switched to adaptive mode', type: 'info' },
  { msg: '🚗 Congestion detected on Akkalkot Road — 8 min delay', type: 'warning' },
  { msg: '✅ Parking Zone A fully operational', type: 'success' },
  { msg: '⚠️ Air quality moderate near Industrial Area', type: 'warning' },
  { msg: '🚨 Accident alert: Vijapur Road km 4 — Emergency dispatched', type: 'danger' },
  { msg: '📡 Sensor update: 23 new IoT nodes synced', type: 'info' },
];
let notifIdx = 0;
setTimeout(() => {
  const cycleNotif = () => {
    showToast(notifications[notifIdx % notifications.length].msg, notifications[notifIdx % notifications.length].type);
    notifIdx++;
  };
  cycleNotif();
  setInterval(cycleNotif, 12000);
}, 4000);

// ─── Tab System ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const parent = this.closest('.tabs');
    parent?.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    // Show/hide panels
    const target = this.dataset.tab;
    if (target) {
      const panels = document.querySelectorAll('[data-panel]');
      panels.forEach(p => p.style.display = p.dataset.panel === target ? '' : 'none');
    }
  });
});
