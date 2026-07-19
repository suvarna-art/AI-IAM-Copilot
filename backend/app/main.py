from fastapi import FastAPI

app = FastAPI(
    title="IdentityForge AI - AI-IAM Copilot",
    description="Enterprise Identity Security Platform",
    version="1.0.0"
)

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