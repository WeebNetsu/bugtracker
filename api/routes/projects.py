from fastapi import APIRouter, status
from db.users import User
from utils import getUserOnSupabaseId
from db import session
from db.projects import Project
from models.responses.tasks import (
    GetTasksResponse,
    GetTasksResponseModel,
)
from utils.responses import convert_json, generate_response

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get(
    "",
    response_model=GetTasksResponseModel,
    description="Return all user projects",
)
async def get_projects(user_id: str):
    user: User | None = getUserOnSupabaseId(user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    projects: list[Project] = (
        session.query(Project).filter(Project.owner_id == user.id).all()
    )

    return_tasks: list[GetTasksResponse] = []
    for task in projects:
        return_tasks.append(
            {
                "user_id": user_id,
                "text": task.text,
                "description": task.description,
                "status": task.status,
                "id": task.id,
            }
        )

    return generate_response(convert_json(return_tasks))
