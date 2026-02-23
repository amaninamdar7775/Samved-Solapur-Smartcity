/* ==============================
   PARKING.JS — Parking system logic
   ============================== */

// ─── View Switcher ───
window.switchView = function (view, btn) {
    ['map', 'book', 'illegal', 'calc'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.style.display = v === view ? '' : 'none';
    });
    if (btn) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
    } else {
        document.querySelectorAll('.tab').forEach(t => {
            if (t.dataset.view === view) t.classList.add('active');
            else t.classList.remove('active');
        });
    }
};

// ─── Parking Map SVG ───
function drawParkingMap() {
    const svg = document.getElementById('parkingMapSVG');
    if (!svg) return;

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const slotsPerRow = 8;
    const slotW = 56, slotH = 30, gap = 8, marginX = 40, marginY = 30;
    const laneH = 28;

    // Pre-define statuses
    const statuses = {};
    rows.forEach((row, ri) => {
        for (let s = 1; s <= slotsPerRow; s++) {
            const key = `${row}-${s}`;
            const rng = Math.random();
            if (ri === 0 && s === 3) statuses[key] = 'reserved';
            else if (ri === 2 && s === 6) statuses[key] = 'disabled';
            else if (rng < 0.27) statuses[key] = 'occupied';
            else statuses[key] = 'available';
        }
    });

    let svgContent = `
    <defs>
      <pattern id="roadPat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#0f172a"/>
        <line x1="10" y1="0" x2="10" y2="20" stroke="#1e293b" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="560" height="360" fill="#0a1628"/>
    <!-- Entry/Exit Labels -->
    <text x="20" y="20" fill="#00d4ff" font-size="10" font-family="Orbitron" font-weight="700">ENTRY ▶</text>
    <text x="20" y="345" fill="#ef4444" font-size="10" font-family="Orbitron" font-weight="700">◀ EXIT</text>
    <!-- Drive Lane -->
    <rect x="30" y="25" width="500" height="${laneH}" rx="4" fill="#1e293b"/>
    <line x1="30" y1="38" x2="530" y2="38" stroke="#f59e0b" stroke-width="1" stroke-dasharray="15,8"/>
    <text x="270" y="42" text-anchor="middle" fill="rgba(245,158,11,0.6)" font-size="9" font-family="Inter">DRIVE LANE →</text>
    <!-- Bottom Drive Lane -->
    <rect x="30" y="315" width="500" height="${laneH}" rx="4" fill="#1e293b"/>
    <line x1="30" y1="328" x2="530" y2="328" stroke="#f59e0b" stroke-width="1" stroke-dasharray="15,8"/>
    <text x="270" y="332" text-anchor="middle" fill="rgba(245,158,11,0.6)" font-size="9" font-family="Inter">← DRIVE LANE</text>
  `;

    rows.forEach((row, ri) => {
        const y = marginY + laneH + ri * (slotH + gap + 4);
        // Row label
        svgContent += `<text x="${marginX - 15}" y="${y + slotH / 2 + 4}" fill="#64748b" font-size="11" font-weight="700" font-family="Orbitron" text-anchor="middle">${row}</text>`;

        for (let s = 1; s <= slotsPerRow; s++) {
            const x = marginX + (s - 1) * (slotW + gap);
            const key = `${row}-${s}`;
            const status = statuses[key];
            const colors = {
                available: { fill: 'rgba(34,197,94,0.25)', stroke: '#22c55e' },
                occupied: { fill: 'rgba(239,68,68,0.3)', stroke: '#ef4444' },
                reserved: { fill: 'rgba(245,158,11,0.3)', stroke: '#f59e0b' },
                disabled: { fill: 'rgba(59,130,246,0.3)', stroke: '#3b82f6' },
            };
            const c = colors[status];
            svgContent += `
        <g onclick="selectSlot('${key}','${status}')" style="cursor:${status === 'available' ? 'pointer' : 'not-allowed'}">
          <rect x="${x}" y="${y}" width="${slotW}" height="${slotH}" rx="4" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" class="park-slot ${status}" id="slot-${key}"/>
          ${status === 'available' ? `<text x="${x + slotW / 2}" y="${y + slotH / 2 + 4}" text-anchor="middle" fill="#22c55e" font-size="9" font-family="monospace" font-weight="700">${key}</text>` : ''}
          ${status === 'occupied' ? `<text x="${x + slotW / 2}" y="${y + slotH / 2 + 4}" text-anchor="middle" fill="#ef4444" font-size="9">🚗</text>` : ''}
          ${status === 'reserved' ? `<text x="${x + slotW / 2}" y="${y + slotH / 2 + 4}" text-anchor="middle" fill="#f59e0b" font-size="8">RESV.</text>` : ''}
          ${status === 'disabled' ? `<text x="${x + slotW / 2}" y="${y + slotH / 2 + 4}" text-anchor="middle" fill="#3b82f6" font-size="9">♿</text>` : ''}
        </g>
      `;
        }
    });

    svg.innerHTML = svgContent;
}

