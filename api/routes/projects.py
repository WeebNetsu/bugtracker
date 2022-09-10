from fastapi import APIRouter, status
from db.users import User
from models.requests.projects import AddProjectBody
from models.responses.projects import GetProjectResponse, GetProjectResponseModel
from utils import get_user_with_id
from db import session
from db.projects import Project
from utils.responses import convert_json, generate_response

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post(
    "",
    response_model=GetProjectResponseModel,
    description="Create new project",
)
async def create_project(body: AddProjectBody):
    user: User | None = get_user_with_id(body.user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    # projects: list[Project] = (
    #     session.query(Project)
    #     .filter(Project.owner_id == user.id, Project.title == body.title)
    #     .all()
    # )

    # if len(projects) > 0:
    #     return generate_response(
    #         {"success": False}, "Project with this name already exists", status.HTTP_400_BAD_REQUEST
    #     )

    add_project = Project(
        title=body.title,
        description=body.description,
        owner_id=user.id,
        # todo check to make sure all users in below exist in db
        read_team=body.read_team,
        write_team=body.write_team,
        admin_team=body.admin_team,
    )

    session.add(add_project)
    session.commit()

    # todo maybe we should make the supabase ID the users id, this mix and matching
    # is becoming really combersome
    return_project: GetProjectResponse = {
        "id": add_project.id,
        "title": add_project.title,
        "description": add_project.description,
        "owner_id": add_project.owner_id,
        "read_team": add_project.read_team,
        "write_team": add_project.write_team,
        "admin_team": add_project.admin_team,
        "tags": [],
    }

    return generate_response(convert_json(return_project), "Project was created.")
