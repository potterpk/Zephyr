import httpx
import asyncio
from typing import List, Optional
from ..models.flight import Flight

OPENSKY_URL = "https://opensky-network.org/api/states/all"

# Index mapping for OpenSky state vector fields
_IDX = {
    "icao24": 0,
    "callsign": 1,
    "origin_country": 2,
    "time_position": 3,
    "last_contact": 4,
    "longitude": 5,
    "latitude": 6,
    "baro_altitude": 7,
    "on_ground": 8,
    "velocity": 9,
    "true_track": 10,
    "vertical_rate": 11,
    "squawk": 14,
    "geo_altitude": 13,
}

_cache: dict = {"flights": [], "timestamp": 0}
_CACHE_TTL = 10  # seconds


def _parse_state(state: list) -> Optional[Flight]:
    lat = state[_IDX["latitude"]]
    lon = state[_IDX["longitude"]]
    if lat is None or lon is None:
        return None

    return Flight(
        icao24=state[_IDX["icao24"]],
        callsign=(state[_IDX["callsign"]] or "").strip() or None,
        origin_country=state[_IDX["origin_country"]],
        longitude=lon,
        latitude=lat,
        altitude=state[_IDX["baro_altitude"]],
        velocity=state[_IDX["velocity"]],
        heading=state[_IDX["true_track"]],
        vertical_rate=state[_IDX["vertical_rate"]],
        on_ground=state[_IDX["on_ground"]],
        squawk=state[_IDX["squawk"]],
        last_contact=state[_IDX["last_contact"]],
    )


async def fetch_flights() -> List[Flight]:
    import time

    now = time.time()
    if now - _cache["timestamp"] < _CACHE_TTL and _cache["flights"]:
        return _cache["flights"]

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(OPENSKY_URL)
            response.raise_for_status()
            data = response.json()
    except Exception as e:
        print(f"[opensky] fetch error: {e}")
        return _cache["flights"]

    states = data.get("states") or []
    flights = [f for s in states if (f := _parse_state(s)) is not None]

    _cache["flights"] = flights
    _cache["timestamp"] = now
    return flights
