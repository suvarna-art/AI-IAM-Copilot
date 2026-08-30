import os
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash


JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()


def get_jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET_KEY")

    if not secret:
        raise RuntimeError(
            "JWT_SECRET_KEY environment variable is not configured."
        )

    return secret


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    subject: str,
    role: str,
) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": subject,
        "role": role,
        "iat": now,
        "exp": now
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        payload,
        get_jwt_secret(),
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict:
    return jwt.decode(
        token,
        get_jwt_secret(),
        algorithms=[JWT_ALGORITHM],
    )