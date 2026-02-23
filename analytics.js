/* ==============================
   ANALYTICS.JS
   ============================== */

// ─── Traffic Trend Chart (30 days) ───
function drawTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 35, left: 55 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const days = 30;
    const thisMonth = Array.from({ length: days }, (_, i) => 60000 + Math.sin(i * 0.4) * 8000 + Math.random() * 5000 + (i > 20 ? 5000 : 0));
    const lastMonth = Array.from({ length: days }, (_, i) => 55000 + Math.sin(i * 0.35) * 7000 + Math.random() * 4000);
    const maxVal = Math.max(...thisMonth, ...lastMonth) * 1.1;

    ctx.clearRect(0, 0, W, H);

    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        ctx.beginPath(); ctx.strokeStyle = 'rgba(30,58,95,0.8)'; ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
        ctx.fillText(((maxVal / 4) * (4 - i) / 1000).toFixed(0) + 'k', pad.left - 6, y + 4);
    }
    ctx.setLineDash([]);

    // X labels (week labels)
    for (let w = 0; w <= 4; w++) {
        const x = pad.left + (w / 4) * chartW;
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
        ctx.fillText(`W${w + 1}`, x, H - 5);
    }

    // Last month (filled)
    const grad2 = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad2.addColorStop(0, 'rgba(124,58,237,0.25)');
    grad2.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.beginPath();
    lastMonth.forEach((v, i) => {
        const x = pad.left + (i / (days - 1)) * chartW;
        const y = pad.top + chartH - (v / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.lineTo(pad.left + chartW, pad.top + chartH); ctx.lineTo(pad.left, pad.top + chartH); ctx.closePath();
    ctx.fillStyle = grad2; ctx.fill();

    // This month (filled)
    const grad1 = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad1.addColorStop(0, 'rgba(0,212,255,0.3)');
    grad1.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.beginPath();
    thisMonth.forEach((v, i) => {
        const x = pad.left + (i / (days - 1)) * chartW;
        const y = pad.top + chartH - (v / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.lineTo(pad.left + chartW, pad.top + chartH); ctx.lineTo(pad.left, pad.top + chartH); ctx.closePath();
    ctx.fillStyle = grad1; ctx.fill();
}

// ─── Congestion Bar Chart ───
function drawCongestionBars() {
    const canvas = document.getElementById('congestionBarChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 60, left: 55 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const spots = [
        { name: 'Hutatma', score: 84 },
        { name: 'Station Rd', score: 76 },
        { name: 'Akkalkot', score: 71 },
        { name: 'Vijapur', score: 63 },
        { name: 'Hotgi Rd', score: 48 },
        { name: 'Osmanabad', score: 35 },
    ];

    ctx.clearRect(0, 0, W, H);

    // Y grid
    [0, 25, 50, 75, 100].forEach(v => {
        const y = pad.top + chartH - (v / 100) * chartH;
        ctx.beginPath(); ctx.strokeStyle = 'rgba(30,58,95,0.8)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter'; ctx.textAlign = 'right';
        ctx.fillText(v + '%', pad.left - 5, y + 3);
    });
    ctx.setLineDash([]);

    const barW = (chartW / spots.length) * 0.55;
    const gap = (chartW / spots.length) * 0.45;

    spots.forEach((s, i) => {
        const x = pad.left + i * (barW + gap) + gap / 2;
        const bH = (s.score / 100) * chartH;
        const y = pad.top + chartH - bH;
        const color = s.score > 70 ? '#ef4444' : s.score > 50 ? '#f59e0b' : '#22c55e';

        const grad = ctx.createLinearGradient(0, y, 0, pad.top + chartH);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '44');

        ctx.beginPath();
        ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]);
        ctx.fillStyle = grad; ctx.fill();

        // Value label
        ctx.fillStyle = color; ctx.font = '10px Inter'; ctx.textAlign = 'center';
        ctx.fillText(s.score, x + barW / 2, y - 5);

        // X label
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter';
        ctx.fillText(s.name, x + barW / 2, H - 8);
    });
}

// ─── Event Chart ───
function drawEventChart() {
    const canvas = document.getElementById('eventChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 180;

    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Normal + festival peaks
    const normal = [58, 62, 65, 68, 72, 70, 68, 65, 70, 85, 90, 80];
    const festival = [58, 65, 68, 90, 72, 70, 68, 65, 88, 120, 140, 95]; // festivals in Apr, Sep, Oct, Nov

    ctx.clearRect(0, 0, W, H);
    const maxVal = 160;

    // Festival background zones
    [3, 8, 9, 10].forEach(mi => {
        const x = pad.left + (mi / 11) * chartW;
        const w = chartW / 11;
        ctx.fillStyle = 'rgba(245,158,11,0.06)';
        ctx.fillRect(x, pad.top, w, chartH);
    });

    // Grid
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        ctx.beginPath(); ctx.strokeStyle = 'rgba(30,58,95,0.6)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter'; ctx.textAlign = 'right';
        ctx.fillText(((maxVal / 4) * (4 - i)).toFixed(0) + 'k', pad.left - 4, y + 3);
    }
    ctx.setLineDash([]);

    // Draw normal line
    const drawLine2 = (data, color) => {
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.left + (i / 11) * chartW;
            const y = pad.top + chartH - (v / maxVal) * chartH;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
    };

    const drawFill = (data, color) => {
        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
        grad.addColorStop(0, color + '55'); grad.addColorStop(1, color + '08');
        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.left + (i / 11) * chartW;
            const y = pad.top + chartH - (v / maxVal) * chartH;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
        ctx.lineTo(pad.left + chartW, pad.top + chartH); ctx.lineTo(pad.left, pad.top + chartH); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
    };

    drawLine2(normal, '#7c3aed');
    drawFill(festival, '#f59e0b');

    months.forEach((m, i) => {
        const x = pad.left + (i / 11) * chartW;
        ctx.fillStyle = '#64748b'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
        ctx.fillText(m, x, H - 5);
    });
}

// ─── Event List ───
window.renderEventList = function () {
    const el = document.getElementById('eventList');
    if (!el) return;
    const events = [
        { name: 'Siddeshwar Yatra', date: 'Feb 25–28', impact: '+65%', color: '#ef4444' },
        { name: 'Holi – Market surge', date: 'Mar 14', impact: '+42%', color: '#f59e0b' },
        { name: 'Ugadi Festival', date: 'Mar 30', impact: '+38%', color: '#f59e0b' },
        { name: 'Diwali Week', date: 'Oct 20–27', impact: '+90%', color: '#ef4444' },
    ];
    el.innerHTML = events.map(e => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:.65rem;background:var(--bg-secondary);border-radius:10px">
      <div>
        <div style="font-size:.85rem;font-weight:600">${e.name}</div>
        <div style="font-size:.75rem;color:var(--text-muted)">${e.date}</div>
      </div>
      <span style="color:${e.color};font-weight:700;font-size:.85rem">${e.impact} traffic</span>
    </div>
  `).join('');
};

// ─── Historical Table ───
function renderHistoryTable() {
    const tbody = document.getElementById('historyBody');
    if (!tbody) return;
    const rows = [];
    const junctions = ['Hutatma Chowk', 'Station Road', 'Akkalkot Road', 'Vijapur Road', 'Hotgi Road'];
    for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        rows.push({
            date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
            junction: junctions[i % junctions.length],
            peak: (6000 + Math.floor(Math.random() * 4000)).toLocaleString(),
            wait: (3 + Math.random() * 4).toFixed(1) + 'min',
            incidents: Math.floor(Math.random() * 5),
            efficiency: (70 + Math.random() * 25).toFixed(0) + '%',
            status: Math.random() > 0.2 ? 'Normal' : (Math.random() > 0.5 ? 'Peak' : 'Alert'),
        });
    }
    tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.junction}</td>
      <td style="color:var(--accent-cyan);font-family:var(--font-display)">${r.peak}</td>
      <td>${r.wait}</td>
      <td style="color:${r.incidents > 3 ? 'var(--accent-red)' : 'var(--accent-amber)'}">${r.incidents}</td>
      <td><div style="display:flex;align-items:center;gap:.5rem"><div class="progress-bar" style="width:60px;height:5px"><div class="progress-fill" style="width:${r.efficiency}"></div></div>${r.efficiency}</div></td>
      <td><span class="badge ${r.status === 'Normal' ? 'badge-online' : r.status === 'Peak' ? 'badge-warning' : 'badge-danger'}">${r.status}</span></td>
    </tr>
  `).join('');
}

// ─── Weekly Heatmap ───
function renderWeeklyHeatmap() {
    const el = document.getElementById('weeklyHeatmap');
    if (!el) return;
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(d => hours.map(h => {
        const hr = parseInt(h);
        let base = 20;
        if (hr >= 8 && hr <= 10) base = 85;
        else if (hr >= 11 && hr <= 15) base = 45;
        else if (hr >= 17 && hr <= 20) base = 78;
        else if (hr >= 0 && hr <= 5) base = 8;
        if (d === 'Sat' || d === 'Sun') base *= 0.7;
        return Math.min(100, base + Math.random() * 20 - 10);
    }));

    const cellW = 28, cellH = 28;
    let html = `<div style="display:grid;overflow-x:auto">`;
    // Hour headers
    html += `<div style="display:flex;gap:2px;margin-left:36px;margin-bottom:4px">`;
    hours.filter((_, i) => i % 4 === 0).forEach(h => {
        html += `<div style="width:${cellW * 4 + 6}px;font-size:.65rem;color:var(--text-muted);text-align:left">${h}</div>`;
    });
    html += `</div>`;
    days.forEach((day, di) => {
        html += `<div style="display:flex;align-items:center;gap:2px;margin-bottom:2px">
      <div style="width:30px;font-size:.75rem;color:var(--text-muted);text-align:right;padding-right:6px">${day}</div>`;
        hours.forEach((_, hi) => {
            const v = data[di][hi];
            const alpha = (v / 100).toFixed(2);
            const color = v > 70 ? `rgba(239,68,68,${alpha})` : v > 40 ? `rgba(245,158,11,${alpha})` : `rgba(34,197,94,${alpha})`;
            html += `<div title="${day} ${hours[hi]}: ${v.toFixed(0)}% congestion" style="width:${cellW}px;height:${cellH}px;background:${color};border-radius:3px;transition:all .2s;cursor:pointer" onmouseover="this.style.outline='2px solid white'" onmouseout="this.style.outline='none'"></div>`;
        });
        html += `</div>`;
    });
    html += `</div>`;
    el.innerHTML = html;
}

// ─── Next Week Prediction ───
function drawNextWeekChart() {
    const canvas = document.getElementById('nextWeekChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 180;

    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 35, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const predictions = [88, 72, 78, 68, 82, 58, 45];
    const lower = predictions.map(v => v - 8);
    const upper = predictions.map(v => v + 10);

    ctx.clearRect(0, 0, W, H);

    // Confidence band
    ctx.beginPath();
    upper.forEach((v, i) => {
        const x = pad.left + (i / (predictions.length - 1)) * chartW;
        const y = pad.top + chartH - (v / 100) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    lower.slice().reverse().forEach((v, i) => {
        const idx = lower.length - 1 - i;
        const x = pad.left + (idx / (predictions.length - 1)) * chartW;
        const y = pad.top + chartH - (v / 100) * chartH;
        ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,212,255,0.08)'; ctx.fill();

    // Main line
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(0,212,255,0.4)'); grad.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.beginPath();
    predictions.forEach((v, i) => {
        const x = pad.left + (i / (predictions.length - 1)) * chartW;
        const y = pad.top + chartH - (v / 100) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.lineTo(pad.left + chartW, pad.top + chartH); ctx.lineTo(pad.left, pad.top + chartH); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Points & labels
    predictions.forEach((v, i) => {
        const x = pad.left + (i / (predictions.length - 1)) * chartW;
        const y = pad.top + chartH - (v / 100) * chartH;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = v > 80 ? '#ef4444' : '#00d4ff'; ctx.fill();
        ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
        ctx.fillText(dayNames[i], x, H - 5);
        ctx.fillStyle = v > 80 ? '#ef4444' : '#00d4ff';
        ctx.fillText(v + '%', x, y - 8);
    });
}

// ─── Performance Report ───
function renderPerfReport() {
    const el = document.getElementById('perfReport');
    if (!el) return;
    const metrics = [
        { label: 'Signal Optimization Rate', val: '78%', w: 78, color: 'var(--accent-cyan)' },
        { label: 'Emergency Response Faster', val: '42%', w: 42, color: 'var(--accent-green)' },
        { label: 'Parking Revenue', val: '₹2.4L', w: 84, color: 'var(--accent-amber)' },
        { label: 'Violations Penalized', val: '87%', w: 87, color: 'var(--accent-purple)' },
        { label: 'Citizen Satisfaction', val: '4.2/5', w: 84, color: 'var(--accent-green)' },
    ];
    el.innerHTML = metrics.map(m => `
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
        <span style="font-size:.85rem;color:var(--text-secondary)">${m.label}</span>
        <span style="font-size:.85rem;font-weight:700;color:${m.color}">${m.val}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${m.w}%;background:${m.color}"></div></div>
    </div>
  `).join('');
}

window.exportReport = function () {
    showToast('📊 Analytics report exported as PDF — Check downloads folder', 'success');
};
window.updateCharts = function () {
    drawTrendChart(); drawCongestionBars(); drawEventChart(); drawNextWeekChart();
    showToast('📊 Charts updated for selected period', 'info');
};

// Init
(function init() {
    drawTrendChart();
    drawCongestionBars();
    drawEventChart();
    renderEventList();
    renderHistoryTable();
    renderWeeklyHeatmap();
    drawNextWeekChart();
    renderPerfReport();
    window.addEventListener('resize', () => {
        drawTrendChart(); drawCongestionBars(); drawEventChart(); drawNextWeekChart();
    });
})();
