from pydantic import BaseModel, Field
from models.responses import BaseResponseModel
from models import STATUS


class GetTasksResponse(BaseModel):
    id: int = Field(..., example=267)
    text: str = Field(..., example="Eat Pizza", description="The task title")
    # in progress / todo / completed
    status: STATUS = Field(
        ...,
        example=STATUS.TODO,
        description="Task status, usually in progress, todo or completed",
    )
    description: str | None = Field(
        None,
        example="We need to eat or we'll go hungry!",
        description="The description text given to task",
    )
    user_id: int = Field(
        ...,
        example=32,
        alias="userId",
        description="The user who created this task",
    )
    tags: list[int] = Field(
        [], example=[542, 234], description="The tags assigned to this task"
    )
    project_id: int = Field(
        ...,
        example=322,
        alias="projectId",
        description="The project this task belongs to",
    )


class GetTasksResponseModel(BaseResponseModel):
    data: list[GetTasksResponse] | None


class GetTaskResponseModel(BaseResponseModel):
    data: GetTasksResponse
