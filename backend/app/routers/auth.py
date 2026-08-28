import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.security.auth import (
    create_access_token,
    verify_password,
)
from app.security.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def get_admin_credentials() -> tuple[str, str]:
    username = os.getenv("ADMIN_USERNAME")
    password_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if not username or not password_hash:
        raise RuntimeError(
            "Admin authentication environment variables are not configured."
        )

    return username, password_hash


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    try:
        admin_username, admin_password_hash = (
            get_admin_credentials()
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is not configured.",
        ) from exc

    username_valid = (
        form_data.username == admin_username
    )

    password_valid = verify_password(
        form_data.password,
        admin_password_hash,
    )

    if not username_valid or not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    access_token = create_access_token(
        subject=admin_username,
        role="admin",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin",
        "expires_in_minutes": 30,
    }


@router.get("/me")
def get_authenticated_user(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return current_user