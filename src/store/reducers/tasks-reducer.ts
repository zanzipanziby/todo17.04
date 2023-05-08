import {
	RequestStatusType,
	ServerTaskType,
	TasksStateType,
	UpdateTaskDomainModelType
} from "../../types/types";
import {Dispatch} from "redux";
import {tasksAPI} from "../../api/api";
import {RootStateType} from "../store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {addTodolistAC, changeTodolistEntityStatusAC, deleteTodolistAC, setTodolistAC} from "./todolist-reducers";
import {AxiosError} from "axios";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
	name: "tasks",
	initialState: {} as TasksStateType,
	reducers: {
		setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: ServerTaskType[] }>) {
			state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
		},
		deleteTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
			const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
			if (index > -1) {
				state[action.payload.todolistId].splice(index, 1)
			}
		},
		addTaskAC(state, action: PayloadAction<{ todolistId: string, task: ServerTaskType }>) {
			state[action.payload.todolistId].unshift({...action.payload.task, entityStatus: "idle"})
		},
		updateTaskAC(state, action: PayloadAction<{
			todolistId: string,
			taskId: string,
			updatedTask: ServerTaskType
		}>) {
			const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
			if (index > -1) {
				state[action.payload.todolistId][index] = {
					...state[action.payload.todolistId][index], ...action.payload.updatedTask,
					entityStatus: "idle"
				}
			}
		},
		changeTaskEntityStatusAC(state, action: PayloadAction<{
			todolistId: string,
			taskId: string,
			status: RequestStatusType
		}>) {
			const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
			if (index > -1) {
				state[action.payload.todolistId][index].entityStatus = action.payload.status
			}
		}
	},
	extraReducers: builder => {
		builder
			.addCase(setTodolistAC, (state, action) => {
				action.payload.todolists.forEach(tl => {
					state[tl.id] = []
				})
			})
			.addCase(addTodolistAC, (state, action) => {
				state[action.payload.todolist.id] = []
			})
			.addCase(deleteTodolistAC, (state, action) => {
				delete state[action.payload.todolistId]
			})
	}

})
export const tasksReducers = slice.reducer
export const {
	setTasksAC,
	deleteTaskAC,
	addTaskAC,
	updateTaskAC,
	changeTaskEntityStatusAC
} = slice.actions

// export const tasksReducers1 = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
// 	switch (action.type) {
// 		// case "SET_TODOLIST":
// 		// 	const stateCopy = {...state}
// 		// 	action.payload.todolists.forEach(todolist => {
// 		// 		stateCopy[todolist.id] = []
// 		// 	})
// 		// 	return stateCopy
// 		case "SET_TASKS":
// 			return {
// 				...state,
// 				[action.payload.todolistId]: action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
// 			}
// 		case "DELETE_TASK":
// 			return {
// 				...state, [action.payload.todolistId]: state[action.payload.todolistId]
// 					.filter(t => t.id !== action.payload.taskId)
// 			}
// 		case "ADD_TASK":
// 			return {
// 				...state,
// 				[action.payload.todolistId]: [{
// 					...action.payload.task,
// 					entityStatus: "idle"
// 				}, ...state[action.payload.todolistId]]
// 			}
// 		case "UPDATE_TASK":
// 			return {
// 				...state, [action.payload.todolistId]: state[action.payload.todolistId]
// 					.map(t => t.id === action.payload.taskId ? {
// 						...action.payload.updatedTask,
// 						entityStatus: "idle"
// 					} : t)
// 			}
// 		// case "ADD_TODOLIST":
// 		// 	return {
// 		// 		...state, [action.payload.todolist.id]: []
// 		// 	}
// 		// case "DELETE_TODOLIST":
// 		// 	const copyState = {...state}
// 		// 	delete copyState[action.payload.todolistId]
// 		// 	return copyState
// 		case "CHANGE_TASK_ENTITY_STATUS":
// 			return {
// 				...state, [action.payload.todolistId]: state[action.payload.todolistId].map(task => {
// 					return task.id === action.payload.taskId
// 						? {...task, entityStatus: action.payload.status}
// 						: task
// 				})
// 			}
// 		// case "CLEAR_STATE":
// 		// 	return {}
// 		default:
// 			return state
// 	}
// }


