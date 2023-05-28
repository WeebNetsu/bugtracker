import ProjectModel from "@/models/project";
import ProjectStatusModel from "@/models/projectStatus";
import TaskModel from "@/models/task";
import UserProfileModel from "@/models/userProfile";
import { OptionalId } from "mongodb";
import client from "./mongodb";

export const UserProfileCollection = client.db().collection<OptionalId<UserProfileModel>>("userProfile");

export const ProjectsCollection = client
    .db()
    // https://www.mongodb.com/docs/drivers/node/current/fundamentals/typescript/#working-with-the-_id-field
    .collection<OptionalId<ProjectModel>>("projects");

export const ProjectStatusCollection = client.db().collection<OptionalId<ProjectStatusModel>>("projectStatuses");

export const TasksCollection = client.db().collection<OptionalId<TaskModel>>("tasks");
