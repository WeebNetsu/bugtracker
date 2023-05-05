import { ErrorResponseModel } from "@/models/requests";
import { SearchableObject } from "@/types/interfaces";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { message } from "antd";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../lib/database.types";

/**
 * Send a get request to an endpoint
 *
 * @param route Route to make request to
 * @returns Returns request data
 */
export const sendGetRequest = async (route: string) => {
    const data = await fetch(`${route}`);

    return data;
};

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
export const simpleResponse = (res: NextApiResponse<any>, response: SearchableObject, code = 400) => {
    return res.status(code).json(JSON.stringify(response));
};

/**
 * Responds with a not authenticated message.
 *
 * @param res Response to send response with
 * @returns Response with 401 (not authenticated) status code
 */
export const notAuthResponse = (res: NextApiResponse<any>) => {
    return res.status(401).json(
        JSON.stringify({
            reason: "User not authenticated",
        }),
    );
};

/**
 * Parses the response from the API
 *
 * @param resp Response received from request
 * @returns A parsed response from the API
 */
export const parseApiResponse = async (resp: Response) => {
    return JSON.parse(await resp.json());
};

/**
 * Handle a request failed on frontend by parsing the response and
 * displaying a toast
 *
 * @param resp Response received from request
 */
export const uiHandleRequestFailed = async (resp: Response) => {
    console.error({ resp });
    const parsedData: ErrorResponseModel = await parseApiResponse(resp);

    message.error(parsedData.reason);
};

/**
 * Checks if a user is authenticated - useful for API endpoints
 *
 * @param req Request sent to api
 * @param res Response for api
 * @returns The user if authenticated, null if not
 */
export const checkApiSupabaseAuth = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const supabaseServerClient = createServerSupabaseClient<Database>(
        {
            req,
            res,
        },
        {
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
    );

    const {
        data: { user },
    } = await supabaseServerClient.auth.getUser();

    return user;
};
