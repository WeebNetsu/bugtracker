import { ErrorResponseModel } from "@/models/requests";
import { message } from "antd";
import { NextApiResponse } from "next";

/**
 * Send a post request to an endpoint
 *
 * @param route Route to make request to
 * @param body Data to send to route
 * @returns Returns request data
 */
export const sendPostRequest = async (route: string, body?: any) => {
    const data = await fetch(`${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return data;
};

/**
 * Function returns a response with a code and data
 *
 * @param res Response to send response with
 * @param response Response data to send
 * @param code Status code to attach. Defaults to 400
 * @returns Response with status code
 */
export const simpleResponse = (res: NextApiResponse<any>, response: ErrorResponseModel, code = 400) => {
    return res.status(code).json(JSON.stringify(response));
};

/**
 * Handle a request failed on frontend by parsing the response and
 * displaying a toast
 *
 * @param resp Response received from request
 */
export const uiHandleRequestFailed = async (resp: Response) => {
    console.error({ resp });
    const parsedData: ErrorResponseModel = JSON.parse(await resp.json());

    message.error(parsedData.reason);
};
