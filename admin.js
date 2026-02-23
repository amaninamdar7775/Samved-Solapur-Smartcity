/* ==============================
   ADMIN.JS
   ============================== */

window.adminLogin = function () {
    const user = document.getElementById('adminUser')?.value;
    const pass = document.getElementById('adminPass')?.value;
    if (user === 'admin' && pass === 'smc2025') {
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('adminContent').style.display = '';
        showToast('✅ Welcome, Admin! Solapur Control Room is live.', 'success');
        initAdmin();
    } else {
        document.getElementById('loginError').style.display = '';
    }
};

window.adminLogout = function () {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('adminContent').style.display = 'none';
};

// Allow Enter key
document.getElementById('adminPass')?.addEventListener('keypress', e => { if (e.key === 'Enter') adminLogin(); });

window.showTab = function (tab) {
    ['traffic', 'parking', 'complaints', 'notifications', 'reports'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.style.display = t === tab ? '' : 'none';
    });
};

// ─── Signal Control Cards ───
function renderAdminSignals() {
    const el = document.getElementById('adminSignals');
    if (!el) return;
    const signals = [
        { name: 'Hutatma Chowk', state: 'red', ai: true },
        { name: 'Akkalkot Road', state: 'green', ai: true },
        { name: 'Station Road', state: 'yellow', ai: false },
        { name: 'Vijapur Road', state: 'green', ai: true },
        { name: 'Hotgi Road', state: 'red', ai: false },
        { name: 'Osmanabad Rd', state: 'green', ai: true },
    ];
    el.innerHTML = signals.map((s, i) => `
    <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:12px;padding:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:.75rem">
        <span style="font-size:.85rem;font-weight:600">${s.name}</span>
        <span class="badge ${s.ai ? 'badge-info' : 'badge-warning'}">${s.ai ? 'AI' : 'Manual'}</span>
      </div>
      <div style="display:flex;gap:.5rem;margin-bottom:.75rem;justify-content:center">
        <button onclick="setSignal(${i},'red',this)" style="background:${s.state === 'red' ? '#ef4444' : 'rgba(239,68,68,0.2)'};border:1px solid #ef4444;border-radius:50%;width:32px;height:32px;cursor:pointer;transition:.2s"></button>
        <button onclick="setSignal(${i},'yellow',this)" style="background:${s.state === 'yellow' ? '#f59e0b' : 'rgba(245,158,11,0.2)'};border:1px solid #f59e0b;border-radius:50%;width:32px;height:32px;cursor:pointer;transition:.2s"></button>
        <button onclick="setSignal(${i},'green',this)" style="background:${s.state === 'green' ? '#22c55e' : 'rgba(34,197,94,0.2)'};border:1px solid #22c55e;border-radius:50%;width:32px;height:32px;cursor:pointer;transition:.2s"></button>
      </div>
      <div class="toggle-switch" style="justify-content:center">
        <div class="switch ${s.ai ? 'on' : ''}" onclick="this.classList.toggle('on');showToast('⚡ AI control toggled','info')"></div>
        <span style="font-size:.78rem;color:var(--text-muted)">AI Control</span>
      </div>
    </div>
  `).join('');
}

window.setSignal = function (idx, color, btn) {
    const parent = btn.closest('div').closest('div');
    parent.querySelectorAll('button').forEach(b => b.style.opacity = '0.6');
    btn.style.opacity = '1';
    btn.style.boxShadow = `0 0 12px ${color === 'red' ? '#ef4444' : color === 'yellow' ? '#f59e0b' : '#22c55e'}`;
    showToast(`🚦 Signal override: ${color.toUpperCase()} set`, 'info');
};

