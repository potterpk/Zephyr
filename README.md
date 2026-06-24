# Zephyr

A local flight tracker that actually looks good:) Runs entirely on your machine...

---

## What it does

- Shows every flight currently in the air, worldwide
- Click any plane to see altitude, speed, heading, route, and aircraft type
- Draws the actual flight path the plane has flown + a predicted line ahead
- Updates every 60 seconds automatically
- Search by callsign to jump straight to a flight
- Weather radar overlay (precipitation)
- Dark and light mode

Data comes from the [OpenSky Network](https://opensky-network.org/) for live flights, [adsbdb](https://www.adsbdb.com/) for route and aircraft info, and [RainViewer](https://www.rainviewer.com/) for weather radar.

---

## Setup

You need Python 3.10+ and that's it.

```bash
git clone https://github.com/potterpk/Zephyr.git
cd Zephyr

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

Before starting, create a `.env` file in the project root (see below), then:

```bash
uvicorn backend.main:app --reload
```

Open `http://localhost:8000` in your browser.

---

## OpenSky credentials

Without an account, OpenSky limits you to around 400 requests per day. If you run Zephyr for a while and flights stop showing up, you've likely hit that limit — it resets at midnight UTC.

To get 10x more requests, sign up for a free account at [opensky-network.org](https://opensky-network.org/). Then create a `.env` file in the project root:

```
OPENSKY_CLIENT_ID=your_client_id
OPENSKY_CLIENT_SECRET=your_client_secret
```

The `.env` file is gitignored so your credentials will never be pushed to GitHub. Each person who clones the repo needs to create their own `.env`.

> If you're hitting rate limits and want to test on a different machine — just clone the repo there and set up a fresh `.env`. Rate limits are per IP, so a different network will work immediately.

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

**Weather radar** — hit the 🌧️ button to toggle precipitation radar over the map. Zoom in too far and the radar tiles won't load.

**Theme** — hit the ☀️ button to switch between dark and light mode.

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
- RainViewer API
