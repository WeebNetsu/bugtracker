import { CloseOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import React, { useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [statuses, setStatuses] = useState<StatusListItemModel[]>([
        { id: uuidv4(), title: "TODO" },
        { id: uuidv4(), title: "In Progress" },
        { id: uuidv4(), title: "Completed" },
    ]);
    const [newStatus, setNewStatus] = useState("");

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

    return (
        <Form>
            <Space direction="vertical">
                <Input value={title} onChange={e => setTitle(e.target.value)} />
                <Input.TextArea value={description} onChange={e => setDescription(e.target.value)} />

                <Space>
                    <Input value={newStatus} onChange={e => setNewStatus(e.target.value)} />
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
