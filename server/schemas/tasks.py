from pydantic import BaseModel, Field
from enum import Enum


class STATUS(str, Enum):  # use an enum to foce it to be one of the allowed
    TODO = ("TODO",)
    DOING = ("DOING",)
    COMPLETED = ("COMPLETED",)


class TaskSchema(BaseModel):
    text: str = Field(...)
    status: STATUS = Field(STATUS.TODO)

    class Config:
        schema_extra = {
            "example": {
                "_id": "asdasd32",
                "text": "What to do next",
                "status": STATUS.TODO,
            }
        }
