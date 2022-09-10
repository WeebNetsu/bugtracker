from pydantic import BaseModel, Field
from models.responses import BaseResponseModel


class GetProjectResponse(BaseModel):
    id: int = Field(..., example=267)
    title: str = Field(..., example="Pizza Orders", description="The project title")
    description: str | None = Field(
        None,
        example="This projects are so we can manage our pizza orders",
        description="The description text given to the project",
    )
    owner_id: int = Field(
        ...,
        example=3,
        alias="ownerId",
        description="ID of the user who created this task",
    )
    read_team: list[int] = Field(
        [],
        example=[23, 342, 123],
        alias="readTeam",
        description="Users ID that are guests (only have read access) on the project",
    )
    write_team: list[int] = Field(
        [],
        example=[23, 342, 123],
        alias="writeTeam",
        description="Users ID that can modify project tasks, but not project settings",
    )
    admin_team: list[int] = Field(
        [],
        example=[23, 342, 123],
        alias="adminTeam",
        description="Users ID that have full admin access to project",
    )
    tags: list[int] = Field(
        [], example=[231, 492], description="All the tag IDs on this project"
    )


class GetProjectsResponseModel(BaseResponseModel):
    data: list[GetProjectResponse] | None


class GetProjectResponseModel(BaseResponseModel):
    data: GetProjectResponse
