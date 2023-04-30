from pydantic import BaseModel, Field
from models.responses import BaseResponseModel


class SignupResponse(BaseModel):
    token: str = Field(
        ...,
        example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        description="JWT token required to access some routes",
    )


class SignupResponseModel(BaseResponseModel):
    data: SignupResponse
