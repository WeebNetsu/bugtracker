import { Typography } from "antd";
import React from "react";
import styles from "./_statusCard.module.scss";

interface CardProps {
    title: string;
}

const StatusCard: React.FC<CardProps> = ({ title }) => {
    return (
        <div className={styles.statusCard}>
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

export default StatusCard;
