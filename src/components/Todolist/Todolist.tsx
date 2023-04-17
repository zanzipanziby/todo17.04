import React, {useEffect} from 'react';
import {FilterValueType, ServerTaskType, TaskStatuses} from "../../types/types";
import {useAppDispatch} from "../../customHooks/useAppDispatch";
import {getTasks} from "../../store/reducers/tasks-reducer";
import {useAppSelector} from "../../customHooks/useAppSelector";
import Task from "../Task/Task";
import {changeTodolistFilterValueAC} from "../../store/reducers/todolist-reducers";

type TodolistPropsType = {
    todolistId: string
    filter: FilterValueType
    title: string
}

export const Todolist = (props: TodolistPropsType) => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.tasks[props.todolistId])
    const filteredTasks = (tasks: ServerTaskType[], filter: FilterValueType) => {
        switch (filter) {
            case 'all':
                return tasks
            case 'active':
                return tasks.filter(t => t.status !== TaskStatuses.Completed)
            case 'complete':
                return tasks.filter(t => t.status === TaskStatuses.Completed)
        }
    }

    useEffect(() => {
        dispatch(getTasks(props.todolistId))
    }, [])

    const tasksRender = filteredTasks(tasks, props.filter).map(task => {
        return <li><Task title={task.title} status={task.status}/></li>
    })
    return (
        <div>
            <h3>{props.title}</h3>
            <ul>
                {tasksRender}
            </ul>
            <div>
                <button onClick={() => dispatch(changeTodolistFilterValueAC(props.todolistId, 'all'))}>
                    All
                </button>
                <button onClick={() => dispatch(changeTodolistFilterValueAC(props.todolistId, 'active'))}>
                    Active
                </button>
                <button onClick={() => dispatch(changeTodolistFilterValueAC(props.todolistId, 'complete'))}>
                    Completed
                </button>
            </div>
        </div>
    );
};

