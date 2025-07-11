import { emailRegex } from '@netsu/js-utils';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { errorResponse } from '/imports/utils/errors';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // display loader while logging in
    const [loggingIn, setLoggingIn] = useState(false);

    const handleSubmit = async () => {
        const cleanedEmail = email.trim();

        if (!emailRegex.test(cleanedEmail)) {
            return toast.error('Email is invalid');
        }

        if (password.length < 8) {
            return toast.error('Password is too short');
        }

        setLoggingIn(true);

        Meteor.loginWithPassword(cleanedEmail, password, (error: Meteor.Error) => {
            setLoggingIn(false);

            if (error) {
                return errorResponse(error, 'Could not log in');
            }
        });
    };

    return (
        <div>
            <div>
                <h2>Sign in to your account</h2>
            </div>

            <div>
                <div>
                    <label htmlFor="email">Email address</label>
                    <div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <div>
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>
                    <div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <div>
                    <button onClick={handleSubmit} type="button">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
