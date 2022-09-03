import { createSlice } from "@reduxjs/toolkit";
import { signupUser } from "../api/auth";
import LoadStatus from "../models/loadingStatus";

export interface authState {
	loadingStatus: LoadStatus;
	data: {
		userSignupComplete: boolean;
	};
	error: string;
}

const initialState: authState = {
	loadingStatus: LoadStatus.NOT_STARTED,
	data: {
		userSignupComplete: false,
	},
	error: "",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		userSignupStarted(state) {
			state.data.userSignupComplete = false;
			state.loadingStatus = LoadStatus.PENDING;
		},
		userSignupSuccess(state) {
			state.data.userSignupComplete = true;
			state.loadingStatus = LoadStatus.COMPLETE;
		},
		userSignupFailed(state) {
			state.data.userSignupComplete = true;
			state.loadingStatus = LoadStatus.COMPLETE;
			state.error = "Could not get tasks";
		},
	},
});

export const { userSignupStarted, userSignupSuccess, userSignupFailed } =
	authSlice.actions;

export default authSlice.reducer;

export const userSignup =
	(username: string, userSupabaseId: string) => async (dispatch: any) => {
		try {
			dispatch(userSignupStarted());
			await signupUser({
				username,
				userSupabaseId,
			});
			dispatch(userSignupSuccess());
		} catch (err) {
			console.error(err);
			dispatch(userSignupFailed());
		}
	};
