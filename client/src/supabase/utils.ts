import { supabase } from "./client";

export const getLoggedIn = async () => {
	const session = await supabase.auth.getSession();

	if (session.error) {
		throw new Error(session.error.message ?? "Could not get session login");
	}

	return !!session.data.session;
};
