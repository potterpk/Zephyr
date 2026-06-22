from fastapi import APIRouter
from .flights import router as flights_router
from .tracks import router as tracks_router

router = APIRouter()
router.include_router(flights_router)
router.include_router(tracks_router)
