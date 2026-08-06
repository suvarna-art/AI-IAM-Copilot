from fastapi import FastAPI
from app.routers.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.activities import router as activities_router
from app.routers.ai_confidence import router as ai_confidence_router
from app.routers import risk_intelligence
from app.api import access_review

app = FastAPI(
    title="IdentityForge AI - AI-IAM Copilot",
    description="Enterprise Identity Security Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(activities_router)
app.include_router(ai_confidence_router)
app.include_router(risk_intelligence.router)
app.include_router(access_review.router)

@app.get("/")
def root():
    return {
        "company": "IdentityForge AI",
        "product": "AI-IAM Copilot",
        "message": "Forging the Future of Identity Security"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "application": "AI-IAM Copilot"
    }