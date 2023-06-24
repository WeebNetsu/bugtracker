import ProjectModel from "@/models/project";

// requests
export interface SingleProjectPutRequestBodyModel {
    data: Partial<ProjectModel>;
}

// responses
export interface SingleProjectPutResponseModel {
    data: ProjectModel;
}

export interface SingleProjectGetResponseModel {
    data: ProjectModel;
}
