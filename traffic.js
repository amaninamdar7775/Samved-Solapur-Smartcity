/* ==============================
   TRAFFIC.JS — Dashboard logic
   ============================== */

// ─── Chart.js Polyfill (custom charts without library) ───
// Using canvas API directly for lightweight charts

// ─── Traffic Density Line Chart ───
function drawTrafficChart() {
    const canvas = document.getElementById('trafficChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const hours = ['6am', '7', '8', '9', '10', '11', '12', '1pm', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const akkalkot = [1200, 2800, 5200, 6800, 5400, 3800, 3200, 4100, 3600, 3900, 4500, 6200, 7800, 6400, 4200, 3000, 1800];
    const vijapur = [800, 2000, 4000, 5500, 4200, 3000, 2800, 3200, 3000, 3400, 4000, 5600, 7200, 5800, 3800, 2400, 1400];
    const station = [600, 1500, 3200, 4800, 3600, 2400, 2200, 2800, 2500, 2800, 3200, 4800, 6400, 5200, 3200, 2000, 1200];

    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 55 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const maxVal = 9000;

    ctx.clearRect(0, 0, W, H);

    // Grid
    for (let i = 0; i <= 5; i++) {
        const y = pad.top + (chartH / 5) * i;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(30,58,95,0.8)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(pad.left, y);
        ctx.lineTo(W - pad.right, y);
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(((maxVal / 5) * (5 - i) / 1000).toFixed(0) + 'k', pad.left - 6, y + 4);
    }
    ctx.setLineDash([]);

    // X labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    hours.forEach((h, i) => {
        const x = pad.left + (i / (hours.length - 1)) * chartW;
        ctx.fillText(h, x, H - pad.bottom + 12);
    });

    // Draw lines
    function drawLine(data, color, fillColor) {
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.left + (i / (data.length - 1)) * chartW;
            const y = pad.top + chartH - (v / maxVal) * chartH;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Fill
        ctx.lineTo(pad.left + chartW, pad.top + chartH);
        ctx.lineTo(pad.left, pad.top + chartH);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Points
        data.forEach((v, i) => {
            const x = pad.left + (i / (data.length - 1)) * chartW;
            const y = pad.top + chartH - (v / maxVal) * chartH;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    }

    drawLine(station, '#22c55e', 'rgba(34,197,94,0.04)');
    drawLine(vijapur, '#a855f7', 'rgba(168,85,247,0.06)');
    drawLine(akkalkot, '#00d4ff', 'rgba(0,212,255,0.08)');
}

// ─── Donut Chart ───
function drawDonut() {
    const svg = document.getElementById('donutChart');
    const legend = document.getElementById('donutLegend');
    if (!svg || !legend) return;

    const data = [
        { label: 'Commercial Zone', value: 38, color: '#ef4444' },
        { label: 'Residential', value: 24, color: '#f59e0b' },
        { label: 'Near Schools', value: 20, color: '#a855f7' },
        { label: 'Highway', value: 18, color: '#22c55e' },
    ];

    const cx = 80, cy = 80, r = 60, ir = 42;
    let startAngle = -Math.PI / 2;

    svg.innerHTML = '';
    data.forEach(d => {
        const angle = (d.value / 100) * Math.PI * 2;
        const endAngle = startAngle + angle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const xi1 = cx + ir * Math.cos(startAngle);
        const yi1 = cy + ir * Math.sin(startAngle);
        const xi2 = cx + ir * Math.cos(endAngle);
        const yi2 = cy + ir * Math.sin(endAngle);
        const large = angle > Math.PI ? 1 : 0;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`);
        path.setAttribute('fill', d.color);
        path.setAttribute('opacity', '0.85');
        svg.appendChild(path);
        startAngle = endAngle;
    });

    // Legend
    legend.innerHTML = data.map(d => `
    <div class="donut-legend-item">
      <div class="donut-legend-dot" style="background:${d.color}"></div>
      <span class="donut-legend-label">${d.label}</span>
      <span class="donut-legend-val" style="margin-left:.5rem;color:${d.color}">${d.value}%</span>
    </div>
  `).join('');
}

// ─── Heatmap ───
function drawHeatmap() {
    const svg = document.getElementById('heatmapSVG');
    if (!svg) return;

    const zones = [
        // [x, y, w, h, intensity, label]
        [20, 20, 180, 60, 'high', 'Hutatma Chowk'],
        [220, 20, 140, 60, 'medium', 'S.T. Stand Area'],
        [380, 20, 160, 60, 'low', 'North Bypass'],
        [560, 20, 120, 60, 'low', 'Bijapur Rd'],
        [20, 100, 120, 60, 'medium', 'Hotgi Road'],
        [160, 100, 180, 60, 'high', 'Akkalkot Road'],
        [360, 100, 160, 60, 'medium', 'Vijapur Road'],
        [540, 100, 140, 60, 'low', 'Solapur-Pune HW'],
        [20, 180, 160, 60, 'low', 'Osmanabad Rd'],
        [200, 180, 200, 60, 'high', 'Station Road'],
        [420, 180, 140, 60, 'medium', 'Chincholi Rd'],
        [580, 180, 100, 60, 'low', 'Ring Road'],
        [20, 260, 220, 60, 'medium', 'Bhigwan Road'],
        [260, 260, 200, 60, 'low', 'Industrial Area'],
        [480, 260, 200, 60, 'high', 'Market Area'],
    ];

    const colors = {
        low: { fill: 'rgba(34,197,94,0.25)', stroke: '#22c55e' },
        medium: { fill: 'rgba(245,158,11,0.3)', stroke: '#f59e0b' },
        high: { fill: 'rgba(239,68,68,0.35)', stroke: '#ef4444' }
    };

    svg.innerHTML = `
    <defs>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- Grid lines -->
    ${[20, 80, 140, 200, 260, 320].map(y => `<line x1="0" y1="${y}" x2="700" y2="${y}" stroke="rgba(30,58,95,0.3)" stroke-width="1"/>`).join('')}
    ${[0, 100, 200, 300, 400, 500, 600].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="340" stroke="rgba(30,58,95,0.3)" stroke-width="1"/>`).join('')}
    <!-- Road lines -->
    <line x1="0" y1="160" x2="700" y2="160" stroke="#1e3a5f" stroke-width="4"/>
    <line x1="350" y1="0" x2="350" y2="340" stroke="#1e3a5f" stroke-width="4"/>
    <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(245,158,11,0.3)" stroke-width="1" stroke-dasharray="15,10"/>
    <line x1="350" y1="0" x2="350" y2="340" stroke="rgba(245,158,11,0.3)" stroke-width="1" stroke-dasharray="15,10"/>
  `;

    zones.forEach(([x, y, w, h, intensity, label]) => {
        const c = colors[intensity];
        const rx = x + 4, ry = y + 4;
        svg.innerHTML += `
      <rect x="${rx}" y="${ry}" width="${w - 8}" height="${h - 8}" rx="6" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" class="heat-zone" filter="url(#glow)">
        <title>${label} — ${intensity.toUpperCase()} congestion</title>
      </rect>
      <text x="${rx + (w - 8) / 2}" y="${ry + (h - 8) / 2 + 3}" text-anchor="middle" class="heat-label" fill="rgba(255,255,255,0.8)">${label}</text>
    `;
    });

    // Add signal points
    const signals = [[350, 160], [200, 160], [500, 160], [350, 80], [350, 250]];
    signals.forEach(([x, y]) => {
        svg.innerHTML += `
      <circle cx="${x}" cy="${y}" r="6" fill="#f59e0b" stroke="white" stroke-width="1.5"/>
      <circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.5">
        <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
    `;
    });
}

// ─── Pollution Chart ───
function drawPollutionChart() {
    const canvas = document.getElementById('pollutionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 80;

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const pm25 = hours.map(h => 20 + Math.sin(h * 0.4) * 15 + (h > 7 && h < 11 ? 20 : 0) + (h > 16 && h < 20 ? 18 : 0) + Math.random() * 5);

    const W = canvas.width, H = canvas.height;
    const pad = { top: 8, right: 10, bottom: 20, left: 40 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const maxVal = 70;

    ctx.clearRect(0, 0, W, H);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(245,158,11,0.4)');
    grad.addColorStop(1, 'rgba(245,158,11,0)');

    ctx.beginPath();
    pm25.forEach((v, i) => {
        const x = pad.left + (i / (pm25.length - 1)) * chartW;
        const y = pad.top + chartH - (v / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(pad.left + chartW, pad.top + chartH);
    ctx.lineTo(pad.left, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px Inter';
    ['12am', '6am', '12pm', '6pm', '11pm'].forEach((label, i) => {
        const x = pad.left + (i / 4) * chartW;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, H - 2);
    });
    ctx.textAlign = 'right';
    ctx.fillText('70', pad.left - 4, pad.top + 10);
    ctx.fillText('0', pad.left - 4, pad.top + chartH);
}

// ─── Peak Prediction Chart ───
function drawPredictionChart() {
    const canvas = document.getElementById('predictionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 120;

    const hours = Array.from({ length: 25 }, (_, i) => i);
    const actual = [15, 12, 10, 8, 8, 10, 18, 45, 72, 85, 68, 45, 38, 35, 38, 42, 55, 78, 82, 70, 52, 38, 28, 18, 12];
    const predicted = [16, 13, 11, 9, 9, 11, 20, 48, 70, 82, 65, 42, 36, 33, 36, 44, 58, 80, 84, 72, 54, 40, 30, 20, 14];

    const W = canvas.width, H = canvas.height;
    const pad = { top: 10, right: 20, bottom: 30, left: 45 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const maxVal = 100;

    ctx.clearRect(0, 0, W, H);

    // Background zones
    const zones = [
        { start: 7, end: 10, color: 'rgba(239,68,68,0.08)' },
        { start: 16, end: 20, color: 'rgba(245,158,11,0.08)' },
    ];
    zones.forEach(z => {
        const x1 = pad.left + (z.start / 24) * chartW;
        const x2 = pad.left + (z.end / 24) * chartW;
        ctx.fillStyle = z.color;
        ctx.fillRect(x1, pad.top, x2 - x1, chartH);
    });

    // Grid
    [0, 25, 50, 75, 100].forEach(v => {
        const y = pad.top + chartH - (v / maxVal) * chartH;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(30,58,95,0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y);
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(v + '%', pad.left - 4, y + 3);
    });
    ctx.setLineDash([]);

    // X labels
    [0, 4, 8, 12, 16, 20, 24].forEach(h => {
        const x = pad.left + (h / 24) * chartW;
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(h === 0 ? '12am' : h === 12 ? '12pm' : h === 24 ? '12am' : `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`, x, H - 4);
    });

    // Predicted (dashed)
    ctx.beginPath();
    predicted.forEach((v, i) => {
        const x = pad.left + (i / (predicted.length - 1)) * chartW;
        const y = pad.top + chartH - (v / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(168,85,247,0.5)');
    grad.addColorStop(1, 'rgba(168,85,247,0)');

    ctx.beginPath();
    actual.forEach((v, i) => {
        const x = pad.left + (i / (actual.length - 1)) * chartW;
        const y = pad.top + chartH - (v / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(pad.left + chartW, pad.top + chartH);
    ctx.lineTo(pad.left, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
}

// ─── Signal Cards ───
const junctions = [
    { name: 'Hutatma Chowk', state: 'red', timer: 32, density: 'High', vehicles: 245 },
    { name: 'Akkalkot Road', state: 'green', timer: 18, density: 'High', vehicles: 312 },
    { name: 'Vijapur Road', state: 'yellow', timer: 5, density: 'Medium', vehicles: 187 },
    { name: 'Station Road', state: 'red', timer: 24, density: 'Medium', vehicles: 203 },
    { name: 'Hotgi Road', state: 'green', timer: 35, density: 'Low', vehicles: 98 },
    { name: 'Osmanabad Rd', state: 'green', timer: 27, density: 'Low', vehicles: 74 },
];

function renderSignals() {
    const grid = document.getElementById('signalsGrid');
    if (!grid) return;
    grid.innerHTML = junctions.map(j => `
    <div class="signal-card">
      <div class="signal-post">
        <div class="sig-light r ${j.state === 'red' ? 'active-r' : ''}"></div>
        <div class="sig-light y ${j.state === 'yellow' ? 'active-y' : ''}"></div>
        <div class="sig-light g ${j.state === 'green' ? 'active-g' : ''}"></div>
      </div>
      <div class="signal-name">${j.name}</div>
      <div class="signal-timer ${j.state}">${j.timer}s</div>
      <div class="signal-info">${j.density} traffic · ${j.vehicles} veh/hr</div>
    </div>
  `).join('');
}

// ─── Alert Feed ───
const alerts = [
    { type: 'critical', icon: '🚨', title: 'Accident Alert — Vijapur Road km 4', desc: 'Minor collision reported. Emergency services dispatched. Expect 20 min delay.', time: '2 min ago' },
    { type: 'warning', icon: '⚠️', title: 'Heavy Congestion — Station Road', desc: 'Traffic backed up 1.2 km near Railway Station. Alternate: Bhigwan Road.', time: '5 min ago' },
    { type: 'info', icon: '🚦', title: 'Signal Override — Hutatma Chowk', desc: 'AI has extended green phase by 15s due to high north-bound traffic density.', time: '8 min ago' },
    { type: 'success', icon: '✅', title: 'Congestion Cleared — Akkalkot Road', desc: 'Traffic flow restored to normal. Average speed: 42 km/h.', time: '12 min ago' },
    { type: 'warning', icon: '🏗️', title: 'Road Work Notice — Hotgi Road km 2', desc: 'Single-lane traffic active until 18:00. Allow extra 8 min.', time: '1 hr ago' },
];

function renderAlerts() {
    const feed = document.getElementById('alertFeed');
    if (!feed) return;
    feed.innerHTML = alerts.map(a => `
    <div class="alert-item ${a.type}">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
      <div class="alert-time">${a.time}</div>
    </div>
  `).join('');
    // Update badge
    const badge = document.getElementById('alertBadge');
    if (badge) badge.textContent = alerts.filter(a => a.type === 'critical' || a.type === 'warning').length;
}

window.clearAlerts = function () {
    const feed = document.getElementById('alertFeed');
    if (feed) feed.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:2rem;font-size:.875rem">✅ All alerts cleared</div>';
};

// ─── Violation Feed ───
const violations = [
    { plate: 'MH-13-AB-1234', type: 'Red Light Jump', loc: 'Hutatma Chowk', time: '09:14' },
    { plate: 'MH-13-CD-5678', type: 'Wrong Direction', loc: 'Station Road', time: '09:22' },
    { plate: 'MH-14-EF-9012', type: 'Speeding 78km/h', loc: 'Vijapur Road', time: '09:31' },
];

function renderViolations() {
    const feed = document.getElementById('violationFeed');
    if (!feed) return;
    feed.innerHTML = violations.map(v => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem .6rem;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.15);border-radius:6px">
      <span style="font-family:monospace;color:#ef4444;font-size:.8rem;font-weight:700">${v.plate}</span>
      <span style="color:var(--text-muted);flex:1;margin:0 .5rem">${v.type}</span>
      <span style="color:var(--text-muted);font-size:.7rem">${v.time}</span>
    </div>
  `).join('');
}

// ─── AI Toggle ───
window.toggleAI = function (el, type) {
    el.classList.toggle('on');
    const isOn = el.classList.contains('on');
    const labels = {
        adaptive: document.getElementById('adaptiveLabel'),
        emergency: document.getElementById('emergencyLabel'),
        violation: document.getElementById('violationLabel'),
    };
    const texts = {
        adaptive: isOn ? 'Enabled — 31 signals' : 'Disabled',
        emergency: isOn ? 'Active — Monitoring GPS' : 'Disabled',
        violation: isOn ? 'Active — 64 cameras' : 'Disabled',
    };
    if (labels[type]) labels[type].textContent = texts[type];
    showToast(isOn ? `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} control enabled` : `⚠️ ${type} control disabled`, isOn ? 'success' : 'warning');
};

window.simulateEmergency = function () {
    showToast('🚑 Emergency vehicle detected at Station Road — Clearing signal corridor...', 'danger');
    setTimeout(() => showToast('✅ Green corridor activated: Station Rd → Vijapur Rd → Hospital (4 min ETA)', 'success'), 2000);
};

// ─── Section Navigation ───
window.showSection = function (section, btn) {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    btn.classList.add('active');
};

// ─── Live KPI Updates ───
function updateKPIs() {
    const vehicleEl = document.getElementById('kpiVehiclesVal');
    if (vehicleEl) {
        const base = 8000 + Math.floor(Math.random() * 1000);
        vehicleEl.textContent = base.toLocaleString();
    }
    const waitEl = document.getElementById('kpiWaitVal');
    if (waitEl) {
        const wait = (3.8 + Math.random() * 1.2).toFixed(1);
        waitEl.innerHTML = `${wait}<span style="font-size:1rem">min</span>`;
    }
    const aqiEl = document.getElementById('kpiAQIVal');
    if (aqiEl) {
        aqiEl.textContent = Math.floor(82 + Math.random() * 12);
    }

    // Pollution gauges
    const pm25 = Math.floor(28 + Math.random() * 15);
    const pm10 = Math.floor(55 + Math.random() * 18);
    const no2 = Math.floor(42 + Math.random() * 15);
    ['pm25Val', 'pm10Val', 'no2Val'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = [pm25, pm10, no2][i];
    });
    ['pm25Bar', 'pm10Bar', 'no2Bar'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.style.width = ([pm25 / 60, pm10 / 150, no2 / 75][i] * 100).toFixed(0) + '%';
    });
}

// ─── Signal Timer Countdown ───
function tickSignals() {
    junctions.forEach(j => {
        j.timer--;
        if (j.timer <= 0) {
            if (j.state === 'green') { j.state = 'yellow'; j.timer = 5; }
            else if (j.state === 'yellow') { j.state = 'red'; j.timer = Math.floor(20 + Math.random() * 25); }
            else { j.state = 'green'; j.timer = Math.floor(20 + Math.random() * 30); }
        }
    });
    renderSignals();
}

// ─── Optimization bar animation ───
function animateOptimScore() {
    const bar = document.getElementById('optimScoreBar');
    if (!bar) return;
    const val = 72 + Math.floor(Math.random() * 12);
    bar.style.width = val + '%';
}

// ─── Init ───
(function init() {
    drawTrafficChart();
    drawDonut();
    drawHeatmap();
    drawPollutionChart();
    drawPredictionChart();
    renderSignals();
    renderAlerts();
    renderViolations();

    // Update charts on resize
    window.addEventListener('resize', () => {
        drawTrafficChart();
        drawPollutionChart();
        drawPredictionChart();
    });

    // Live updates
    setInterval(updateKPIs, 5000);
    setInterval(tickSignals, 1000);
    setInterval(animateOptimScore, 4000);

    // Add new violation periodically
    const extraViolations = [
        { plate: 'MH-13-GH-3456', type: 'Illegal Parking', loc: 'Station Road', time: '' },
        { plate: 'MH-22-IJ-7890', type: 'Red Light Jump', loc: 'Hotgi Road', time: '' },
    ];
    let vIdx = 0;
    setInterval(() => {
        const now = new Date();
        const newV = { ...extraViolations[vIdx % extraViolations.length], time: now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') };
        violations.unshift(newV);
        if (violations.length > 6) violations.pop();
        renderViolations();
        vIdx++;
    }, 15000);
})();
