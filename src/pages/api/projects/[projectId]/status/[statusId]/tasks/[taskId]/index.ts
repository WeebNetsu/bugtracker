// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TasksCollection } from "@/db/collections";
import { AvailableRequestMethods, ErrorResponseModel, SimpleResponseModel } from "@/models/requests";
import { checkApiSupabaseAuth, notAuthResponse, simpleResponse } from "@/utils/requests";
import { checkStrEmpty, isValidNumber } from "@netsu/js-utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { SpecificProjectStatusTaskPutRequestModel } from "./_models";

const putHandler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    const { projectId, statusId, taskId } = req.query;
    const { data } = req.body as SpecificProjectStatusTaskPutRequestModel;

    if (!data) {
        const resp: SimpleResponseModel = {
            reason: "Data not provided",
        };

        return simpleResponse(res, resp, 400);
    }

    const { archived, description, oldOrder, newOrder, statusId: newStatusId, title } = data;

    if (title && checkStrEmpty(title)) {
        const resp: SimpleResponseModel = {
            reason: "Title cannot be empty",
        };

        return simpleResponse(res, resp, 400);
    }

    if (newStatusId && checkStrEmpty(newStatusId)) {
        const resp: SimpleResponseModel = {
            reason: "Status ID cannot be empty",
        };

        return simpleResponse(res, resp, 400);
    }

    // both orders are required if one is provided
    if (isValidNumber(String(oldOrder)) && !isValidNumber(String(newOrder))) {
        const resp: SimpleResponseModel = {
            reason: "A new order is required",
        };

        return simpleResponse(res, resp, 400);
    } else if (isValidNumber(String(newOrder)) && !isValidNumber(String(oldOrder))) {
        const resp: SimpleResponseModel = {
            reason: "The old order is required",
        };

        return simpleResponse(res, resp, 400);
    }

    if (newStatusId) {
        if (!isValidNumber(String(newOrder))) {
            const resp: SimpleResponseModel = {
                reason: "If changing statuses, an order number is required",
            };

            return simpleResponse(res, resp, 404);
        }
    }

    if (
        !projectId ||
        typeof projectId !== "string" ||
        !statusId ||
        typeof statusId !== "string" ||
        !taskId ||
        typeof taskId !== "string"
    ) {
        const resp: SimpleResponseModel = {
            reason: "ID is invalid",
        };

        return simpleResponse(res, resp, 400);
    }

    const user = await checkApiSupabaseAuth(req, res);

    if (!user) return notAuthResponse(res);

    const originalTask = await TasksCollection.findOne({
        _id: new ObjectId(taskId),
        statusId,
        projectId: new ObjectId(projectId),
    });

    if (!originalTask) {
        const resp: SimpleResponseModel = {
            reason: "Could not find task",
        };

        return simpleResponse(res, resp, 404);
    }

    const newTask = await TasksCollection.updateOne(
        {
            _id: new ObjectId(taskId),
            statusId,
            projectId: new ObjectId(projectId),
        },
        {
            $set: {
                description: description ?? originalTask.description,
                archived: archived ?? originalTask.archived,
                order: newOrder ?? originalTask.order,
                statusId: newStatusId ?? originalTask.statusId,
                title: title ?? originalTask.title,
            },
        },
    );

    if (!newTask.acknowledged) {
        const resp: SimpleResponseModel = {
            reason: "Could not update task",
        };

        return simpleResponse(res, resp, 500);
    }

    // we already know old order was given if new order exists
    if (isValidNumber(String(newOrder))) {
        if (newStatusId !== statusId) {
            // if changing statuses
            await TasksCollection.updateMany(
                {
                    projectId: new ObjectId(projectId),
                    statusId: newStatusId,
                    _id: {
                        $ne: new ObjectId(taskId),
                    },
                    order: { $gte: newOrder },
                },
                { $inc: { order: 1 } },
            );
        }

        if ((oldOrder ?? 0) < (newOrder ?? 0)) {
            await TasksCollection.updateMany(
                {
                    projectId: new ObjectId(projectId),
                    statusId: statusId,
                    _id: {
                        $ne: new ObjectId(taskId),
                    },
                    order: { $gte: oldOrder, $lte: newOrder },
                },
                { $inc: { order: -1 } },
            );
        } else if ((oldOrder ?? 0) > (newOrder ?? 0)) {
            await TasksCollection.updateMany(
                {
                    projectId: new ObjectId(projectId),
                    statusId: statusId,
                    _id: {
                        $ne: new ObjectId(taskId),
                    },
                    order: { $gte: newOrder, $lte: oldOrder },
                },
                { $inc: { order: 1 } },
            );
        }
    }

    return simpleResponse(res, {}, 200);
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SimpleResponseModel>) => {
    switch (req.method) {
        case AvailableRequestMethods.PUT:
            return await putHandler(req, res);
    }

    const response: ErrorResponseModel = {
        reason: "Invalid request for task endpoint",
    };

    simpleResponse(res, response, 400);
};

export default handler;
