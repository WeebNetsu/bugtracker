import { ObjectId } from "mongodb";

export interface ErrorResponseModel {
    reason: string;
}

export interface SuccessResponseModel {
    _id?: ObjectId;
}

export type SimpleResponseModel = ErrorResponseModel | SuccessResponseModel;

export enum AvailableRequestMethods {
    /**
     * Retrieve information from the server
     */
    GET = "GET",
    /**
     * Send data to the server to create or update a resource
     */
    POST = "POST",
    /**
     * Update an existing resource on the server.
     */
    PUT = "PUT",
    /**
     * Delete a resource on the server
     */
    DELETE = "DELETE",
}
