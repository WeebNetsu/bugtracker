import ProjectModel, { ProjectStatusModel } from "@/models/project";

// requests
export interface SingleProjectStatusPutRequestBodyModel {
    data?: Partial<ProjectStatusModel>;
}

// responses
export interface SingleProjectStatusPutResponseModel {
    data: ProjectModel;
}

export interface SingleProjectStatusDeleteResponseModel {
    data: ProjectModel;
}
