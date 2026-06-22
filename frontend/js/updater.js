import { loadFlights } from './flights.js'
import { renderFlights } from './markers.js'

const stats = document.getElementById('stats-bar')

async function refresh() {
    const flights = await loadFlights()
    renderFlights(flights)
    stats.textContent = `${flights.length} flights in the air`
}

export function startUpdater() {
    setInterval(refresh, 10000)
}
