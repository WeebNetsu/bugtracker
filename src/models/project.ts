import { ObjectId } from "mongodb";

interface ProjectModel {
    _id: ObjectId;
    /**
     * Supabase ID of user this project belongs to
     */
    ownerId: string;
    title: string;
    description?: string;
    createdAt: Date;
}

export default ProjectModel;
