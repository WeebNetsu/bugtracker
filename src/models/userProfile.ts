import { ObjectId } from "mongodb";

interface UserProfileModel {
    _id: ObjectId;
    /**
     * Supabase ID of user this project belongs to
     */
    ownerId: string;
    username?: string;
}

export default UserProfileModel;
