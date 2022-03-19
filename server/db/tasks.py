from schemas.tasks import TaskSchema
from . import client

database = client.tasks

tasks_collection = database.get_collection("tasks")


def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "text": task["text"],
        "status": task["status"],
    }


async def retrieve_tasks(task_id: str | None = None) -> list[TaskSchema] | TaskSchema:
    if task_id:
        task = await tasks_collection.find_one({"_id": task_id})
        return task

    tasks = []
    async for task in tasks_collection.find():
        tasks.append(task_helper(task))

    return tasks


async def add_task(task_data: dict) -> dict:
    task = await tasks_collection.insert_one(task_data)
    new_task = await tasks_collection.find_one({"_id": task.inserted_id})

    return task_helper(new_task)


async def delete_task(task_data: dict) -> dict:
    task = await tasks_collection.insert_one(task_data)
    new_task = await tasks_collection.find_one({"_id": task.inserted_id})

    return task_helper(new_task)
