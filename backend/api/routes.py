import httpx
from fastapi import APIRouter

router = APIRouter(prefix="/routes", tags=["routes"])

@router.get("/{callsign}")
async def get_route(callsign: str):
    url = f"https://opensky-network.org/api/routes?callsign={callsign.upper()}"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(url)
            if res.status_code == 404:
                return {"departure": None, "destination": None}
            data = res.json()
    except Exception:
        return {"departure": None, "destination": None}

    airports = data.get("route") or []
    return {
        "departure": airports[0] if len(airports) > 0 else None,
        "destination": airports[-1] if len(airports) > 1 else None,
    }
