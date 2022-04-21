from pydantic import BaseModel, Field


class UserSchema(BaseModel):
    username: str = Field(...)
    password: str = Field(...)

    # what needs to be entered on post request
    class Config:
        schema_extra = {
            "example": {
                "username": "jackwow2",
                "password": "[some-encrypted-string]",
            }
        }
