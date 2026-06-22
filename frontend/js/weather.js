import map from './map.js'

let radarLayer = null
let visible = false

async function loadRadar() {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json')
    const data = await res.json()
    const latest = data.radar.past.at(-1).path

    radarLayer = L.tileLayer(`https://tilecache.rainviewer.com${latest}/256/{z}/{x}/{y}/2/1_1.png`, {
        opacity: 0.5,
        zIndex: 5,
    })
}

export async function initWeather() {
    await loadRadar()
}

export function toggleWeather() {
    if (!radarLayer) return
    visible = !visible
    if (visible) {
        radarLayer.addTo(map)
    } else {
        radarLayer.remove()
    }
    return visible
}
