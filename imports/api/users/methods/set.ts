import { emailRegex } from '@netsu/js-utils';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import UserProfileCollection from '../../userProfile/userProfile';
import { MethodSetUserCreateModel } from '../models';
import { clientContentError, notFoundError } from '/imports/utils/serverErrors';

Meteor.methods({
    'set.user.create': async function ({ email, password, firstName, lastName }: MethodSetUserCreateModel) {
        const cleanedEmail = email.trim();

        if (!emailRegex.test(cleanedEmail)) {
            return clientContentError('Email is invalid');
        }

        if (password.length < 8) {
            return clientContentError('Password is too short');
        }

        await Accounts.createUserAsync({
            email,
            password,
        });

        // ensure the user was created
        const newUser = await Meteor.users.findOneAsync({ 'emails.address': email });
        if (!newUser) return notFoundError('new user');

        // create the users profile
        await UserProfileCollection.insertAsync({
            userId: newUser._id,
            firstName,
            lastName,
        });
    },
});
