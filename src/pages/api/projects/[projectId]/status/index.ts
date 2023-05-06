// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectsCollection } from "@/db/collections";
import { ProjectStatusModel } from "@/models/project";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { SingleProjectStatusPostRequestBodyModel, SingleProjectStatusPostResponseModel } from "./_models";

const postHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId } = req.query;
    const { data } = req.body as SingleProjectStatusPostRequestBodyModel;

    if (!data) {
        const resp: SimpleResponseModel = {
            reason: "Data not provided",
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

    const updateData: ProjectStatusModel = data;

    const project = await ProjectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
        },
        {
            $push: {
                statuses: updateData,
            },
        },
    );

    if (!project.ok || !project.value) {
        const resp: SimpleResponseModel = {
            reason: "Could not update project",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectStatusPostResponseModel = {
        data: project.value,
    };

    return simpleResponse(res, response, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.POST:
            return await postHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for project status",
    };

    simpleResponse(res, response, 400);
};

export default handler;
