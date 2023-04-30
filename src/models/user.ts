import { ObjectId } from "mongodb";

interface UserModel {
    _id: ObjectId;
    /**
     * User ID on Supabase
     */
    supabaseId: string;
}

export default UserModel;
