from fastapi import APIRouter
from .flights import router as flights_router
from .tracks import router as tracks_router
from .routes import router as routes_router
from .aircraft import router as aircraft_router

router = APIRouter()
router.include_router(flights_router)
router.include_router(tracks_router)
router.include_router(routes_router)
router.include_router(aircraft_router)