// Selected slot
let selectedSlot = null;
let selectedVehicleRate = 20;
let selectedPayMethod = 'upi';

window.selectSlot = function (key, status) {
    if (status !== 'available') {
        showToast('⚠️ This slot is not available for booking', 'warning');
        return;
    }
    selectedSlot = key;
    const infoPanel = document.getElementById('selectedSlotInfo');
    if (infoPanel) { infoPanel.style.display = ''; }
    document.getElementById('selSlotName').textContent = `Slot ${key}`;
    document.getElementById('selSlotType').textContent = 'Standard · Zone A · Available Now';
    // Highlight
    document.querySelectorAll('.park-slot').forEach(el => el.style.strokeWidth = '1.5');
    const slotEl = document.getElementById(`slot-${key}`);
    if (slotEl) { slotEl.style.strokeWidth = '3'; slotEl.style.filter = 'drop-shadow(0 0 6px rgba(0,212,255,0.6))'; }
    showToast(`✅ Slot ${key} selected. Click "Book Now" to continue!`, 'success');
};

window.openBooking = function () {
    switchView('book', null);
    if (selectedSlot) populateSlotsList();
};

// ─── Slots List ───
const slotsData = {
    A: ['A-1', 'A-3', 'A-5', 'A-7', 'A-8'],
    B: ['B-2', 'B-4', 'B-5', 'B-6', 'B-8'],
    C: ['C-1', 'C-3', 'C-7'],
    D: ['D-2', 'D-4', 'D-5', 'D-6', 'D-7', 'D-8'],
};

window.updateSlots = function () {
    const zone = document.getElementById('bookZone')?.value || 'A';
    populateSlotsList(zone);
};

let currentSelectedSlot = selectedSlot || 'A-5';

function populateSlotsList(zone = 'A') {
    const list = document.getElementById('slotsList');
    if (!list) return;
    const slots = slotsData[zone] || slotsData.A;
    list.innerHTML = slots.map(slot => `
    <div class="slot-item ${currentSelectedSlot === slot ? 'selected-slot' : ''}" onclick="pickSlot(this,'${slot}')">
      <div class="slot-num" style="color:var(--accent-cyan)">${slot}</div>
      <div class="slot-meta">
        <div style="font-size:.85rem;font-weight:600">Zone ${zone} · Standard</div>
        <div class="slot-type">Ground Floor · ${Math.random() > 0.5 ? 'Near Elevator' : 'Corner Spot'}</div>
      </div>
      <div class="slot-status-dot available"></div>
    </div>
  `).join('');
}

window.pickSlot = function (el, slot) {
    currentSelectedSlot = slot;
    document.querySelectorAll('.slot-item').forEach(i => i.classList.remove('selected-slot'));
    el.classList.add('selected-slot');
};

window.selectVehicle = function (el, type) {
    document.querySelectorAll('.vehicle-option').forEach(opt => {
        opt.style.border = '2px solid var(--border)';
        opt.style.background = 'transparent';
    });
    el.style.border = '2px solid var(--accent-cyan)';
    el.style.background = 'rgba(0,212,255,0.08)';
    selectedVehicleRate = { two: 10, four: 20, heavy: 50 }[type] || 20;
    updateCost();
};

window.selectPayment = function (el, method) {
    document.querySelectorAll('.pay-option').forEach(opt => {
        opt.style.border = '2px solid var(--border)';
        opt.style.color = 'var(--text-secondary)';
        opt.style.background = 'transparent';
    });
    el.style.border = '2px solid var(--accent-cyan)';
    el.style.color = 'var(--text-primary)';
    el.style.background = 'rgba(0,212,255,0.08)';
    selectedPayMethod = method;
};

// ─── Booking Steps ───
window.goStep = function (step) {
    if (step === 3 && !document.getElementById('bVehicle')?.value) {
        document.getElementById('bVehicle').value = '';
    }
    [1, 2, 3, 4].forEach(s => {
        const el = document.getElementById(`bStep${s}`);
        if (el) el.style.display = s === step ? '' : 'none';
        el?.classList.toggle('active', s === step);
        const dot = document.getElementById(`step${s}`);
        if (dot) {
            dot.classList.remove('active', 'done');
            if (s === step) dot.classList.add('active');
            else if (s < step) dot.classList.add('done');
        }
    });
    if (step === 3) updateCost();
};

window.updateCost = function () {
    const dur = parseInt(document.getElementById('bDuration')?.value || '2');
    const base = selectedVehicleRate;
    const sub = base * dur;
    const gst = sub * 0.18 + 5 * 0.18;
    const total = sub + 5 + gst;
    document.getElementById('costBase').textContent = `₹${base}/hr`;
    document.getElementById('costDuration').textContent = `${dur} hour${dur > 1 ? 's' : ''}`;
    document.getElementById('costGST').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('costTotal').textContent = `₹${total.toFixed(2)}`;
};

