// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProjectsGetResponseModel } from "./_models";

const getHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const projects = await ProjectsCollection.find({
        ownerId: user.id,
    }).toArray();

    const response: ProjectsGetResponseModel = {
        data: projects,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    if (req.method === AvailableRequestMethods.GET) {
        return await getHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for projects retrieval",
    };

    simpleResponse(res, response, 400);
};

export default handler;
