import useWindowDimensions from "@/utils/hooks";
import React from "react";

const SpecificProjectPage: React.FC = () => {
    const { height } = useWindowDimensions();

    const handleCardDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const taskId = Number(e.dataTransfer.getData("taskId"));
        let moveStatus: any = null;

        if (e.currentTarget.className === "STATUS.TODO") {
            moveStatus = "STATUS.TODO";
        } else if (e.currentTarget.className === "STATUS.DOING") {
            moveStatus = "STATUS.DOING";
        } else if (e.currentTarget.className === "STATUS.COMPLETED") {
            moveStatus = "STATUS.COMPLETED";
        }

        if (taskId && moveStatus) {
            /*  try {
                const user = await getUser();

                dispatch(updateTask(taskId, { status: moveStatus, userId: user.id }));
            } catch (err: any) {
                setError({
                    message: err.toString(),
                    show: true,
                    error: true,
                });
            } */
        }
    };

    const handleCardDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        // required for drag/drop to work
        e.preventDefault();
    };

    const paperHeight = height * (85 / 100);

    return (
        <div
            onDrop={handleCardDrop}
            onDragOver={handleCardDragOver}
            // onDragEnter={handleDragEnter}
            // className={status}
        >
            <div
                style={{
                    marginTop: 2,
                    marginBottom: 2,
                    padding: 2,
                    minHeight: `400px`,
                    height: `${paperHeight}px`,
                    overflowY: "scroll",
                }}
            >
                {/*  {allTasks.map((task: TaskModel) => (
                    <TaskItem task={task} key={task.id} />
                ))} */}
            </div>
        </div>
    );
};

export default SpecificProjectPage;
