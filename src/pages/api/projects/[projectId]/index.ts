// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import ProjectModel from "@/models/project";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    SingleProjectGetResponseModel,
    SingleProjectPutRequestBodyModel,
    SingleProjectPutResponseModel,
} from "./_models";

const getHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId } = req.query;

    if (!projectId || typeof projectId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const project = await ProjectsCollection.findOne({
        _id: new ObjectId(projectId),
    });

    if (!project) {
        const resp: SimpleResponseModel = {
            reason: "Could not find project",
        };

        return simpleResponse(res, resp, 404);
    }

    const response: SingleProjectGetResponseModel = {
        data: project,
    };

    return simpleResponse(res, response, 200);
};

const putHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId } = req.query;
    const { data } = req.body as SingleProjectPutRequestBodyModel;

    if (!projectId || typeof projectId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const updateData: Partial<ProjectModel> = data;

    const project = await ProjectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
        },
        {
            $set: updateData,
        },
    );

    if (!project.ok || !project.value) {
        const resp: SimpleResponseModel = {
            reason: "Could not update project",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectPutResponseModel = {
        data: project.value,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.GET:
            return await getHandler(req, res);
        case AvailableRequestMethods.PUT:
            return await putHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for project retrieval",
    };

    simpleResponse(res, response, 400);
};

export default handler;
