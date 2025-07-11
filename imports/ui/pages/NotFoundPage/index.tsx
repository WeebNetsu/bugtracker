import React from 'react';

interface NotFoundPageProps {
    message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
    return <p>{message ?? 'The page you were looking for was not found'}</p>;
};

export default NotFoundPage;
