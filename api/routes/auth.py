from fastapi import APIRouter, status
from models.requests.auth import UserSignupBody
from db import session
from db.users import User
from models.responses import BaseResponseModel
from utils.responses import generate_response

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=BaseResponseModel,
    description="Signup user",
)
async def signup(body: UserSignupBody):
    user_id_check: User | None = (
        session.query(User)
        .with_entities(User.supabase_id)
        .filter(User.supabase_id == body.user_supabase_id)
        .first()
    )

    # todo: make sure the user supabase_id exists on supabase
    if user_id_check:
        return generate_response(
            {"success": False}, "User already exists", status.HTTP_403_FORBIDDEN
        )

    user_username_check: User | None = (
        session.query(User)
        .with_entities(User.username)
        .filter(User.username == body.username)
        .first()
    )

    if user_username_check:
        return generate_response(
            {"success": False}, "Username already in use", status.HTTP_403_FORBIDDEN
        )

    add_user = User(supabase_id=body.user_supabase_id, username=body.username)

    session.add(add_user)
    session.commit()

    return generate_response(
        {"success": True},
    )
