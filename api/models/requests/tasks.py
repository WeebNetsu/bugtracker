from pydantic import BaseModel, Field

from models import STATUS


class AddTaskBody(BaseModel):
    user_id: int = Field(
        ...,
        description="User ID",
        example="9872",
        alias="userId",
        gt=0,
    )
    text: str = Field(
        ...,
        description="Title text of the task",
        example="Eat Pizza",
        min_length=1,
    )
    description: str | None = Field(
        None,
        description="Description text of task",
        example="If we don't eat, we can go hungry!",
    )
    status: STATUS = Field(
        STATUS.TODO, example=STATUS.TODO, description="The current status of the task"
    )


class UpdateTaskBody(BaseModel):
    user_id: int = Field(
        ...,
        description="User ID",
        example="9872",
        alias="userId",
        gt=0,
    )
    text: str | None = Field(
        None,
        description="Title text of the task",
        example="Eat Pizza",
        min_length=1,
    )
    description: str | None = Field(
        None,
        description="Description text of task",
        example="If we don't eat, we can go hungry!",
    )
    status: STATUS | None = Field(
        None, example=STATUS.TODO, description="The current status of the task"
    )


class DeleteTaskBody(BaseModel):
    user_id: int = Field(
        ...,
        description="User ID",
        example="9872",
        alias="userId",
        gt=0,
    )
