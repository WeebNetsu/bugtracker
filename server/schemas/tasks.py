from pydantic import BaseModel, Field
from enum import Enum


class STATUS(str, Enum):  # use an enum to foce it to be one of the allowed
    TODO = ("TODO",)
    DOING = ("DOING",)
    COMPLETED = ("COMPLETED",)


class TaskSchema(BaseModel):
    text: str = Field(...)
    status: STATUS = Field(STATUS.TODO)

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "text": "What to do next",
                "status": STATUS.TODO,
            }
        }
