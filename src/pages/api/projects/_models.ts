import ProjectModel from "@/models/project";
import ProjectStatusModel from "@/models/projectStatus";

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
    statuses?: Omit<Omit<ProjectStatusModel, "_id">, "projectId">[];
}

export interface ProjectsGetResponseModel {
    data: ProjectModel[];
}
