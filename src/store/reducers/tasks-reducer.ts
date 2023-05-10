import {RequestStatusType, ServerTaskType, TasksStateType, UpdateTaskDomainModelType} from "../../types/types";
import {Dispatch} from "redux";
import {tasksAPI} from "../../api/api";
import {RootStateType} from "../store";
import {setAppStatusAC} from "./app-reducer";
import {addTodolistAC, changeTodolistEntityStatusAC, deleteTodolistAC, setTodolistAC} from "./todolist-reducers";
import {AxiosError} from "axios";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
	name: "tasks",
	initialState: {} as TasksStateType,
	reducers: {
		// deleteTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
		// 	const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
		// 	if (index > -1) {
		// 		state[action.payload.todolistId].splice(index, 1)
		// 	}
		// },
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
			.addCase(getTasksTC.fulfilled, (state, action) => {
				state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
			})
			.addCase(deleteTaskTC.fulfilled, (state, action) => {
				if (action.payload !== undefined) {
					const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload?.taskId)
					if (index > -1) {
						state[action.payload.todolistId].splice(index, 1)
					}
				}

			})
	}

})


// ------------  Thunk  RTC--------------
export const getTasksTC = createAsyncThunk(
	"tasks/getTasks",
	async (todolistId: string, thunkAPI) => {
		thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
		const data = await tasksAPI.getTasks(todolistId)
		thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
		return {todolistId, tasks: data.items}
	}
)

export const deleteTaskTC = createAsyncThunk(
	"task/deleteTask",
	(arg: { todolistId: string, taskId: string }, thunkAPI) => {
		const {todolistId, taskId} = arg
		thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
		thunkAPI.dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
		return tasksAPI.deleteTask(todolistId, taskId)
			.then(data => {
				if (data.resultCode === 0) {
					thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
					//TODO здесь диспатчатся экшены редьюсера и возврощаются данные для экстра - это разделение логики, нужно пофиксить
					return {todolistId, taskId}
				} else {
					appServerErrorHandle(data, thunkAPI.dispatch)
				}
				thunkAPI.dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "succeeded"}))
			})
			.catch((error: AxiosError) => {
				networkServerErrorHandle(error, thunkAPI.dispatch)
			})
	}
)

// ------------  Thunk  Redux--------------
//TODO не удалять, нужно для создания санки на RTC

// export const deleteTaskTCC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
// 	dispatch(setAppStatusAC({status: "loading"}))
// 	dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
// 	tasksAPI.deleteTask(todolistId, taskId)
// 		.then(data => {
// 			if (data.resultCode === 0) {
// 				dispatch(setAppStatusAC({status: "succeeded"}))
// 				dispatch(deleteTaskAC({todolistId, taskId}))
// 			} else {
// 				appServerErrorHandle(data, dispatch)
// 			}
// 			dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "succeeded"}))
// 		})
// 		.catch((error: AxiosError) => {
// 			networkServerErrorHandle(error, dispatch)
// 		})
//
// }

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


export const tasksReducers = slice.reducer
export const {
	// setTasksAC,
	// deleteTaskAC,
	addTaskAC,
	updateTaskAC,
	changeTaskEntityStatusAC
} = slice.actions
