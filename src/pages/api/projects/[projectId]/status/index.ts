// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectStatusCollection } from "@/db/collections";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { checkStrEmpty } from "@netsu/js-utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ProjectStatusesPostRequestBodyModel,
    ProjectsStatusesGetResponseModel,
    SingleProjectStatusPostResponseModel,
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

    const projectStatuses = await ProjectStatusCollection.find({
        // ownerId: user.id,
        projectId: new ObjectId(projectId),
    }).toArray();

    if (!projectStatuses) {
        const resp: SimpleResponseModel = {
            reason: "Could not find project statuses",
        };

        return simpleResponse(res, resp, 404);
    }

    const response: ProjectsStatusesGetResponseModel = {
        data: projectStatuses,
    };

    return simpleResponse(res, response, 200);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId } = req.query;
    const { title } = req.body as ProjectStatusesPostRequestBodyModel;

    if (checkStrEmpty(title)) {
        const resp: SimpleResponseModel = {
            reason: "Tile not provided",
        };

        return simpleResponse(res, resp, 400);
    }

    if (!projectId || typeof projectId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const projCount = await ProjectStatusCollection.countDocuments({
        projectId: new ObjectId(projectId),
    });

    const status = await ProjectStatusCollection.insertOne({
        createdAt: new Date(),
        orderIndex: projCount,
        projectId: new ObjectId(projectId),
        title,
    });

    if (!status.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not update project",
        };

        return simpleResponse(res, resp, 500);
    }

    const newStatus = await ProjectStatusCollection.findOne(new ObjectId(status.insertedId));

    if (!newStatus) {
        const resp: SimpleResponseModel = {
            reason: "Could not create new status",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectStatusPostResponseModel = {
        data: newStatus,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.POST:
            return await postHandler(req, res);
        case AvailableRequestMethods.GET:
            return await getHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for project status",
    };

    simpleResponse(res, response, 400);
};

export default handler;
