from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class STATUS(str, Enum):  # use an enum to foce it to be one of the allowed
    TODO = ("TODO",)
    DOING = ("DOING",)
    COMPLETED = ("COMPLETED",)


class TaskSchema(BaseModel):
    text: str = Field(...)
    status: STATUS = Field(STATUS.TODO)
    comment: str = Field("")

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "text": "What to do next",
                "status": STATUS.TODO,
                "comment": "I am Groot",
            }
        }


class UpdateTaskSchema(BaseModel):
    text: Optional[str]
    status: Optional[STATUS]
    comment: Optional[str]

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "text": "What to do next 2",
                "status": STATUS.COMPLETED,
            }
        }
