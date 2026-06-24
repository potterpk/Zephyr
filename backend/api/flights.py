from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..services.opensky import fetch_flights

router = APIRouter(prefix="/flights", tags=["flights"])


@router.get("/")
async def get_flights(country: Optional[str] = Query(None)):
    flights = await fetch_flights()
    if country:
        flights = [f for f in flights if f.origin_country == country]
    return flights


@router.get("/{icao24}")
async def get_flight(icao24: str):
    flights = await fetch_flights()
    match = next((f for f in flights if f.icao24 == icao24), None)
    if not match:
        raise HTTPException(status_code=404, detail="flight not found")
    return match
