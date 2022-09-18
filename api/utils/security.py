import functools
from jose import jwt
from dotenv import dotenv_values
from datetime import datetime, timedelta
from logging import warn
from fastapi import status, HTTPException
from fastapi.security import HTTPBearer
from db import session
from db.login_tokens import LoginToken

config = dotenv_values()

SECRET_KEY = config["SECRET_KEY"]

if not SECRET_KEY:
    SECRET_KEY = "secret"
    warn("Secret key not provided, please provide key if in production.")

# encryption algorithm
ALGORITHM = "HS256"

# for the bearer token
secure = HTTPBearer(scheme_name="Authorization")


def create_jwt_token(data: dict):
    """
    Generate a JWT token that will expire in 30 days, with the data
    you want to store in it
    """
    to_encode = data.copy()

    # expire time of the token, in this case, 3 months
    expire = datetime.utcnow() + timedelta(days=90)
    # add expiry date, has to be called 'exp'
    to_encode.update({"exp": expire})
    # encode token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # return the generated token
    return encoded_jwt


def decode_jwt_token(token: str):
    """
    Decode JWT token
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def auth():
    """
    This is a decorator to make sure the user is authorised to visit/use a route
    """

    def dec(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # kwargs = {
            #     # pass default bearer value, so we don't have to on every route
            #     "bearer": secure,
            #     **kwargs,
            # }
            print("----- AUTH -----")
            print(kwargs)
            print("----- AUTH -----")
            # generally a token will look something like this:
            # eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ5ZXMiOjQ1LCJleHBpcmUiOiIiLCJleHAiOjE2NzEyODY5OTl9.lneO6DaNlqegjGmwrbO1fmSaqmpMGpKF2edJQmGn9-M
            token: str | None = kwargs["bearer"].credentials

            if not token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=[
                        {
                            "loc": ["auth", "token"],
                            "msg": "No token provided",
                            "type": "value_error.missing",
                        }
                    ],
                )

            isAllowed: LoginToken | None = None

            isAllowed = (
                session.query(LoginToken)
                .with_entities(LoginToken.id)
                .filter(
                    LoginToken.token == token,
                    LoginToken.user_id == 1,
                )
                .first()
            )

            # todo check if token has expired?

            if not isAllowed:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=[
                        {
                            "loc": ["auth", "token", "allowed"],
                            "msg": "Incorrect credentials, token is invalid",
                            "type": "auth_error.unauthorized",
                        }
                    ],
                    headers={"WWW-Authenticate": "Basic"},
                )

            return await func(*args, **kwargs)

        return wrapper

    return dec
