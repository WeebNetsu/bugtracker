import Loader from "@/components/ui/Loader";
import { SuccessResponseModel } from "@/models/requests";
import { parseApiResponse, sendPostRequest, uiHandleRequestFailed } from "@/utils/requests";
import { CloseOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { checkStrEmpty } from "@netsu/js-utils";
import { Button, Form, Input, Space, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { ProjectsCreatePostRequestBodyModel } from "../api/projects/_models";

interface StatusListItemModel {
    id: string;
    title: string;
}

const reorder = (list: StatusListItemModel[], startIndex: number, endIndex: number) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const CreateProjectPage: React.FC = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [statuses, setStatuses] = useState<StatusListItemModel[]>([
        { id: uuidv4(), title: "TODO" },
        { id: uuidv4(), title: "In Progress" },
        { id: uuidv4(), title: "Completed" },
    ]);
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(false);

    function onDragEnd(e: DropResult) {
        if (!e.destination) {
            return;
        }

        if (e.destination.index === e.source.index) {
            return;
        }

        const newOrder = reorder(statuses, e.source.index, e.destination.index);

        setStatuses(newOrder);
    }

    const handleSubmit = async () => {
        setLoading(true);

        if (!title || checkStrEmpty(title)) {
            setLoading(false);
            return message.error("Title is not valid");
        }

        if ((statuses?.map(status => !checkStrEmpty(status)) ?? []).includes(false)) {
            setLoading(false);
            return message.error("Statuses cannot be empty strings");
        }

        const data: ProjectsCreatePostRequestBodyModel = {
            description,
            statuses: statuses.map((status, index) => ({ title: status.title, orderIndex: index })),
            title,
        };
        try {
            const signupReq = await sendPostRequest("/api/projects/create", data);

            if (!signupReq.ok) {
                await uiHandleRequestFailed(signupReq);
                return setLoading(false);
            }

            const resp: SuccessResponseModel = await parseApiResponse(signupReq);

            setLoading(false);

            if (resp._id) {
                router.push(`/project/${resp._id}`);
            } else {
                router.push(`/`);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            message.error("Unknown Error");
        }
    };

    if (loading) return <Loader />;

    return (
        <Form onFinish={handleSubmit}>
            <Space direction="vertical">
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" />
                <Input.TextArea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                />

                <Space>
                    <Input value={newStatus} onChange={e => setNewStatus(e.target.value)} placeholder="Add status" />
                    <Button
                        onClick={() => {
                            setStatuses(st => [
                                ...st,
                                {
                                    id: uuidv4(),
                                    title: newStatus,
                                },
                            ]);
                            setNewStatus("");
                        }}
                    >
                        <PlusOutlined />
                    </Button>
                </Space>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {given => (
                            <div ref={given.innerRef} {...given.droppableProps}>
                                {statuses.map((status, index) => (
                                    <div key={status.id}>
                                        <Draggable draggableId={status.id} index={index}>
                                            {provided => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Space>
                                                        <MenuOutlined />

                                                        <Input
                                                            value={status.title}
                                                            onChange={e =>
                                                                setStatuses(st =>
                                                                    st.map(s =>
                                                                        s.id === status.id
                                                                            ? { ...status, title: e.target.value }
                                                                            : status,
                                                                    ),
                                                                )
                                                            }
                                                        />

                                                        <Button
                                                            onClick={() =>
                                                                setStatuses(st => st.filter(s => s.id !== status.id))
                                                            }
                                                        >
                                                            <CloseOutlined />
                                                        </Button>
                                                    </Space>
                                                </div>
                                            )}
                                        </Draggable>
                                    </div>
                                ))}
                                {given.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Button htmlType="submit">Create Project</Button>
            </Space>
        </Form>
    );
};

export default CreateProjectPage;
