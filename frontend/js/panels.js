import { drawPath, clearPath } from './flightpath.js'

const panel = document.getElementById('flight-panel')

const toKnots = v => Math.round(v * 1.944)
const toFt = m => Math.round(m * 3.281).toLocaleString()

function vicon(rate) {
    if (rate == null) return ''
    if (rate > 0.5) return '<span style="color:#34d399">▲</span>'
    if (rate < -0.5) return '<span style="color:#f87171">▼</span>'
    return '<span style="color:var(--muted)">▬</span>'
}

async function fetchRoute(callsign) {
    if (!callsign) return null
    try {
        const res = await fetch(`/routes/${callsign}`)
        return await res.json()
    } catch {
        return null
    }
}

function openPanel(f) {
    drawPath(f)
    panel.innerHTML = `
        <button class="panel-close" onclick="closePanel()">✕</button>
        <div class="panel-callsign">${f.callsign ?? f.icao24}</div>
        <div class="panel-country">${f.origin_country ?? 'Unknown'}</div>
        <div class="panel-divider"></div>
        <div id="route-info" style="font-size:12px;color:var(--muted);margin-bottom:10px">fetching route...</div>
        <div class="panel-divider"></div>
        <div class="panel-stats">
            <div class="stat wide">
                <label>Altitude</label>
                <span>${f.altitude != null ? toFt(f.altitude) + ' ft' : '—'}</span>
                <small>${f.altitude != null ? Math.round(f.altitude) + ' m' : ''}</small>
            </div>
            <div class="stat">
                <label>Speed</label>
                <span>${f.velocity != null ? toKnots(f.velocity) + ' kts' : '—'}</span>
            </div>
            <div class="stat">
                <label>Heading</label>
                <span>${f.heading != null ? Math.round(f.heading) + '°' : '—'}</span>
            </div>
            <div class="stat">
                <label>Vertical</label>
                <span>${vicon(f.vertical_rate)} ${f.vertical_rate != null ? (f.vertical_rate > 0 ? '+' : '') + Math.round(f.vertical_rate) + ' m/s' : '—'}</span>
            </div>
            <div class="stat">
                <label>Status</label>
                <span>${f.on_ground ? '🛬 On ground' : '✈ Airborne'}</span>
            </div>
        </div>
        <div class="panel-divider"></div>
        <div class="panel-meta">
            <span class="meta-label">ICAO</span> <span class="meta-val">${f.icao24.toUpperCase()}</span>
            ${f.squawk ? `<br><span class="meta-label">Squawk</span> <span class="meta-val">${f.squawk}</span>` : ''}
        </div>
    `
    panel.classList.remove('hidden')

    fetchRoute(f.callsign).then(route => {
        const el = document.getElementById('route-info')
        if (!el) return
        if (!route?.departure && !route?.destination) {
            el.textContent = 'route unknown'
            return
        }
        el.innerHTML = `
            <span class="meta-val">${route.departure ?? '?'}</span>
            <span style="color:var(--muted)"> → </span>
            <span class="meta-val">${route.destination ?? '?'}</span>
        `
    })
}

function closePanel() {
    panel.classList.add('hidden')
    panel.innerHTML = ''
    clearPath()
}

export { openPanel, closePanel }
