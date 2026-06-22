async function loadFlights() {
    const res = await fetch('/flights/')
    const data = await res.json()
    return data
}

export { loadFlights }
