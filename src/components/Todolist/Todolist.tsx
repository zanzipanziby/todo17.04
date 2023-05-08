import React, {useEffect} from 'react';
import s from './Todolist.module.css'
import {DomainTaskType, FilterValueType, RequestStatusType, ServerTaskType, TaskStatuses} from "../../types/types";
import {useAppDispatch} from "../../customHooks/useAppDispatch";
import {addTaskTC, deleteTaskTC, getTasksTC, updateTaskTC} from "../../store/reducers/tasks-reducer";
import {useAppSelector} from "../../customHooks/useAppSelector";
import Task from "../Task/Task";
import {
	changeTodolistFilterValueAC,
	deleteTodolistTC,
	updateTodolistTitleTC
} from "../../store/reducers/todolist-reducers";
import {Button, ButtonGroup, Card} from "@mui/material";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import DeleteButton from "../DeleteButton/DeleteButton";
import Box from "@mui/material/Box";

type TodolistPropsType = {
	todolistId: string
	filter: FilterValueType
	title: string
	entityStatus: RequestStatusType
}

export const Todolist = (props: TodolistPropsType) => {
	const dispatch = useAppDispatch()
	const tasks = useAppSelector(state => state.tasks[props.todolistId])

	const filteredTasks = (tasks: DomainTaskType[], filter: FilterValueType) => {
		switch (filter) {
			case 'all':
				return tasks
			case 'active':
				return tasks.filter(t => t.status !== TaskStatuses.Completed)
			case 'complete':
				return tasks.filter(t => t.status === TaskStatuses.Completed)
		}
	}

	const deleteTodolist = () => {
		dispatch(deleteTodolistTC(props.todolistId))
	}
	const updateTodolistTitle = (title: string) => {
		dispatch(updateTodolistTitleTC(props.todolistId, title))
	}
	const changeTodolistFilterValue = (filterValue: FilterValueType) => {
		dispatch(changeTodolistFilterValueAC({todolistId: props.todolistId, filter: filterValue}))
	}
	const deleteTask = (taskId: string) => {
		dispatch(deleteTaskTC(props.todolistId, taskId))
	}

	const addTask = (title: string) => {
		dispatch(addTaskTC(props.todolistId, title))
	}

	const updateTaskStatus = (taskId: string, status: TaskStatuses) => {
		dispatch(updateTaskTC(props.todolistId, taskId, {status}))
	}

	const updateTaskTitle = (taskId: string, title: string) => {
		dispatch(updateTaskTC(props.todolistId, taskId, {title}))
	}
	const filterButtonStyle = (value: FilterValueType) => {
		if (props.filter === value) {
			return "contained"
		}
	}

	const tasksRender = filteredTasks(tasks, props.filter).map(task => {

		return <li>
			<Task
				title={task.title}
				status={task.status}
				deleteTask={() => deleteTask(task.id)}
				updateTaskStatus={(status: TaskStatuses) => updateTaskStatus(task.id, status)}
				updateTaskTitle={(title: string) => updateTaskTitle(task.id, title)}
				entityStatus={task.entityStatus}
			/>
		</li>
	})

	return (
		<Card className={s.card}>
			<Box className={s.titleContainer}>
				<h2><EditableSpan title={props.title} changeTitle={updateTodolistTitle}
								  disableEditMode={props.entityStatus === 'loading'}/></h2>
				<DeleteButton callback={deleteTodolist} disabled={props.entityStatus === 'loading'}/>
			</Box>
			<AddItemForm label={"New Task"} getTitle={addTask} disabled={props.entityStatus === 'loading'}/>
			<ul>
				{tasksRender}
			</ul>
			<ButtonGroup size="small" className={s.buttonGroup}>
				<Button
					onClick={() => changeTodolistFilterValue('all')}
					variant={filterButtonStyle('all')}>
					All
				</Button>
				<Button
					onClick={() => changeTodolistFilterValue('active')}
					variant={filterButtonStyle('active')}>
					Active
				</Button>
				<Button
					onClick={() => changeTodolistFilterValue('complete')}
					variant={filterButtonStyle('complete')}>
					Completed
				</Button>
			</ButtonGroup>
		</Card>
	);
};

