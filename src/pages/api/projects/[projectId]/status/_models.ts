import ProjectStatusModel from "@/models/projectStatus";

// requests
export interface ProjectStatusesPostRequestBodyModel {
    /**
     * Title of the status that will be shown to
     * the user
     */
    title: string;
    /**
     * The order in which the statuses should be, aka its index in the array
     */
    // orderIndex: number;
}

// responses
export interface SingleProjectStatusPostResponseModel {
    data: ProjectStatusModel;
}

export interface ProjectsStatusesGetResponseModel {
    data: ProjectStatusModel[];
}
