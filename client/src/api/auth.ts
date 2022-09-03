import { UserSignupModel } from "../models/auth";
import { BaseResponseModel } from "../models/response";
import axiosConf from "./axios";

const URL = "/auth";

export interface BaseResponse {
	data: BaseResponseModel;
}

export const signupUser = async (
	user: UserSignupModel
): Promise<BaseResponse> => {
	// send get request to /tasks and retrieve course data from server
	if (!user.userSupabaseId.trim()) throw new Error("No user ID provided");
	if (!user.username.trim()) throw new Error("No username provided");
	if (user.username.trim().length < 3) throw new Error("Username is too short");
	if (user.username.trim().length > 50) throw new Error("Username is too long");

	const res = await axiosConf.post(`${URL}/signup`, user);

	return res.data;
};
