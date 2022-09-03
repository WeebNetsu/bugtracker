export enum STATUS {
	TODO = "TODO",
	DOING = "DOING",
	COMPLETED = "COMPLETED",
}

export default interface TaskModel {
	id: string;
	text: string;
	status: STATUS;
	description: string;
}

export interface InsertTaskModel {
	text: string;
	status: STATUS;
	description?: string;
}

export interface UpdateTaskModel {
	text?: string;
	status?: STATUS;
	description?: string;
}

export interface DeleteTasksModel {
	status: STATUS;
}
