/* ==============================
   CITIZEN.JS — Citizen services logic
   ============================== */

window.showCitizenTab = function (tab, btn) {
    ['alerts', 'report', 'routes', 'feedback'].forEach(t => {
        const el = document.getElementById(`ctab-${t}`);
        if (el) el.style.display = t === tab ? '' : 'none';
    });
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
};

// ─── Citizen Alerts ───
const citizenAlerts = [
    { icon: '🚨', title: 'Accident – Vijapur Road km 4', desc: 'Minor collision, one lane closed. Alternate: Bhigwan Road. 20–25 min delay.', time: '2 min ago', type: 'critical' },
    { icon: '⚠️', title: 'Heavy Traffic – Station Road', desc: 'Backed up 1.2 km near Railway Station. Take Akkalkot Road via bypass.', time: '5 min ago', type: 'warning' },
    { icon: '🏗️', title: 'Road Work – Hotgi Road km 2', desc: 'Single-lane traffic until 18:00. Allow +8 min.', time: '30 min ago', type: 'warning' },
    { icon: '🎉', title: 'Event Advisory – Siddeshwar Yatra', desc: 'Feb 25–28: Heavy traffic near Siddeshwar Temple. Parking restricted in 1 km radius.', time: '1 hr ago', type: 'info' },
    { icon: '✅', title: 'Congestion Cleared – Akkalkot Road', desc: 'Traffic flow restored. Avg speed: 42 km/h.', time: '2 hr ago', type: 'success' },
];

function renderCitizenAlerts() {
    const el = document.getElementById('citizenAlerts');
    if (!el) return;
    el.innerHTML = citizenAlerts.map(a => `
    <div class="alert-item ${a.type}">
      <span style="font-size:1.3rem">${a.icon}</span>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
      <div class="alert-time">${a.time}</div>
    </div>
  `).join('');
}

// ─── Travel Tips ───
function renderTravelTips() {
    const el = document.getElementById('travelTips');
    if (!el) return;
    const tips = [
        { icon: '🕐', title: 'Avoid Morning Rush (8–10 AM)', desc: 'Traffic congestion peaks at Hutatma Chowk and Station Road. Plan commute before 7:30 AM or after 10:30 AM.', color: 'var(--accent-amber)' },
        { icon: '🚌', title: 'Use MSRTC City Buses Today', desc: 'Vijapur Road has congestion. City bus service running on alternate route via Bhigwan Road.', color: 'var(--accent-cyan)' },
        { icon: '🅿️', title: 'Early Parking Available', desc: 'Zone D (Bus Stand) has 67 free slots as of now. Save ₹0 for first 30 minutes on weekdays.', color: 'var(--accent-green)' },
    ];
    el.innerHTML = tips.map(t => `
    <div style="display:flex;gap:.75rem;padding:.85rem;background:var(--bg-secondary);border-radius:10px;border-left:3px solid ${t.color}">
      <span style="font-size:1.4rem">${t.icon}</span>
      <div>
        <div style="font-weight:600;font-size:.9rem;margin-bottom:.2rem">${t.title}</div>
        <div style="font-size:.82rem;color:var(--text-muted)">${t.desc}</div>
      </div>
    </div>
  `).join('');
}

// ─── Today Stats ───
function renderTodayStats() {
    const el = document.getElementById('todayStats');
    if (!el) return;
    const stats = [
        { label: 'Vehicles on road', val: '8,243', icon: '🚗' },
        { label: 'Active incidents', val: '3', icon: '🚨' },
        { label: 'Air Quality (AQI)', val: '87 - Moderate', icon: '💨' },
        { label: 'Park slots free', val: '284 / 400', icon: '🅿️' },
    ];
    el.innerHTML = stats.map(s => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem;border-bottom:1px solid var(--border)">
      <span style="color:var(--text-muted);font-size:.82rem">${s.icon} ${s.label}</span>
      <strong style="font-size:.85rem;color:var(--text-primary)">${s.val}</strong>
    </div>
  `).join('');
}

// ─── Route Planner ───
let selectedRating = 0;

window.getRoute = function () {
    const from = document.getElementById('routeFrom')?.value;
    const to = document.getElementById('routeTo')?.value;
    document.getElementById('routeResult').style.display = '';

    const routes = [
        { name: 'Fastest Route', time: '12 min', dist: '4.2 km', congestion: 'Low', via: 'Akkalkot Road → Ring Road', color: 'var(--accent-green)' },
        { name: 'Alternate Route A', time: '16 min', dist: '5.1 km', congestion: 'Medium', via: 'Vijapur Road → Bypass', color: 'var(--accent-amber)' },
        { name: 'Alternate Route B', time: '20 min', dist: '6.4 km', congestion: 'Low', via: 'Osmanabad Road → NH65', color: 'var(--accent-cyan)' },
    ];

    document.getElementById('routeList').innerHTML = routes.map((r, i) => `
    <div style="padding:1rem;background:var(--bg-secondary);border-radius:10px;border:1px solid ${i === 0 ? r.color : 'var(--border)'};position:relative">
      ${i === 0 ? '<span style="position:absolute;top:.5rem;right:.75rem;font-size:.7rem;background:var(--accent-green);color:black;padding:.15rem .5rem;border-radius:20px;font-weight:700">BEST</span>' : ''}
      <div style="font-weight:700;color:${r.color};margin-bottom:.35rem">${r.name}</div>
      <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:.5rem">via ${r.via}</div>
      <div style="display:flex;gap:1rem;font-size:.85rem">
        <span>⏱️ ${r.time}</span>
        <span>📏 ${r.dist}</span>
        <span style="color:${r.congestion === 'Low' ? 'var(--accent-green)' : r.congestion === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-red)'}">🚦 ${r.congestion}</span>
      </div>
    </div>
  `).join('');

    showToast(`🗺️ Routes found from "${from}" to "${to}"`, 'success');
};

// ─── Zone Status ───
function renderZoneStatus() {
    const el = document.getElementById('zoneStatus');
    if (!el) return;
    const zones = [
        { name: 'Hutatma Chowk Area', status: 'High', color: 'var(--accent-red)', icon: '🔴' },
        { name: 'Station Road', status: 'High', color: 'var(--accent-red)', icon: '🔴' },
        { name: 'Market Area', status: 'Medium', color: 'var(--accent-amber)', icon: '🟡' },
        { name: 'Akkalkot Road', status: 'Medium', color: 'var(--accent-amber)', icon: '🟡' },
        { name: 'Hotgi Road', status: 'Low', color: 'var(--accent-green)', icon: '🟢' },
        { name: 'Osmanabad Road', status: 'Low', color: 'var(--accent-green)', icon: '🟢' },
        { name: 'Bus Stand', status: 'Low', color: 'var(--accent-green)', icon: '🟢' },
    ];
    el.innerHTML = zones.map(z => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.65rem;background:var(--bg-secondary);border-radius:8px">
      <span style="font-size:.85rem">${z.icon} ${z.name}</span>
      <span style="font-size:.8rem;font-weight:600;color:${z.color}">${z.status} Traffic</span>
    </div>
  `).join('');
}

