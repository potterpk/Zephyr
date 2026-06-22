from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .api import router
from .services.opensky import fetch_flights


@asynccontextmanager
async def lifespan(app: FastAPI):
    await fetch_flights()
    yield


app = FastAPI(title="Zephyr", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