window.processPayment = function () {
    const name = document.getElementById('bName')?.value || 'Guest';
    const vehicle = document.getElementById('bVehicle')?.value || 'MH-13-AB-1234';
    const dur = document.getElementById('bDuration')?.value || '2';
    const zone = document.getElementById('bookZone')?.value || 'A';

    showToast(`💳 Processing ${selectedPayMethod.toUpperCase()} payment...`, 'info');

    setTimeout(() => {
        showToast('✅ Payment successful! Generating QR ticket...', 'success');

        // Fill ticket
        document.getElementById('ticketSlot').textContent = currentSelectedSlot || 'A-05';
        document.getElementById('ticketZone').textContent = `Zone ${zone}`;
        document.getElementById('ticketDate').textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        document.getElementById('ticketDuration').textContent = `${dur} hrs`;
        document.getElementById('ticketVehicle').textContent = vehicle || 'MH-13-AB-1234';
        document.getElementById('ticketAmount').textContent = document.getElementById('costTotal')?.textContent || '₹52.20';
        document.getElementById('ticketID').textContent = 'SMC-2026-' + Math.floor(Math.random() * 9000 + 1000);

        drawQRCode();
        drawBarcode();
        goStep(4);
    }, 1500);
};

// ─── QR Code (decorative) ───
function drawQRCode() {
    const svg = document.getElementById('qrSVG');
    if (!svg) return;
    const size = 120, cellSize = 5, cells = size / cellSize;
    let svgContent = `<rect width="120" height="120" fill="white"/>`;

    // Finder patterns
    const drawFinder = (ox, oy) => {
        svgContent += `<rect x="${ox}" y="${oy}" width="35" height="35" fill="black"/>`;
        svgContent += `<rect x="${ox + 5}" y="${oy + 5}" width="25" height="25" fill="white"/>`;
        svgContent += `<rect x="${ox + 10}" y="${oy + 10}" width="15" height="15" fill="black"/>`;
    };
    drawFinder(5, 5);
    drawFinder(80, 5);
    drawFinder(5, 80);

    // Random data cells (simulated QR)
    for (let x = 0; x < cells; x++) {
        for (let y = 0; y < cells; y++) {
            const px = x * cellSize + 2.5, py = y * cellSize + 2.5;
            if ((px < 45 && py < 45) || (px > 77 && py < 45) || (px < 45 && py > 77)) continue;
            if (Math.random() > 0.52) {
                svgContent += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
            }
        }
    }
    svg.innerHTML = svgContent;
}

// ─── Barcode ───
function drawBarcode() {
    const svg = document.getElementById('qrSVG')?.closest('.qr-ticket')?.querySelector('.qr-barcode-svg');
    if (!svg) return;
    let bars = '';
    for (let i = 0; i < 80; i++) {
        const w = Math.random() > 0.5 ? 2 : 1;
        const x = i * 2.5;
        if (Math.random() > 0.35) {
            bars += `<rect x="${x}" y="2" width="${w}" height="26" fill="white"/>`;
        }
    }
    svg.innerHTML = `<rect width="200" height="30" fill="black"/>${bars}`;
}

// ─── Violations ───
const violations = [
    { plate: 'MH-13-GH-4521', loc: 'Market Road, Near Gate 3', time: '09:14 AM', fine: '₹500', img: '📷', zone: 'No Parking Zone' },
    { plate: 'MH-14-KL-7823', loc: 'Station Road Footpath', time: '09:28 AM', fine: '₹500', img: '📷', zone: 'Footpath' },
    { plate: 'MH-22-MN-1145', loc: 'Hospital Road Junction', time: '09:45 AM', fine: '₹1000', img: '📷', zone: 'Emergency Lane' },
    { plate: 'KA-01-AB-6654', loc: 'Hotgi Road Near Bank', time: '10:02 AM', fine: '₹500', img: '📷', zone: 'No Parking' },
];

