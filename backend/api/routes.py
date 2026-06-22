import httpx
from fastapi import APIRouter

router = APIRouter(prefix="/routes", tags=["routes"])

@router.get("/{callsign}")
async def get_route(callsign: str):
    url = f"https://api.adsbdb.com/v0/callsign/{callsign.upper()}"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(url)
            if res.status_code != 200:
                return {"departure": None, "destination": None}
            data = res.json()
    except Exception:
        return {"departure": None, "destination": None}

    route = data.get("response", {}).get("flightroute")
    if not route:
        return {"departure": None, "destination": None}

    return {
        "departure": route.get("origin", {}).get("iata_code"),
        "departure_name": route.get("origin", {}).get("name"),
        "destination": route.get("destination", {}).get("iata_code"),
        "destination_name": route.get("destination", {}).get("name"),
    }
