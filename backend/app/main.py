from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.dashboard import router as dashboard_router
from app.routers.activities import router as activities_router
from app.routers.ai_confidence import router as ai_confidence_router

from app.routers import risk_intelligence
from app.routers import copilot
from app.routers import identities
from app.routers import analytics
from app.api import access_review
from app.api import access_control
from app.routers import settings


app = FastAPI(
    title="IdentityForge AI - AI-IAM Copilot",
    description="Enterprise Identity Security Platform",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# APPLICATION ROUTERS
# =========================================================

app.include_router(dashboard_router)

app.include_router(activities_router)

app.include_router(ai_confidence_router)

app.include_router(risk_intelligence.router)

app.include_router(access_review.router)

app.include_router(access_control.router)

app.include_router(copilot.router)

app.include_router(identities.router)

app.include_router(analytics.router)

app.include_router(settings.router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "company": "IdentityForge AI",
        "product": "AI-IAM Copilot",
        "message": "Forging the Future of Identity Security",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "application": "AI-IAM Copilot",
    }