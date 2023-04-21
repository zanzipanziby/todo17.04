import React, {ChangeEvent} from 'react';
import {TaskStatuses} from "../../types/types";
import {Checkbox} from "@mui/material";

import Box from "@mui/material/Box";
import s from './Task.module.css'
import EditableSpan from "../EditableSpan/EditableSpan";
import DeleteButton from "../DeleteButton/DeleteButton";


type TaskPropsType = {
    title: string
    status: TaskStatuses
    deleteTask: () => void
    updateTaskStatus: (status: TaskStatuses) => void
    updateTaskTitle: (title: string) => void
}


const Task = (props: TaskPropsType) => {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) {
            props.updateTaskStatus(TaskStatuses.Completed)
        } else {
            props.updateTaskStatus(TaskStatuses.InProgress)
        }
    }

    return (
        <Box className={s.taskContainer}>
            <Box>
                <Checkbox checked={props.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
                <EditableSpan title={props.title} changeTitle={props.updateTaskTitle}/>
            </Box>
           <DeleteButton callback={props.deleteTask} disabled={false}/>
        </Box>
    );
};

export default Task;