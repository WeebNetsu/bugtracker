import { ProjectStatusModel } from "@/models/project";

export interface ProjectsCreatePostRequestBodyModel {
    /**
     * Project title
     */
    title?: string;
    /**
     * Project description
     */
    description?: string;
    /**
     * Available project statuses
     */
    statuses?: Omit<ProjectStatusModel, "_id">[];
}
