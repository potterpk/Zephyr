# Zephyr

A local flight tracker that actually looks good. Runs entirely on your machine — no accounts, no subscriptions, no ads.

---

## What it does

- Shows every flight currently in the air, worldwide
- Click any plane to see altitude, speed, heading, route, and aircraft type
- Draws the actual flight path the plane has flown + a predicted line ahead
- Updates every 10 seconds automatically
- Search by callsign to jump straight to a flight
- Dark and light mode

Data comes from the [OpenSky Network](https://opensky-network.org/) (free, no key needed) and [adsbdb](https://www.adsbdb.com/) for route and aircraft info.

---

## Setup

You need Python 3.10+ and that's it.

```bash
git clone https://github.com/potterpk/Zephyr.git
cd Zephyr

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Then open `http://localhost:8000` in your browser.

---

## How to use it

**Finding a flight** — type a callsign into the search bar (e.g. `BAW`, `UAE204`) and the map will fly to it and open the details panel.

**Clicking a plane** — click any icon on the map. The right panel shows:
- Callsign and country
- Departure → destination airports
- Altitude (ft + m), speed (knots), heading, vertical rate
- Aircraft type and registration
- ICAO24 and squawk code

**Flight path** — when you click a plane, two lines appear:
- Amber line = where it has actually been (last hour from OpenSky)
- Dashed blue line = predicted path based on current heading and speed

**Theme** — hit the ☀️ button in the top right to switch between dark and light mode.

---

## Coverage

Coverage is best over Europe and North America where there are more ADS-B ground receivers. Africa, oceans, and parts of Asia have thinner coverage — that's just the nature of free community-sourced ADS-B data, not a bug.

---

## Stack

- Python + FastAPI
- Leaflet.js
- Vanilla JS
- OpenSky Network API
- adsbdb API
