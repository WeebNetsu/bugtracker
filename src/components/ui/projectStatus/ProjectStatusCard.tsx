import { limitText } from "@netsu/js-utils";
import { Typography } from "antd";
import React from "react";
import styles from "./styles/ProjectStatusCard.module.scss";

interface ProjectStatusCardProps {
    title: string;
    description?: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ title, description }) => {
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

            {description && (
                <Typography.Text
                    style={{
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {limitText(description, 75)}
                </Typography.Text>
            )}
        </div>
    );
};

export default ProjectStatusCard;
