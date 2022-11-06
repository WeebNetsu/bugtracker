/**
 * @deprecated
 * **Will be removed for user own customized statuses**
 *
 * Current status of a task
 */
export enum STATUS {
    TODO = "TODO",
    DOING = "DOING",
    COMPLETED = "COMPLETED",
}

/**
 * General structure of a task
 */
export default interface TaskModel {
    id: number;
    text: string;

    /**
     * Task status (in which category to put task, ie. TODO or COMPLETED)
     *
     * todo we might want to give each status an ID and then work with an ID (in case status is ever updated or renamed)
     */
    status: STATUS;
    description: string;

    /**
     * User that created this task
     */
    userId: string;
}

/**
 * Data required to create a new task
 */
export interface InsertTaskModel {
    text: string;
    status: STATUS;
    description?: string;
    userId: string;
}

/**
 * Data required to update a task
 */
export interface UpdateTaskModel {
    text?: string;
    status?: STATUS;
    description?: string;
    userId: string;
}

/**
 * Data required to delete **multiple** tasks
 */
export interface DeleteTasksModel {
    status: STATUS;
}