// ─── Report Issue ───
window.simulateUpload = function (el) {
    el.style.borderColor = 'var(--accent-green)';
    document.getElementById('uploadStatus').style.display = '';
    showToast('📷 Photo attached (simulated)', 'success');
};

window.submitReport = function () {
    const desc = document.getElementById('issueDesc')?.value;
    if (!desc?.trim()) { showToast('⚠️ Please describe the issue', 'warning'); return; }
    const id = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('rptId').textContent = id;
    document.getElementById('reportSuccess').style.display = '';
    showToast(`✅ Report submitted! ID: ${id}`, 'success');
};

window.clearForm = function () {
    ['issueDesc', 'reportName', 'reportPhone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('reportSuccess').style.display = 'none';
};

// ─── Feedback ───
window.rate = function (stars) {
    selectedRating = stars;
    const labels = ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent 🌟'];
    document.getElementById('ratingLabel').textContent = `${stars}/5 — ${labels[stars]}`;
    document.getElementById('ratingLabel').style.color = stars >= 4 ? 'var(--accent-green)' : stars >= 3 ? 'var(--accent-amber)' : 'var(--accent-red)';
    document.querySelectorAll('.star').forEach((s, i) => {
        s.style.opacity = i < stars ? '1' : '0.3';
    });
};

window.submitFeedback = function () {
    if (!selectedRating) { showToast('⭐ Please select a rating first', 'warning'); return; }
    const service = document.getElementById('feedService')?.value || 'Traffic System';
    const name = document.getElementById('feedName')?.value || 'Anonymous';
    const text = document.getElementById('feedText')?.value || 'Good service!';

    showToast('⭐ Thank you for your feedback!', 'success');

    // Add to feed
    const list = document.getElementById('feedbackList');
    if (list) {
        list.insertAdjacentHTML('afterbegin', `
      <div style="padding:.75rem;background:var(--bg-secondary);border-radius:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
          <strong style="font-size:.85rem">${name}</strong>
          <span style="font-size:.75rem;color:var(--accent-amber)">${'⭐'.repeat(selectedRating)}</span>
        </div>
        <div style="font-size:.82rem;color:var(--text-muted)"><em>${service}</em></div>
        <div style="font-size:.85rem;margin-top:.35rem">${text}</div>
        <div style="font-size:.75rem;color:var(--text-muted);margin-top:.25rem">Just now</div>
      </div>
    `);
    }

    document.getElementById('feedText').value = '';
    document.getElementById('feedName').value = '';
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(s => s.style.opacity = '1');
    document.getElementById('ratingLabel').textContent = 'Click to rate';
};

function renderFeedbackSamples() {
    const list = document.getElementById('feedbackList');
    if (!list) return;
    const samples = [
        { name: 'Ramesh P.', service: 'Smart Parking System', rating: 5, text: 'Excellent! Saved 20 minutes hunting for parking. Booking is super easy!', time: '2 hr ago' },
        { name: 'Priya S.', service: 'Traffic Signal Management', rating: 4, text: 'AI signal system has reduced my commute by 15 minutes daily. Great initiative!', time: '1 day ago' },
        { name: 'Abdul R.', service: 'Citizen Services App', rating: 4, text: 'Reported a pothole, got resolution in 4 hours. Very responsive.', time: '2 days ago' },
    ];
    list.innerHTML = samples.map(s => `
    <div style="padding:.75rem;background:var(--bg-secondary);border-radius:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
        <strong style="font-size:.85rem">${s.name}</strong>
        <span style="font-size:.75rem;color:var(--accent-amber)">${'⭐'.repeat(s.rating)}</span>
      </div>
      <div style="font-size:.82rem;color:var(--text-muted)"><em>${s.service}</em></div>
      <div style="font-size:.85rem;margin-top:.35rem">${s.text}</div>
      <div style="font-size:.75rem;color:var(--text-muted);margin-top:.25rem">${s.time}</div>
    </div>
  `).join('');
}

// ─── Init ───
(function init() {
    renderCitizenAlerts();
    renderTravelTips();
    renderTodayStats();
    renderZoneStatus();
    renderFeedbackSamples();
})();
