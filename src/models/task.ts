export enum STATUS {
    TODO = "TODO",
    DOING = "DOING",
    COMPLETED = "COMPLETED",
}

export default interface Task {
    id?: number
    text: string
    status: STATUS
}
