import { loadFlights } from './flights.js'
import { renderFlights } from './markers.js'
import { setFlights } from './search.js'

const stats = document.getElementById('stats-bar')

async function refresh() {
    const flights = await loadFlights()
    renderFlights(flights)
    setFlights(flights)
    stats.textContent = `${flights.length} flights in the air`
}

export function startUpdater() {
    setInterval(refresh, 10000)
}
