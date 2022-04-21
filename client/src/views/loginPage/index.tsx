import { Paper, Typography } from '@mui/material';
import React from 'react';

interface LoginPageProps {
    signup?: boolean
}

const LoginPage: React.FC<LoginPageProps> = ({ signup }) => {
    return (
        <Paper elevation={3} >
            <Typography variant="h1" component="h2">
                {signup ? "Signup" : "Login"}
            </Typography>
        </Paper>
    )
}

export default LoginPage;