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
    description: str = Field("")
    userId: str = Field(...)

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "text": "What to do next",
                "status": STATUS.TODO,
                "description": "I am Groot",
                "userId": "12GSA3-SDE34-3S45DF",
            }
        }


class UpdateTaskSchema(BaseModel):
    text: Optional[str]
    status: Optional[STATUS]
    description: Optional[str]

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "text": "What to do next 2",
                "status": STATUS.COMPLETED,
            }
        }
