import time
import os
import httpx
from typing import List
from dotenv import load_dotenv
from ..models.flight import Flight

load_dotenv()

OPENSKY_URL = "https://opensky-network.org/api/states/all"
TOKEN_URL = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
CACHE_TTL = 60
BACKOFF_TTL = 60

_cache = {"data": [], "ts": 0, "backoff_until": 0}
_token = {"value": None, "expires_at": 0}


async def _get_token(client: httpx.AsyncClient):
    if _token["value"] and time.time() < _token["expires_at"] - 30:
        return _token["value"]

    client_id = os.getenv("OPENSKY_CLIENT_ID")
    client_secret = os.getenv("OPENSKY_CLIENT_SECRET")
    if not client_id or not client_secret:
        return None

    res = await client.post(TOKEN_URL, data={
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    })
    if res.status_code != 200:
        print(f"token error: {res.status_code}")
        return None

    data = res.json()
    _token["value"] = data["access_token"]
    _token["expires_at"] = time.time() + data.get("expires_in", 1800)
    return _token["value"]


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
    if now < _cache["backoff_until"]:
        return _cache["data"]

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            token = await _get_token(client)
            headers = {"Authorization": f"Bearer {token}"} if token else {}
            res = await client.get(OPENSKY_URL, headers=headers)
            if res.status_code == 429:
                print("opensky rate limited, backing off 60s")
                _cache["backoff_until"] = now + BACKOFF_TTL
                return _cache["data"]
            res.raise_for_status()
            states = res.json().get("states") or []
    except Exception as e:
        print(f"opensky error: {e}")
        return _cache["data"]

    flights = [f for s in states if (f := _parse(s)) is not None]
    _cache["data"] = flights
    _cache["ts"] = now
    return flights
