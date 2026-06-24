async function loadFlights() {
    try {
        const res = await fetch('/flights/')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
    } catch (e) {
        console.error('failed to load flights', e)
        return []
    }
}

export { loadFlights }
