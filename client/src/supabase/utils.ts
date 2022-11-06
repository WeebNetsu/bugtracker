import { User } from "@supabase/supabase-js";
import { supabase } from "./client";

/**
 * Get if user is currently logged in
 *
 * @returns true if user is logged in
 */
export const getLoggedIn = async (): Promise<boolean> => {
    const session = await supabase.auth.getSession();

    if (session.error) {
        throw new Error(session.error.message ?? "Could not get session login");
    }

    return !!session.data.session;
};

/**
 * This will get current user details from supabase and will
 * throw an error if fails.
 *
 * @returns Supabase user
 */
export const getUser = async (): Promise<User> => {
    // user can only be accessed if logged in
    const loggedIn = await getLoggedIn();
    if (!loggedIn) throw new Error("No user logged in");

    const user = await supabase.auth.getUser();

    if (user.error) {
        console.error(user.error);
        throw new Error(user.error.message);
    }

    return user.data.user;
};
