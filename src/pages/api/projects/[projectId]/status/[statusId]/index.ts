// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    SingleProjectStatusDeleteResponseModel,
    SingleProjectStatusPutRequestBodyModel,
    SingleProjectStatusPutResponseModel,
} from "./_models";

const putHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId, statusId } = req.query;
    const { data } = req.body as SingleProjectStatusPutRequestBodyModel;

    // if only intellisense worked with this
    // if(!checkPathParametersValid(projectId, statusId)){}

    if (!projectId || typeof projectId !== "string" || !statusId || typeof statusId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    if (!data) {
        const resp: SimpleResponseModel = {
            reason: "Statuses were not provided",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const project = await ProjectsCollection.findOne(new ObjectId(projectId));

    if (!project) {
        const resp: SimpleResponseModel = {
            reason: "Could not find project",
        };

        return simpleResponse(res, resp, 404);
    }

    const oldStatus = project.statuses.find(stat => stat._id === statusId);

    if (!oldStatus) {
        const resp: SimpleResponseModel = {
            reason: "Could not find status",
        };

        return simpleResponse(res, resp, 404);
    }

    const updateData: ProjectStatusModel = { ...oldStatus, ...data };

    const updatedProject = await ProjectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
        },
        {
            $set: {
                statuses: project.statuses.map(projStats => (projStats._id === statusId ? updateData : projStats)),
            },
        },
    );

    if (!updatedProject.ok || !updatedProject.value) {
        const resp: SimpleResponseModel = {
            reason: "Could not update project",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectStatusPutResponseModel = {
        data: updatedProject.value,
    };

    return simpleResponse(res, response, 200);
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
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

    const updatedProject = await ProjectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
        },
        {
            $set: {
                statuses: project.statuses.filter(stat => stat._id !== statusId),
            },
        },
    );

    if (!updatedProject.ok || !updatedProject.value) {
        const resp: SimpleResponseModel = {
            reason: "Could not delete status",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectStatusDeleteResponseModel = {
        data: updatedProject.value,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.PUT:
            return await putHandler(req, res);
        case AvailableRequestMethods.DELETE:
            return await deleteHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for status endpoint",
    };

    simpleResponse(res, response, 400);
};

export default handler;
