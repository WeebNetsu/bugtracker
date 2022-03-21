from schemas.tasks import TaskSchema
from . import client
from bson import ObjectId

database = client.tasks

tasks_collection = database.get_collection("tasks")


def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "text": task["text"],
        "status": task["status"],
        "comment": task["comment"] or "",
    }


async def retrieve_tasks(task_id: str | None = None) -> list[TaskSchema] | TaskSchema:
    if task_id:
        task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
        return task

    tasks = []
    async for task in tasks_collection.find():
        tasks.append(task_helper(task))

    return tasks


async def add_task(task_data: dict) -> dict:
    task = await tasks_collection.insert_one(task_data)
    new_task = await tasks_collection.find_one({"_id": task.inserted_id})

    return task_helper(new_task)


async def delete_task(task_id: str) -> dict:
    await tasks_collection.delete_one({"_id": ObjectId(task_id)})


async def update_task(task_id: str, task_data: dict) -> dict:
    # remove all non-added items from task_data
    task = {k: v for k, v in task_data.items() if v is not None}

    update_result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id)}, {"$set": task}
    )

    if update_result.modified_count == 1:
        if (
            updated_res := await tasks_collection.find_one({"_id": task_id})
        ) is not None:
            return task_helper(updated_res)
        else:
            return task

    raise Exception("No task updated")