// -------- Action -------------

// export type SetTasksActionType = ReturnType<typeof setTasksAC>
// export const setTasksAC = (todolistId: string, tasks: ServerTaskType[]) => (
// 	{
// 		type: "SET_TASKS",
// 		payload: {
// 			todolistId,
// 			tasks
// 		}
// 	} as const
// )
//
//
// export type DeleteTaskActionType = ReturnType<typeof deleteTaskAC>
// export const deleteTaskAC = (todolistId: string, taskId: string) => (
// 	{
// 		type: "DELETE_TASK",
// 		payload: {
// 			todolistId,
// 			taskId
// 		}
// 	} as const
// )
//
// export type AddTaskActionType = ReturnType<typeof addTaskAC>
// export const addTaskAC = (todolistId: string, task: ServerTaskType) => (
// 	{
// 		type: "ADD_TASK",
// 		payload: {
// 			todolistId,
// 			task
// 		}
// 	} as const
//
// )
// export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
// export const updateTaskAC = (todolistId: string, taskId: string, updatedTask: ServerTaskType) => (
// 	{
// 		type: "UPDATE_TASK",
// 		payload: {
// 			todolistId,
// 			taskId,
// 			updatedTask
// 		}
// 	} as const
// )
//
// export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>
// export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => (
// 	{
// 		type: "CHANGE_TASK_ENTITY_STATUS",
// 		payload: {
// 			todolistId,
// 			taskId,
// 			status
// 		}
// 	} as const
// )


// ------------  Thunk  --------------

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	tasksAPI.getTasks(todolistId)
		.then(data => {
			dispatch(setAppStatusAC({status: "succeeded"}))
			dispatch(setTasksAC({todolistId, tasks: data.items}))
		})
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
	tasksAPI.deleteTask(todolistId, taskId)
		.then(data => {
			if (data.resultCode === 0) {
				dispatch(setAppStatusAC({status: "succeeded"}))
				dispatch(deleteTaskAC({todolistId, taskId}))
			} else {
				appServerErrorHandle(data, dispatch)
			}
			dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})

}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	dispatch(changeTodolistEntityStatusAC({todolistId, status: "loading"}))
	tasksAPI.addTask(todolistId, title)
		.then(data => {
			dispatch(setAppStatusAC({status: "succeeded"}))
			if (data.resultCode === 0) {
				dispatch(addTaskAC({todolistId, task: data.data.item}))
			} else {
				appServerErrorHandle(data, dispatch)
			}
			dispatch(changeTodolistEntityStatusAC({todolistId, status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

export const updateTaskTC = (todolistId: string, taskId: string, updateModel: UpdateTaskDomainModelType) =>
	(dispatch: Dispatch, getState: () => RootStateType) => {
		dispatch(setAppStatusAC({status: "loading"}))
		const task = getState().tasks[todolistId].find(t => t.id === taskId)
		if (!task) {
			return
		}
		const apiModel = {
			title: task.title,
			description: task.description,
			status: task.status,
			priority: task.priority,
			startDate: task.startDate,
			deadline: task.deadline,
			...updateModel
		}
		tasksAPI.updateTask(todolistId, taskId, apiModel)
			.then(data => {
				dispatch(setAppStatusAC({status: "succeeded"}))
				if (data.resultCode === 0) {
					dispatch(updateTaskAC({todolistId, taskId, updatedTask: data.data.item}))
				} else {
					appServerErrorHandle(data, dispatch)
				}
			})
			.catch((error: AxiosError) => {
				networkServerErrorHandle(error, dispatch)
			})
	}