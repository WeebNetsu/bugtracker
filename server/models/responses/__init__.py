from pydantic import BaseModel, Field


class BaseResponse(BaseModel):
    success: bool = Field(
        True,
        example=True,
        description="If action was successful, will be true",
    )


class BaseResponseModel(BaseModel):
    data: BaseResponse | None
    code: int = Field(..., example=200, gt=99, lt=600)
    message: str = Field(..., example="Success")
