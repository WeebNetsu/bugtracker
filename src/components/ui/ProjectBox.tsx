import ProjectModel from "@/models/project";
import { limitText } from "@netsu/js-utils";
import { Typography } from "antd";
import Link from "next/link";
import React from "react";

interface ProjectBoxProps {
    project: ProjectModel;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({ project }) => {
    return (
        <Link href={`/project/${project._id}/`}>
            <div className={"boxWithCenterText"}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    {limitText(project.title, 20)}
                </Typography.Title>
            </div>
        </Link>
    );
};

export default ProjectBox;
