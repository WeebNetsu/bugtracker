from db.tasks import add_task, delete_task, delete_tasks, retrieve_tasks, update_task
from models.responses import ResponseModel
from schemas.tasks import TaskSchema, UpdateTaskSchema, STATUS
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


@router.delete("/", response_description="Delete specific tasks")
async def delete_task_route(status: STATUS):
    try:
        await delete_tasks(status)
        return ResponseModel({}, "Tasks deleted successfully.")
    except Exception as e:
        print(e)
        return ResponseModel({}, "Tasks could not be deleted", 500)


@router.get("/{task_id}")
async def get_task_route(task_id: str):
    task = await retrieve_tasks(task_id)
    if task:
        return ResponseModel(task, "Task data retrieved successfully")
    return ResponseModel(task, "No task found returned")


@router.put("/{task_id}", response_description="Update a task")
async def update_task_route(task_id: str, task: UpdateTaskSchema = Body(...)):
    try:
        task = jsonable_encoder(task)
        updated_task = await update_task(task_id, task)
        return ResponseModel(updated_task, "Task updated successfully.")
    except Exception as e:
        print(e)
        return ResponseModel({}, "Task could not be updated", 500)


@router.delete("/{task_id}", response_description="Delete a task")
async def delete_task_route(task_id: str):
    try:
        await delete_task(task_id)
        return ResponseModel({}, "Task deleted successfully.")
    except Exception as e:
        print(e)
        return ResponseModel({}, "Task could not be deleted", 500)
