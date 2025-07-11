import UserProfileModel from '../userProfile/models';
import { UserModel } from '../users/models';
import { MethodSearchModel } from '/imports/types/interfaces';

export enum AvailableCollectionNames {
    USERS = 'users',
    USER_PROFILE = 'user_profile',
}

// this is so we can associate data types with a specific collection on fetch
export type CollectionTypeMap = {
    [AvailableCollectionNames.USERS]: UserModel;
    [AvailableCollectionNames.USER_PROFILE]: UserProfileModel;
};

export interface MethodUtilMethodsFindCollectionModel extends MethodSearchModel {
    collection: AvailableCollectionNames;
    /**
     * If provided, deleted documents will also be provided. If `onlyOne` is used, below will not be used.
     */
    includeDeleted?: boolean;
    count?: boolean;
}
