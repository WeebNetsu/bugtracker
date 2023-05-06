import TaskModel from "@/models/task";

// requests
export interface ProjectStatusTasksPostRequestModel {
    data?: {
        title: string;
        description?: string;
    };
}

// responses
export interface ProjectStatusTasksGetResponseModel {
    data: TaskModel[];
}
