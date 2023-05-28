// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectStatusCollection, ProjectsCollection } from "@/db/collections";
import {
    AvailableRequestMethods,
    ErrorResponseModel,
    SimpleResponseModel,
    SuccessResponseModel,
} from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { checkStrEmpty } from "@netsu/js-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProjectsCreatePostRequestBodyModel } from "./_models";

const postHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const { title, description, statuses } = req.body as ProjectsCreatePostRequestBodyModel;

    if (!title || checkStrEmpty(title)) {
        return simpleResponse(res, {
            reason: "Not all required data was provided",
        });
    }

    if ((statuses?.map(status => !checkStrEmpty(status.title)) ?? []).includes(false)) {
        return simpleResponse(res, {
            reason: "Statuses cannot be empty strings",
        });
    }

    const newProject = await ProjectsCollection.insertOne({
        createdAt: new Date(),
        ownerId: user.id,
        title,
        description,
    });

    const newStatuses = await ProjectStatusCollection.insertMany(
        (statuses ?? []).map(status => ({ ...status, projectId: newProject.insertedId })),
    );

    if (!newStatuses.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not create task",
        };

        // todo undo project creation

        return simpleResponse(res, resp, 500);
    }

    const response: SuccessResponseModel = {
        _id: newProject.insertedId,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    if (req.method === AvailableRequestMethods.POST) {
        return await postHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for project creation",
    };

    simpleResponse(res, response, 400);
};

export default handler;
