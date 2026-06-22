import httpx
from fastapi import APIRouter

router = APIRouter(prefix="/aircraft", tags=["aircraft"])

@router.get("/{icao24}")
async def get_aircraft(icao24: str):
    url = f"https://api.adsbdb.com/v0/aircraft/{icao24.lower()}"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(url)
            if res.status_code != 200:
                return {"type": None, "registration": None}
            data = res.json()
    except Exception:
        return {"type": None, "registration": None}

    info = data.get("response", {}).get("aircraft")
    if not info:
        return {"type": None, "registration": None}

    return {
        "type": info.get("type"),
        "registration": info.get("registration"),
        "manufacturer": info.get("manufacturer_name"),
    }
