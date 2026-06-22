import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/tracks", tags=["tracks"])

@router.get("/{icao24}")
async def get_track(icao24: str):
    url = f"https://opensky-network.org/api/tracks/all?icao24={icao24}&time=0"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url)
            if res.status_code == 404:
                return {"path": []}
            res.raise_for_status()
            data = res.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    path = [
        {"lat": p[1], "lon": p[2], "alt": p[3]}
        for p in (data.get("path") or [])
        if p[1] is not None and p[2] is not None
    ]
    return {"icao24": icao24, "path": path}
