import { ObjectId } from "mongodb";

interface TaskModel {
    _id: ObjectId;
    /**
     * ID of user who created this task
     */
    creatorId: ObjectId;
    /**
     * ID of the project this task belongs to
     */
    projectId: ObjectId;
    /**
     * ID of the status this task belongs to, such
     * as TODO/IN PROGRESS/COMPLETED - these statuses
     * can be found on the project
     */
    statusId?: ObjectId;
    /**
     * Task title
     */
    title: string;
    /**
     * Task description
     */
    description?: string;
    /**
     * Date task was created on
     */
    createdAt: Date;
}

export default TaskModel;
