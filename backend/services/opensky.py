import time
import httpx
from typing import List
from ..models.flight import Flight

OPENSKY_URL = "https://opensky-network.org/api/states/all"
CACHE_TTL = 10

_cache = {"data": [], "ts": 0}


def _parse(state: list):
    lat, lon = state[6], state[5]
    if lat is None or lon is None:
        return None

    return Flight(
        icao24=state[0],
        callsign=(state[1] or "").strip() or None,
        origin_country=state[2],
        longitude=lon,
        latitude=lat,
        altitude=state[7],
        velocity=state[9],
        heading=state[10],
        vertical_rate=state[11],
        on_ground=state[8],
        squawk=state[14],
        last_contact=state[4],
    )


async def fetch_flights() -> List[Flight]:
    now = time.time()
    if now - _cache["ts"] < CACHE_TTL and _cache["data"]:
        return _cache["data"]

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(OPENSKY_URL)
            res.raise_for_status()
            states = res.json().get("states") or []
    except Exception as e:
        print(f"opensky error: {e}")
        return _cache["data"]

    flights = [f for s in states if (f := _parse(s)) is not None]
    _cache["data"] = flights
    _cache["ts"] = now
    return flights
