const map = L.map('map', {
    center: [20, 0],
    zoom: 3,
    zoomControl: true,
    attributionControl: true,
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18,
}).addTo(map)

export default map
