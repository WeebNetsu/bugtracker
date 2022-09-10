from pydantic import BaseModel, Field


class AddProjectBody(BaseModel):
    user_id: str | int = Field(
        ...,
        description="User (project creator) ID or Supabase ID",
        example="9872a-sde82-8as8a",
        alias="userId",
    )
    title: str = Field(
        ...,
        description="Title of the project",
        example="Pizzaria",
        min_length=2,
        max_length=50,
    )
    description: str | None = Field(
        None,
        description="Description text",
        example="This project will allow us to manage all the pizzas we need to make.",
        max_length=5000,
    )
    read_team: list[str] | None = Field(
        [],
        description="List of user IDs that has read access to project",
        example=["9872a-11111-8as8a", "9872a-sde82-9999"],
    )
    write_team: list[str] | None = Field(
        [],
        description="List of user IDs that has write access to project",
        example=["9872a-11111-8as8a", "9872a-sde82-9999"],
    )
    admin_team: list[str] | None = Field(
        [],
        description="List of user IDs that has admin access to project",
        example=["9872a-11111-8as8a", "9872a-sde82-9999"],
    )
