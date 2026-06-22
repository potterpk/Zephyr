from fastapi import APIRouter
from .flights import router as flights_router

router = APIRouter()
router.include_router(flights_router)
