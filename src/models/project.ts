import { ObjectId } from "mongodb";

export interface ProjectStatusModel {
    _id: string;
    /**
     * Title of the status that will be shown to
     * the user
     */
    title: string;
    /**
     * The order in which the statuses should be, aka its index in the array
     */
    orderIndex: number;
}

interface ProjectModel {
    _id: ObjectId;
    /**
     * Supabase ID of user this project belongs to
     */
    ownerId: string;
    title: string;
    description?: string;
    /**
     * Available project statuses
     */
    statuses: ProjectStatusModel[];
    createdAt: Date;
}

export default ProjectModel;
