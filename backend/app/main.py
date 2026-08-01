from fastapi import FastAPI
from app.routers.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

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