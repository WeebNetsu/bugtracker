import ProjectModel, { ProjectStatusModel } from "@/models/project";

// requests

// responses
export interface SingleProjectStatusPutResponseModel {
    data: ProjectModel;
}

export interface SingleProjectStatusPutRequestBodyModel {
    data?: Partial<ProjectStatusModel>;
}
