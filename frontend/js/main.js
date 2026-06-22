import map from './map.js'
import { loadFlights } from './flights.js'
import { renderFlights } from './markers.js'
import { closePanel } from './panels.js'
import { startUpdater } from './updater.js'
import { setFlights } from './search.js'
import './theme.js'

window.closePanel = closePanel

const stats = document.getElementById('stats-bar')

async function init() {
    stats.textContent = 'loading...'
    const flights = await loadFlights()
    renderFlights(flights)
    setFlights(flights)
    stats.textContent = `${flights.length} flights in the air`
    startUpdater()
}

init()
