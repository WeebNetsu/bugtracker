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
    statusId?: string;
    title: string;
    description?: string;
    createdAt: Date;
    archived?: boolean;
}

export default TaskModel;
