// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import {
    AvailableRequestMethods,
    ErrorResponseModel,
    SimpleResponseModel,
    SuccessResponseModel,
} from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { checkStrEmpty } from "@netsu/js-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
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
        statuses:
            statuses?.map(status => ({
                _id: uuidv4(),
                ...status,
            })) ?? [],
        title,
        description,
    });

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
