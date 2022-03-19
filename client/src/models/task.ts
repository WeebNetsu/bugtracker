export enum STATUS {
    TODO = "TODO",
    DOING = "DOING",
    COMPLETED = "COMPLETED",
}

export default interface TaskModel {
    id?: number
    text: string
    status: STATUS
    comment?: string
}
