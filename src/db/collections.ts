import UserModel from "@/models/user";
import { OptionalId } from "mongodb";
import client from "./mongodb";

export const UsersCollection = client
    .db()
    // https://www.mongodb.com/docs/drivers/node/current/fundamentals/typescript/#working-with-the-_id-field
    .collection<OptionalId<UserModel>>("users");

export const ProjectsCollection = client.db().collection<OptionalId<UserModel>>("projects");

export const TasksCollection = client.db().collection<OptionalId<UserModel>>("tasks");
