import { ObjectId } from "mongodb";

interface TaskModel {
    _id: ObjectId;
    /**
     * Supabase ID of user who created this task
     */
    ownerId: string;
    /**
     * ID of the project this task belongs to
     */
    projectId: ObjectId;
    /**
     * ID of the status this task belongs to, such
     * as TODO/IN PROGRESS/COMPLETED - these statuses
     * can be found on the project model
     */
    statusId?: ObjectId;
    title: string;
    description?: string;
    createdAt: Date;
    archived: boolean;
    /**
     * Where in the status should this task be (lower the higher on the list)
     */
    order: number;
}

export default TaskModel;
