from db.tasks import add_task, retrieve_tasks
from models.responses import ResponseModel
from schemas.tasks import TaskSchema
from fastapi.encoders import jsonable_encoder
from fastapi import Body, APIRouter

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/")
async def get_tasks():
    task = await retrieve_tasks()
    if task:
        return ResponseModel(task, "Tasks data retrieved successfully")
    return ResponseModel(task, "Empty list returned")


@router.post("/", response_description="Task data added into the database")
async def add_task(task: TaskSchema = Body(...)):
    task = jsonable_encoder(task)
    new_task = await add_task(task)
    return ResponseModel(new_task, "Task added successfully.")
