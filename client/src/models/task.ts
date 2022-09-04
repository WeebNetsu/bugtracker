export enum STATUS {
	TODO = "TODO",
	DOING = "DOING",
	COMPLETED = "COMPLETED",
}

export default interface TaskModel {
	id: number;
	text: string;
	status: STATUS;
	description: string;
	userId: string;
}

export interface InsertTaskModel {
	text: string;
	status: STATUS;
	description?: string;
	userId: string;
}

export interface UpdateTaskModel {
	text?: string;
	status?: STATUS;
	description?: string;
	userId: string;
}

export interface DeleteTasksModel {
	status: STATUS;
}
