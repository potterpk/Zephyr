import map from './map.js'
import { loadFlights } from './flights.js'
import { renderFlights } from './markers.js'
import { closePanel } from './panels.js'
import { startUpdater } from './updater.js'
import { setFlights } from './search.js'
import { initWeather, toggleWeather } from './weather.js'
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
    await initWeather()

    document.getElementById('weather-toggle').addEventListener('click', (e) => {
        const on = toggleWeather()
        e.target.style.opacity = on ? '1' : '0.4'
    })
}

init()
