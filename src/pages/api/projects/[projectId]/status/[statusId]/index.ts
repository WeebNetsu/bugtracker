// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ProjectStatusCollection, TasksCollection } from "@/db/collections";
import ProjectStatusModel from "@/models/projectStatus";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { SingleProjectStatusPutRequestBodyModel, SingleProjectStatusPutResponseModel } from "./_models";

const putHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { statusId } = req.query;
    const { data } = req.body as SingleProjectStatusPutRequestBodyModel;

    if (!statusId || typeof statusId !== "string") {
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

    const status = await ProjectStatusCollection.findOne(new ObjectId(statusId));

    if (!status) {
        const resp: SimpleResponseModel = {
            reason: "Could not find status",
        };

        return simpleResponse(res, resp, 404);
    }

    const oldStatus = status;

    const updateData: ProjectStatusModel = { ...oldStatus, ...data };

    const updateStatus = await ProjectStatusCollection.findOneAndUpdate(
        { _id: status._id },
        {
            $set: {
                ...updateData,
            },
        },
    );

    if (!updateStatus.ok || !updateStatus.value) {
        const resp: SimpleResponseModel = {
            reason: "Could not update status",
        };

        return simpleResponse(res, resp, 500);
    }

    const response: SingleProjectStatusPutResponseModel = {
        data: updateStatus.value,
    };

    return simpleResponse(res, response, 200);
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { statusId } = req.query;

    if (!statusId || typeof statusId !== "string") {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const deletedStatus = await ProjectStatusCollection.deleteOne({
        _id: new ObjectId(statusId),
    });

    if (!deletedStatus.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not delete status",
        };

        return simpleResponse(res, resp, 500);
    }

    const deletedTasks = await TasksCollection.deleteMany({
        statusId: new ObjectId(statusId),
    });

    if (!deletedTasks.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not delete status tasks - please report to an admin",
        };

        return simpleResponse(res, resp, 500);
    }

    return simpleResponse(res, {}, 200);
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
