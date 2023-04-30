from fastapi import APIRouter, status
from models.requests.auth import UserSignupBody
from db import session
from db.users import User
from models.responses.auth import SignupResponse, SignupResponseModel
from utils.responses import generate_response
from utils.security import JWTTokenDataModel, create_jwt_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=SignupResponseModel,
    description="Signup user and receive a JWT",
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

    token = create_jwt_token(JWTTokenDataModel(userId=add_user.id))

    result = SignupResponse(token=token)

    return generate_response(result)


@router.post(
    "/login",
    response_model=SignupResponseModel,
    description="Log user in and receive a JWT",
)
async def login(body: UserSignupBody):
    selected_user: User | None = (
        session.query(User)
        .with_entities(User.supabase_id, User.id)
        .filter(User.supabase_id == body.user_supabase_id)
        .first()
    )

    # todo: make sure the user supabase_id exists on supabase
    if not selected_user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    # todo: check if user password is correct on supabase

    token = create_jwt_token(JWTTokenDataModel(userId=selected_user.id))

    result = SignupResponse(token=token)

    return generate_response(result)
