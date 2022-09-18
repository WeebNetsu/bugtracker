from pydantic import BaseModel, Field
from models.responses import BaseResponseModel


class SignupResponse(BaseModel):
    user_id: int = Field(..., example=267, description="The new users ID")


class SignupResponseModel(BaseResponseModel):
    data: SignupResponse
