import ProjectModel from "@/models/project";
import ProjectStatusModel from "@/models/projectStatus";

// requests
export interface SingleProjectStatusPostRequestBodyModel {
    data?: ProjectStatusModel;
}

// responses
export interface SingleProjectStatusPostResponseModel {
    data: ProjectModel;
}
