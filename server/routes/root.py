from models.responses import ResponseModel
from fastapi import APIRouter

router = APIRouter(prefix="", tags=["root"])


@router.post("/login", response_description="Log in to existing account")
async def login_route():
    return ResponseModel({}, "Login Success.")


@router.post("/signup", response_description="Create new user account")
async def signup_route():
    return ResponseModel({}, "Signup Success.")
