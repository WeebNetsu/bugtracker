from db.tasks import add_task, retrieve_tasks
from models.responses import ResponseModel
from schemas.tasks import TaskSchema
from fastapi.encoders import jsonable_encoder
from fastapi import Body, APIRouter

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/")
async def get_tasks_route():
    tasks = await retrieve_tasks()
    if tasks:
        return ResponseModel(tasks, "Tasks data retrieved successfully")
    return ResponseModel(tasks, "Empty list returned")


@router.post("/", response_description="Task data added into the database")
async def add_task_route(task: TaskSchema = Body(...)):
    task = jsonable_encoder(task)
    new_task = await add_task(task)
    return ResponseModel(new_task, "Task added successfully.")


@router.get("/{task_id}")
async def get_task_route(task_id: str):
    task = await retrieve_tasks(task_id)
    if task:
        return ResponseModel(task, "Task data retrieved successfully")
    return ResponseModel(task, "No task found returned")
