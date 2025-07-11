import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { MethodSetUserProfileUpdateModel } from '../models';
import { noAuthError, notFoundError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.userProfile.update': async function ({ userId, update }: MethodSetUserProfileUpdateModel) {
        check(userId, String);
        check(update.firstName, Match.Optional(String));
        check(update.lastName, Match.Optional(String));

        // you need to be logged in to make any changes
        const currentUser = await currentUserAsync();
        if (!currentUser) return noAuthError();

        // todo check if admin if userId is not their own

        const updateUser = await Meteor.users.findOneAsync(userId);
        if (!updateUser) return notFoundError('user');

        await Meteor.users.updateAsync(userId, {
            $set: {
                profile: update,
            },
        });
    },
});
