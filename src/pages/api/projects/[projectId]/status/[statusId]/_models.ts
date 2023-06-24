import ProjectStatusModel from "@/models/projectStatus";

// requests
export interface SingleProjectStatusPutRequestBodyModel {
    data?: Partial<ProjectStatusModel>;
}

// responses
export interface SingleProjectStatusPutResponseModel {
    data: ProjectStatusModel;
}