// ─── CCTV Feeds ───
function renderCCTV() {
    const el = document.getElementById('cctvGrid');
    if (!el) return;
    const cams = [
        'Hutatma Chowk', 'Station Road', 'Akkalkot Jn.', 'Vijapur Road',
        'Market Entry', 'Bus Stand', 'Hotgi Road', 'Hospital Rd',
    ];
    el.innerHTML = cams.map((name, i) => `
    <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);cursor:pointer" onclick="viewCam(${i},'${name}')">
      <div style="background:#0a1628;aspect-ratio:16/9;position:relative;display:flex;align-items:center;justify-content:center">
        <canvas id="cam${i}" style="width:100%;height:100%;position:absolute;inset:0"></canvas>
        <div style="position:absolute;top:6px;left:8px;background:rgba(0,0,0,.7);padding:.15rem .4rem;border-radius:4px;font-size:.65rem;color:white;font-weight:600">CAM-0${i + 1}</div>
        <div style="position:absolute;top:6px;right:8px;display:flex;align-items:center;gap:.3rem;background:rgba(0,0,0,.7);padding:.15rem .4rem;border-radius:4px;font-size:.65rem;color:#22c55e">
          <span style="width:5px;height:5px;border-radius:50%;background:#22c55e;display:inline-block"></span>LIVE
        </div>
      </div>
      <div style="background:var(--bg-secondary);padding:.4rem .6rem;font-size:.75rem;color:var(--text-muted)">${name}</div>
    </div>
  `).join('');

    // Animate CCTV feeds
    cams.forEach((_, i) => {
        setTimeout(() => animateCam(i), i * 200);
    });
}

