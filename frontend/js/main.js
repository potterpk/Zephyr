import map from './map.js'
import { loadFlights } from './flights.js'
import { renderFlights } from './markers.js'
import { closePanel } from './panels.js'

window.closePanel = closePanel

const stats = document.getElementById('stats-bar')

async function init() {
    stats.textContent = 'loading flights...'
    const flights = await loadFlights()
    renderFlights(flights)
    stats.textContent = `${flights.length} flights in the air`
}

init()
