from pydantic import BaseModel, Field
from models.responses import BaseResponseModel
from models import STATUS


class GetTasksResponse(BaseModel):
    id: int = Field(..., example=267)
    # supabase has email and password details
    text: str = Field(..., example="Eat Pizza")
    # in progress / todo / completed
    status: STATUS = Field(..., example=STATUS.TODO)
    # task description
    description: str | None = Field(None, example="We need to eat or we'll go hungry!")
    user_id: str = Field(..., example="qwert-y232s-sa23a", alias="userId")


class GetTasksResponseModel(BaseResponseModel):
    data: list[GetTasksResponse] | None


class GetTaskResponseModel(BaseResponseModel):
    data: GetTasksResponse