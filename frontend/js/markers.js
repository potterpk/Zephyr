import map from './map.js'
import { openPanel } from './panels.js'

const active = {}
const iconCache = {}
let allFlights = []
const MIN_ZOOM = 3

const icon = (heading) => {
    const key = Math.round(heading ?? 0)
    if (iconCache[key]) return iconCache[key]
    iconCache[key] = L.divIcon({
        className: '',
        html: `<div class="plane-marker" style="transform:rotate(${key}deg)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#60a5fa" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1l3.5 1v-1.5L13 19v-5.5z"/>
            </svg>
        </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    })
    return iconCache[key]
}

function clearAll() {
    for (const id in active) {
        active[id].remove()
        delete active[id]
    }
}

function redraw() {
    if (map.getZoom() < MIN_ZOOM) {
        clearAll()
        return
    }

    const bounds = map.getBounds()
    const visible = allFlights.filter(f => bounds.contains([f.latitude, f.longitude]))
    const seen = new Set(visible.map(f => f.icao24))

    for (const f of visible) {
        if (active[f.icao24]) {
            active[f.icao24].setLatLng([f.latitude, f.longitude])
        } else {
            active[f.icao24] = L.marker([f.latitude, f.longitude], { icon: icon(f.heading) })
                .on('click', () => openPanel(f))
                .addTo(map)
        }
    }

    for (const id in active) {
        if (!seen.has(id)) {
            active[id].remove()
            delete active[id]
        }
    }
}

function renderFlights(flights) {
    allFlights = flights
    redraw()
}

map.on('moveend zoomend', redraw)

export { renderFlights }
