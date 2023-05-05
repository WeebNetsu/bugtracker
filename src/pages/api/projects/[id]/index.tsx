// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { SingleProjectGetResponseModel } from "./_models";

const getHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const project = await ProjectsCollection.findOne({
        _id: new ObjectId(id),
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

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    if (req.method === AvailableRequestMethods.GET) {
        return await getHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for project retrieval",
    };

    simpleResponse(res, response, 400);
};

export default handler;
