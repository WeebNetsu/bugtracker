import ProjectModel from "@/models/project";

// requests
export interface SingleProjectGetResponseModel {
    data: ProjectModel;
}

// responses
export interface SingleProjectPutResponseModel {
    data: ProjectModel;
}

export interface SingleProjectPutRequestBodyModel {
    data: Partial<ProjectModel>;
}
