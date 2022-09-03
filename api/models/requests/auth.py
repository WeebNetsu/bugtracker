from pydantic import BaseModel, Field


class UserSignupBody(BaseModel):
    user_supabase_id: str = Field(
        ...,
        description="User Supabase ID",
        example="9872-xas3-as42",
        alias="userSupabaseId",
    )
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="User username",
        example="Mike Turner",
    )
