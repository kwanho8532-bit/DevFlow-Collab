import {
    Box, Checkbox, IconButton, ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Stack,
    Tooltip,
} from "@mui/material";

import TaskItem from "./TaskItem";

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