function renderViolations() {
    const grid = document.getElementById('violationGrid');
    if (!grid) return;
    grid.innerHTML = violations.map(v => `
    <div class="violation-card">
      <div class="violation-header">
        <span class="violation-img">🚔</span>
        <div>
          <div class="violation-id">#VIO-${Math.floor(Math.random() * 9000 + 1000)}</div>
          <div class="violation-loc">📍 ${v.loc}</div>
        </div>
        <span class="badge badge-danger" style="margin-left:auto">Active</span>
      </div>
      <div class="violation-plate">${v.plate}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.75rem;font-size:.8rem">
        <div><span style="color:var(--text-muted)">Violation:</span> ${v.zone}</div>
        <div><span style="color:var(--text-muted)">Fine:</span> <strong style="color:var(--accent-red)">${v.fine}</strong></div>
        <div><span style="color:var(--text-muted)">Time:</span> ${v.time}</div>
        <div><span style="color:var(--text-muted)">Camera:</span> 📷 CCTV-0${Math.floor(Math.random() * 9 + 1)}</div>
      </div>
      <div class="violation-actions">
        <button class="btn btn-danger btn-sm" onclick="issueNotice('${v.plate}')">📨 Issue Notice</button>
        <button class="btn btn-ghost btn-sm" onclick="markResolved(this)">✅ Resolved</button>
      </div>
    </div>
  `).join('');
}

window.issueNotice = function (plate) {
    showToast(`📨 E-challan sent to owner of ${plate} — Fine: ₹500`, 'info');
};
window.markResolved = function (btn) {
    btn.closest('.violation-card').style.opacity = '0.4';
    showToast('✅ Violation marked as resolved', 'success');
};

// ─── Cost Calculator ───
window.calcCost = function () {
    const rate = parseInt(document.getElementById('calcVehicle')?.value || '20');
    const dur = parseInt(document.getElementById('calcSlider')?.value || '2');
    const mult = parseFloat(document.getElementById('calcZone')?.value || '1');
    const sub = rate * dur * mult;
    const gst = (sub + 5) * 0.18;
    const total = sub + 5 + gst;

    document.getElementById('calcDurLabel').textContent = `${dur} hour${dur > 1 ? 's' : ''}`;
    document.getElementById('cBase').textContent = `₹${rate}/hr`;
    document.getElementById('cMult').textContent = `${mult}×`;
    document.getElementById('cDur').textContent = `${dur} hrs`;
    document.getElementById('cSub').textContent = `₹${sub.toFixed(2)}`;
    document.getElementById('cGST').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('cTotal').textContent = `₹${total.toFixed(2)}`;
};

// ─── Zone Summary ───
function renderZoneSummary() {
    const el = document.getElementById('zoneSummary');
    if (!el) return;
    const zones = [
        { name: 'Zone A — Market', avail: 28, total: 80, color: '#22c55e' },
        { name: 'Zone B — Station', avail: 42, total: 120, color: '#22c55e' },
        { name: 'Zone C — Hospital', avail: 19, total: 60, color: '#f59e0b' },
        { name: 'Zone D — Bus Stand', avail: 67, total: 140, color: '#22c55e' },
    ];
    el.innerHTML = zones.map(z => `
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
        <span style="font-size:.85rem;color:var(--text-secondary)">${z.name}</span>
        <span style="font-size:.85rem;font-weight:600;color:${z.color}">${z.avail} free</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${(z.avail / z.total) * 100}%;background:${z.color}"></div></div>
    </div>
  `).join('');
}

function renderNearby() {
    const el = document.getElementById('nearbyParking');
    if (!el) return;
    const spots = [
        { name: 'Super Market Parking', dist: '0.4 km', free: 28, rating: '⭐4.2' },
        { name: 'Railway Station P1', dist: '0.7 km', free: 42, rating: '⭐4.0' },
        { name: 'SMC Zone B', dist: '1.1 km', free: 67, rating: '⭐4.5' },
    ];
    el.innerHTML = spots.map(s => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem;background:var(--bg-secondary);border-radius:8px">
      <div>
        <div style="font-size:.85rem;font-weight:600">${s.name}</div>
        <div style="font-size:.75rem;color:var(--text-muted)">${s.dist} · ${s.rating}</div>
      </div>
      <span style="color:var(--accent-green);font-weight:700;font-size:.85rem">${s.free} free</span>
    </div>
  `).join('');
}

// ─── Live Slot Updates ───
function liveSlotUpdate() {
    const avail = Math.floor(270 + Math.random() * 30);
    const occupied = 400 - avail;
    document.getElementById('availCount').textContent = avail;
    document.getElementById('occupiedCount').textContent = occupied;
    document.getElementById('availBar').style.width = ((avail / 400) * 100).toFixed(0) + '%';
    document.getElementById('occupiedBar').style.width = ((occupied / 400) * 100).toFixed(0) + '%';
}

window.downloadTicket = function () {
    showToast('📱 Ticket downloading... (Check your downloads)', 'info');
};

// ─── Set default date ───
const dateInput = document.getElementById('bDate');
if (dateInput) {
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    dateInput.min = today.toISOString().split('T')[0];
}

// ─── Init ───
(function init() {
    drawParkingMap();
    populateSlotsList('A');
    renderViolations();
    renderZoneSummary();
    renderNearby();
    updateCost();
    calcCost();

    setInterval(liveSlotUpdate, 6000);

    // Make booking step 1 visible by default
    goStep(1);
})();
