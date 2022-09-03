from fastapi import APIRouter, status
from server.db import session
from server.db.tasks import Task
from server.db.users import User
from server.models.requests.tasks import AddTaskBody, DeleteTaskBody, UpdateTaskBody
from server.models.responses import BaseResponseModel
from server.models.responses.tasks import GetTaskResponseModel, GetTasksResponseModel
from server.utils.responses import convert_json, generate_response

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get(
    "",
    response_model=GetTasksResponseModel,
    description="Return all user tasks",
)
async def get_tasks(user_id: int):
    tasks: list[Task] = []

    query = session.query(Task)
    tasks = query.filter(Task.user_id == user_id).all()

    return generate_response(convert_json(tasks))


@router.post(
    "",
    response_model=BaseResponseModel,
    description="Add task",
)
async def get_tasks(body: AddTaskBody):
    user: User | None = (
        session.query(User)
        .with_entities(
            User.id,
        )
        .filter(User.id == body.user_id)
        .first()
    )

    if not user:
        return generate_response(
            {"success": False}, "User not found", status.HTTP_404_NOT_FOUND
        )

    add_task = Task(
        user_id=body.user_id,
        text=body.text,
        status=body.status,
        description=body.description,
    )

    session.add(add_task)
    session.commit()

    return generate_response({"success": True}, "Task was added.")


@router.get(
    "/{task_id}",
    response_model=GetTaskResponseModel,
    description="Return specific task",
)
async def get_task(task_id: int, user_id: int):
    task: Task | None = None

    query = session.query(Task)
    task = query.filter(Task.user_id == user_id, Task.id == task_id).first()

    if not task:
        return generate_response(
            {"success": False}, "Task not found", status.HTTP_404_NOT_FOUND
        )

    return generate_response(convert_json(task))


@router.put(
    "/{task_id}",
    response_model=BaseResponseModel,
    description="Update task",
)
async def update_task(body: UpdateTaskBody, task_id: int):
    task: Task | None = None

    query = session.query(Task)
    filtered_query = query.filter(Task.user_id == body.user_id, Task.id == task_id)
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

    return generate_response({"success": True}, "Task was updated.")


@router.delete(
    "/{task_id}", response_model=BaseResponseModel, description="Delete task"
)
async def delete_task(body: DeleteTaskBody, task_id: int):
    task: Task | None = None

    query = session.query(Task)
    filtered_query = query.filter(Task.user_id == body.user_id, Task.id == task_id)
    task = filtered_query.first()

    if not task:
        return generate_response(
            {"success": False}, "Task not found", status.HTTP_404_NOT_FOUND
        )

    filtered_query.delete(
        {
            Task.id: task_id,
        }
    )
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
