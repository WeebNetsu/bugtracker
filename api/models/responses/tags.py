from pydantic import BaseModel, Field
from models.responses import BaseResponseModel


class GetTagResponse(BaseModel):
    id: int = Field(..., example=267)
    title: str = Field(..., example="Cheese", description="The tag title")
    description: str | None = Field(
        None,
        example="This is the topping we should put on the pizza",
        description="The description for the tag",
    )
    project_id: int = Field(
        ...,
        example=23,
        alias="projectId",
        description="ID of the project that owns this tag",
    )
    color: str = Field(..., example="F97EA1", description="Hex color value for tag")


class GetTagsResponseModel(BaseResponseModel):
    data: list[GetTagResponse] | None


class GetTagResponseModel(BaseResponseModel):
    data: GetTagResponse
