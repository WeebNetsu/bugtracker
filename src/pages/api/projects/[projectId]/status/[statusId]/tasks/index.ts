// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection, TasksCollection } from "@/db/collections";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProjectStatusTasksGetResponseModel, ProjectStatusTasksPostRequestModel } from "./_models";

const getHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId, statusId } = req.query;

    if (!projectId || typeof projectId !== "string" || !statusId || typeof statusId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const project = await ProjectsCollection.findOne({ _id: new ObjectId(projectId), ownerId: user.id });

    if (!project) {
        const resp: SimpleResponseModel = {
            reason: "Could not find project",
        };

        return simpleResponse(res, resp, 404);
    }

    const tasks = await TasksCollection.find({
        projectId: project._id,
        statusId,
    }).toArray();

    const response: ProjectStatusTasksGetResponseModel = {
        data: tasks,
    };

    return simpleResponse(res, response, 200);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId, statusId } = req.query;
    const { data } = req.body as ProjectStatusTasksPostRequestModel;

    if (!data) {
        const resp: SimpleResponseModel = {
            reason: "Data not provided",
        };

        return simpleResponse(res, resp, 400);
    }

    if (!projectId || typeof projectId !== "string" || !statusId || typeof statusId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const task = await TasksCollection.insertOne({
        createdAt: new Date(),
        // -1 now, since it will be incremented to 0 afterwards
        order: -1,
        ownerId: user.id,
        projectId: new ObjectId(projectId),
        title: data.title,
        archived: false,
        description: data.description,
        statusId: statusId,
    });

    if (!task.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not create task",
        };

        return simpleResponse(res, resp, 500);
    }

    await TasksCollection.updateMany(
        { projectId: new ObjectId(projectId), statusId },
        // make all of them +1 in order
        { $inc: { order: 1 } },
    );

    return simpleResponse(res, {}, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.GET:
            return await getHandler(req, res);
        case AvailableRequestMethods.POST:
            return await postHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for status endpoint",
    };

    simpleResponse(res, response, 400);
};

export default handler;
