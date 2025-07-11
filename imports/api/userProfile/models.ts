interface UserProfileModel {
    _id: string;
    /**
     * User this profile is linked to
     */
    userId: string;
    /**
     * The first name of the user
     */
    firstName: string;
    /**
     * The last name of the user
     */
    lastName?: string;
}

export default UserProfileModel;

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetUserProfileUpdateModel {
    update: Partial<UserProfileModel>;
    userId: string;
}
