import ProjectModel, { ProjectStatusModel } from "@/models/project";

// requests
export interface SingleProjectStatusPostRequestBodyModel {
    data?: ProjectStatusModel;
}

// responses
export interface SingleProjectStatusPostResponseModel {
    data: ProjectModel;
}
