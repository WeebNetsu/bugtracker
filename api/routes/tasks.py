from fastapi import APIRouter, status, Depends
from db.users import User
from utils import get_user_with_id
from db import session
from db.tasks import Task
from models.requests.tasks import (
    AddTaskBody,
    UpdateTaskBody,
)
from models.responses import BaseResponseModel
from models.responses.tasks import (
    GetTaskResponseModel,
    GetTasksResponse,
    GetTasksResponseModel,
)
from utils.responses import convert_json, generate_response
from utils.security import auth, secure

router = APIRouter(prefix="/tasks", tags=["tasks"])

# NOTE: user_id will almost always refer to the user supabase id!


@router.get(
    "",
    response_model=GetTasksResponseModel,
    description="Return all user tasks",
)
@auth()
async def get_tasks(user_id: str, bearer: str = Depends(secure)):
    user: User | None = get_user_with_id(user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    tasks: list[Task] = session.query(Task).filter(Task.user_id == user.id).all()

    return_tasks: list[GetTasksResponse] = []
    for task in tasks:
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


@router.post(
    "",
    response_model=GetTaskResponseModel,
    description="Add task",
)
async def get_tasks(body: AddTaskBody):
    user: User | None = get_user_with_id(body.user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    add_task = Task(
        user_id=user.id,
        text=body.text,
        status=body.status,
        description=body.description,
    )

    session.add(add_task)
    session.commit()

    return_task: GetTasksResponse = {
        "user_id": user.id,
        "text": add_task.text,
        "description": add_task.description,
        "status": add_task.status,
        "id": add_task.id,
    }

    return generate_response(convert_json(return_task), "Task was added.")


@router.get(
    "/{task_id}",
    response_model=GetTaskResponseModel,
    description="Return specific task",
)
async def get_task(task_id: int, user_id: str):
    user: User | None = get_user_with_id(user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    task: Task | None = (
        session.query(Task).filter(Task.user_id == user_id, Task.id == task_id).first()
    )

    if not task:
        return generate_response(
            {"success": False}, "Task not found", status.HTTP_404_NOT_FOUND
        )

    return_task: GetTasksResponse = {
        "user_id": user_id,
        "text": task.text,
        "description": task.description,
        "status": task.status,
        "id": task.id,
    }

    return generate_response(convert_json(return_task))


@router.put(
    "/{task_id}",
    response_model=GetTaskResponseModel,
    description="Update task",
)
async def update_task(body: UpdateTaskBody, task_id: int):
    user: User | None = get_user_with_id(body.user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    task: Task | None = None

    query = session.query(Task)
    filtered_query = query.filter(Task.user_id == user.id, Task.id == task_id)
    task = filtered_query.first()

    if not task:
        return generate_response(
            {"success": False}, "Task not found", status.HTTP_404_NOT_FOUND
        )

    filtered_query.update(
        {
            Task.status: body.status or task.status,
            Task.description: body.description or task.description,
            Task.text: body.text or task.text,
        }
    )

    session.commit()

    updated_task = filtered_query.first()

    return_task: GetTasksResponse = {
        "user_id": user.id,
        "text": updated_task.text,
        "description": updated_task.description,
        "status": updated_task.status,
        "id": updated_task.id,
    }

    return generate_response(convert_json(return_task), "Task was updated.")


@router.delete(
    "/{task_id}", response_model=BaseResponseModel, description="Delete task"
)
async def delete_task(user_id: str, task_id: int):
    user: User | None = get_user_with_id(user_id)

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    task: Task | None = None

    query = session.query(Task)
    filtered_query = query.filter(Task.user_id == user.id, Task.id == task_id)
    task = filtered_query.first()

    if not task:
        return generate_response(
            {"success": False}, "Task not found", status.HTTP_404_NOT_FOUND
        )

    filtered_query.delete()
    session.commit()

    return generate_response({"success": True}, "Task was deleted.")


""" 
@router.delete("/", response_description="Delete specific tasks")
async def delete_task_route(status: STATUS):
    try:
        await delete_tasks(status)
        return ResponseModel({}, "Tasks deleted successfully.")
    except Exception as e:
        print(e)
        return ResponseModel({}, "Tasks could not be deleted", 500)
 """
