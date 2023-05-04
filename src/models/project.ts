import { ObjectId } from "mongodb";

export interface ProjectStatusModel {
    _id: ObjectId;
    /**
     * Title of the status that will be shown to
     * the user
     */
    title: string;
}

interface ProjectModel {
    _id: ObjectId;
    /**
     * ID of user this project belongs to
     */
    ownerId: ObjectId;
    /**
     * Project title
     */
    title: string;
    /**
     * Project description
     */
    description?: string;
    /**
     * Available project statuses
     */
    statuses: ProjectStatusModel[];
    /**
     * Date project was created on
     */
    createdAt: Date;
}

export default ProjectModel;
