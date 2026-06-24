import map from './map.js'

let layers = []

function clearPath() {
    layers.forEach(l => l.remove())
    layers = []
}

function predictedPath(f) {
    if (!f.heading || !f.velocity) return null
    const dist = (f.velocity * 600) / 111320
    const endLat = f.latitude + dist * Math.sin((90 - f.heading) * Math.PI / 180)
    const endLon = f.longitude + dist * Math.cos((90 - f.heading) * Math.PI / 180)
    return [[f.latitude, f.longitude], [endLat, endLon]]
}

async function drawPath(flight) {
    clearPath()

    const predicted = predictedPath(flight)
    if (predicted) {
        const line = L.polyline(predicted, {
            color: '#60a5fa',
            weight: 1.5,
            opacity: 0.5,
            dashArray: '6 6',
        }).addTo(map)
        layers.push(line)
    }

    try {
        const res = await fetch(`/tracks/${flight.icao24}`)
        const data = await res.json()
        if (!data.path?.length) return

        const coords = data.path.map(p => [p.lat, p.lon])
        const track = L.polyline(coords, {
            color: '#f59e0b',
            weight: 2.5,
            opacity: 0.9,
        }).addTo(map)
        layers.push(track)
    } catch (e) {
        console.error('no track data', e)
    }
}

export { drawPath, clearPath }
