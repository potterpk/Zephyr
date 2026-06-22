from pydantic import BaseModel
from typing import Optional


class Flight(BaseModel):
    icao24: str
    callsign: Optional[str] = None
    origin_country: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    altitude: Optional[float] = None
    velocity: Optional[float] = None
    heading: Optional[float] = None
    vertical_rate: Optional[float] = None
    on_ground: bool = False
    squawk: Optional[str] = None
    last_contact: Optional[int] = None
