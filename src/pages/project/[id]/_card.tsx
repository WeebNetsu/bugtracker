import { Typography } from "antd";
import React from "react";
import styles from "./_card.module.scss";

interface CardProps {
    title: string;
}

const Card: React.FC<CardProps> = ({ title }) => {
    return (
        <div className={styles.card}>
            <Typography.Title
                level={5}
                style={{
                    padding: 0,
                    margin: 0,
                }}
            >
                {title}
            </Typography.Title>
        </div>
    );
};

export default Card;
