/**
 * A status is a container in a project, such as "TODO". It contains
 * multiple tasks
 */
interface ProjectStatusModel {
    _id: string;
    /**
     * ID of the project this status is linked to
     */
    projectId: string;
    /**
     * Title of the status that will be shown to
     * the user
     */
    title: string;
    /**
     * The order in which the statuses should be, aka its index in the array
     */
    orderIndex: number;
}

export default ProjectStatusModel;
