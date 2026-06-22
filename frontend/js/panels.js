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

async function fetchAircraft(icao24) {
    try {
        const res = await fetch(`/aircraft/${icao24}`)
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
            <br><span class="meta-label">Aircraft</span> <span id="aircraft-type" class="meta-val" style="color:var(--muted)">...</span>
            <br><span class="meta-label">Reg</span> <span id="aircraft-reg" class="meta-val" style="color:var(--muted)">...</span>
        </div>
    `
    panel.classList.remove('hidden')

    fetchAircraft(f.icao24).then(ac => {
        const t = document.getElementById('aircraft-type')
        const r = document.getElementById('aircraft-reg')
        if (t) t.textContent = ac?.type ?? '—'
        if (r) r.textContent = ac?.registration ?? '—'
    })

    fetchRoute(f.callsign).then(route => {
        const el = document.getElementById('route-info')
        if (!el) return
        if (!route?.departure && !route?.destination) {
            el.textContent = 'route unknown'
            return
        }
        el.innerHTML = `
            <div style="margin-bottom:4px">
                <span class="meta-val">${route.departure ?? '?'}</span>
                <span style="color:var(--muted)"> → </span>
                <span class="meta-val">${route.destination ?? '?'}</span>
            </div>
            <div style="color:var(--muted);font-size:11px">${route.departure_name ?? ''} → ${route.destination_name ?? ''}</div>
        `
    })
}

function closePanel() {
    panel.classList.add('hidden')
    panel.innerHTML = ''
    clearPath()
}

export { openPanel, closePanel }
