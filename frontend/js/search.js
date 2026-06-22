import map from './map.js'
import { openPanel } from './panels.js'

let flights = []

export function setFlights(data) {
    flights = data
}

const input = document.getElementById('search')

input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase()
    if (!q) return

    const match = flights.find(f =>
        f.callsign?.toLowerCase().includes(q) ||
        f.icao24?.toLowerCase().includes(q)
    )

    if (match) {
        map.flyTo([match.latitude, match.longitude], 8, { duration: 1.2 })
        openPanel(match)
    }
})
