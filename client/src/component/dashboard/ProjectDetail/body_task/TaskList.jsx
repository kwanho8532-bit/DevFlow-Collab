import { Box } from "@mui/material";

import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, setPendingTaskId, setIsConfirmOpen }) {
    return (
        <Box>
            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    setIsConfirmOpen={setIsConfirmOpen}
                    setPendingTaskId={setPendingTaskId}
                />

            ))}
        </Box>
    )
}