function animateCam(idx) {
    const canvas = document.getElementById(`cam${idx}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 180; canvas.height = 101;

    let frame = 0;
    const animate = () => {
        ctx.fillStyle = `hsl(${210 + Math.sin(frame * 0.05) * 15},40%,${8 + Math.sin(frame * 0.03) * 2}%)`;
        ctx.fillRect(0, 0, 180, 101);

        // Road
        ctx.fillStyle = '#1e2d40';
        ctx.fillRect(0, 55, 180, 30);
        ctx.strokeStyle = 'rgba(245,158,11,0.3)';
        ctx.setLineDash([10, 8]);
        ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(180, 70); ctx.stroke();
        ctx.setLineDash([]);

        // Buildings
        [[10, 20, 25, 35, '#0d2040'], [45, 15, 20, 40, '#0d2040'], [80, 25, 30, 30, '#0d3050'], [140, 10, 25, 45, '#0d2040']].forEach(([x, y, w, h, c]) => {
            ctx.fillStyle = c; ctx.fillRect(x, y, w, h);
            // windows
            for (let wx = x + 3; wx < x + w - 3; wx += 7) for (let wy = y + 3; wy < y + h - 4; wy += 6) {
                ctx.fillStyle = Math.random() > 0.4 ? 'rgba(0,212,255,0.6)' : 'rgba(30,58,95,0.5)';
                ctx.fillRect(wx, wy, 4, 4);
            }
        });

        // Moving cars
        const carX = (frame * 1.5 + idx * 30) % 200 - 20;
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(carX, 57, 16, 8);
        ctx.fillStyle = '#ef4444'; ctx.fillRect((carX + 60) % 200 - 20, 62, 14, 7);

        // Timestamp
        const now = new Date();
        ctx.fillStyle = 'white'; ctx.font = '7px monospace';
        ctx.fillText(`${now.toLocaleTimeString()}`, 5, 98);

        frame++;
        requestAnimationFrame(animate);
    };
    animate();
}

window.viewCam = function (idx, name) {
    showToast(`📷 Full-screen view: ${name} (CAM-0${idx + 1}) — Press Esc to close`, 'info');
};

// ─── Complaints ───
function renderComplaints() {
    const tbody = document.getElementById('complaintsBody');
    if (!tbody) return;
    const types = ['Signal malfunction', 'Illegal parking', 'Road damage', 'Traffic congestion', 'Overspeeding'];
    const locs = ['Hutatma Chowk', 'Station Road', 'Market Area', 'Hotgi Road', 'Akkalkot Road'];
    const rows = Array.from({ length: 8 }, (_, i) => ({
        id: `CMP-${1000 + i}`,
        type: types[i % types.length],
        loc: locs[i % locs.length],
        by: `Citizen-${100 + i}`,
        date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        priority: i < 2 ? 'High' : i < 5 ? 'Medium' : 'Low',
        status: i === 0 ? 'Open' : i < 4 ? 'In Progress' : 'Resolved',
    }));
    tbody.innerHTML = rows.map(r => `
    <tr>
      <td style="font-family:var(--font-display);font-size:.8rem;color:var(--accent-cyan)">${r.id}</td>
      <td>${r.type}</td>
      <td>📍 ${r.loc}</td>
      <td>${r.by}</td>
      <td>${r.date}</td>
      <td><span class="badge ${r.priority === 'High' ? 'badge-danger' : r.priority === 'Medium' ? 'badge-warning' : 'badge-info'}">${r.priority}</span></td>
      <td><span class="badge ${r.status === 'Resolved' ? 'badge-online' : r.status === 'In Progress' ? 'badge-warning' : 'badge-danger'}">${r.status}</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="resolveComplaint('${r.id}',this)">✅ Resolve</button></td>
    </tr>
  `).join('');
}

window.resolveComplaint = function (id, btn) {
    btn.textContent = '✔ Done';
    btn.disabled = true;
    btn.closest('tr').querySelector('.badge.badge-danger, .badge.badge-warning').className = 'badge badge-online';
    btn.closest('tr').querySelector('.badge.badge-online').textContent = 'Resolved';
    showToast(`✅ Complaint ${id} marked resolved`, 'success');
};

// ─── Notifications ───
function renderBroadcasts() {
    const el = document.getElementById('broadcastFeed');
    if (!el) return;
    const feeds = [
        { msg: '🚦 Signal maintenance at Akkalkot Road — 30 min delay expected', time: '2 hr ago', type: 'warning' },
        { msg: '🎉 Siddeshwar Yatra — Traffic advisory issued for Feb 25-28', time: '5 hr ago', type: 'info' },
        { msg: '🚨 Accident at Vijapur Road — avoid until 11:00 AM', time: '8 hr ago', type: 'danger' },
        { msg: '✅ Hotgi Road work complete — 2-lane restored', time: '1 day ago', type: 'success' },
    ];
    el.innerHTML = feeds.map(f => `
    <div class="alert-item ${f.type}" style="background:var(--bg-secondary)">
      <div class="alert-body">
        <div style="font-size:.85rem">${f.msg}</div>
        <div class="alert-time">${f.time}</div>
      </div>
    </div>
  `).join('');
}

window.sendAlert = function () {
    const msg = document.getElementById('alertMsg')?.value;
    if (!msg?.trim()) { showToast('⚠️ Enter alert message first', 'warning'); return; }
    showToast('📡 Alert broadcast sent to 12,400+ citizens!', 'success');
    document.getElementById('alertMsg').value = '';
    const feed = document.getElementById('broadcastFeed');
    if (feed) {
        const now = new Date();
        feed.insertAdjacentHTML('afterbegin', `<div class="alert-item success" style="background:var(--bg-secondary)"><div class="alert-body"><div style="font-size:.85rem">${msg}</div><div class="alert-time">Just now</div></div></div>`);
    }
};

window.downloadRep = function (name) {
    showToast(`⬇️ Downloading "${name}"...`, 'success');
};

// ─── Live Count Update ───
function updateAdminKPIs() {
    const el = document.getElementById('admVehicles');
    if (el) el.textContent = (8000 + Math.floor(Math.random() * 500)).toLocaleString();
}

// ─── Init ───
function initAdmin() {
    renderAdminSignals();
    renderCCTV();
    renderComplaints();
    renderBroadcasts();
    setInterval(updateAdminKPIs, 3000);
}
