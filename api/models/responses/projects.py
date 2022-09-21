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
    owner_id: str = Field(
        ...,
        example="9872-xas3-as42",
        alias="ownerId",
        description="ID of the user who created this task (Supabase ID)",
    )
    read_team: list[str] = Field(
        [],
        example=["9872-xas3-as42", "9872-aaaa-as42", "9872-xas3-xxxx"],
        alias="readTeam",
        description="Users ID that are guests (only have read access) on the project. Will be user Supabase ID",
    )
    write_team: list[str] = Field(
        [],
        example=["9872-xas3-as42", "9872-aaaa-as42", "9872-xas3-xxxx"],
        alias="writeTeam",
        description="Users ID that can modify project tasks, but not project settings. Will be user Supabase ID",
    )
    admin_team: list[str] = Field(
        [],
        example=["9872-xas3-as42", "9872-aaaa-as42", "9872-xas3-xxxx"],
        alias="adminTeam",
        description="Users ID that have full admin access to project. Will be user Supabase ID",
    )
    tags: list[int] = Field(
        [], example=[231, 492], description="All the tag IDs on this project"
    )


class GetProjectsResponseModel(BaseResponseModel):
    data: list[GetProjectResponse] | None


class GetProjectResponseModel(BaseResponseModel):
    data: GetProjectResponse
