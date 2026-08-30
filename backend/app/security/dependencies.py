from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import OAuth2PasswordBearer
from jwt import (
    ExpiredSignatureError,
    InvalidTokenError,
)

from app.security.auth import (
    decode_access_token,
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(
        oauth2_scheme
    ),
) -> dict:
    try:
        payload = decode_access_token(
            token
        )

        username = payload.get(
            "sub"
        )

        role = payload.get(
            "role"
        )

        if not username or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
                headers={
                    "WWW-Authenticate":
                        "Bearer"
                },
            )

        return {
            "username": username,
            "role": role,
        }

    except ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired.",
            headers={
                "WWW-Authenticate":
                    "Bearer"
            },
        ) from exc

    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={
                "WWW-Authenticate":
                    "Bearer"
            },
        ) from exc


def require_admin(
    current_user: dict = Depends(
        get_current_user
    ),
) -> dict:
    if (
        current_user.get("role")
        != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Administrator privileges "
                "are required."
            ),
        )

    return current_user