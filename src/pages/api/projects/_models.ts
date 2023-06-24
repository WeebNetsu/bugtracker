import ProjectModel from "@/models/project";

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
    statuses?: {
        title: string;
        orderIndex: number;
    }[];
}

export interface ProjectsGetResponseModel {
    data: ProjectModel[];
}
