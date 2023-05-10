import {FilterValueType, RequestStatusType, TodolistDomainType, TodolistResponseType} from "../../types/types";
import {Dispatch} from "redux";
import {todolistAPI} from "../../api/api";
import {setAppStatusAC} from "./app-reducer";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {getTasksTC} from "./tasks-reducer";
import {AppThunkDispatch} from "../../customHooks/useAppDispatch";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
	name: "todolists",
	initialState: [] as TodolistDomainType[],
	reducers: {
		setTodolistAC(state, action: PayloadAction<{ todolists: Array<TodolistResponseType> }>) {
			return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
		},
		changeTodolistFilterValueAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValueType }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId)
			if (index > -1) {
				state[index].filter = action.payload.filter
			}
		},
		addTodolistAC(state, action: PayloadAction<{ todolist: TodolistResponseType }>) {
			state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
		},
		updateTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId)
			if (index > -1) {
				state[index].title = action.payload.title
			}
		},
		deleteTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId)
			if (index > -1) {
				state.splice(index, 1)
			}
		},
		changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId)
			if (index > -1) {
				state[index].entityStatus = action.payload.status
			}

		},
		clearStateAC(state) {
			return []
		}
	}
})
export const {
	setTodolistAC, changeTodolistFilterValueAC,
	addTodolistAC, updateTodolistTitleAC,
	deleteTodolistAC, changeTodolistEntityStatusAC, clearStateAC,
} = slice.actions
export const todolistReducers = slice.reducer
// export const todolistReducers = (state: TodolistDomainType[] = [], action: ActionsType): TodolistDomainType[] => {
// 	switch (action.type) {
// 		case "SET_TODOLIST":
// 			return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
// 		case "CHANGE_FILTER_VALUE":
// 			return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.filter} : tl)
// 		case "ADD_TODOLIST":
// 			return [{...action.payload.todolist, filter: "all", entityStatus: "idle"}, ...state]
// 		case "UPDATE_TODOLIST_TITLE":
// 			return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.title} : tl)
// 		case "DELETE_TODOLIST":
// 			return state.filter(tl => tl.id !== action.payload.todolistId)
// 		case "CHANGE_TODO_ENTITY_STATUS":
// 			return state.map(tl => tl.id === action.payload.todolistId
// 				? {...tl, entityStatus: action.payload.status}
// 				: tl)
// 		case "CLEAR_STATE":
// 			return []
// 		default:
// 			return state
// 	}
// }

//  -------------  Action  ----------------

// export type setTodolistActionType = ReturnType<typeof setTodolistAC>
// export const setTodolistAC = (todolists: Array<TodolistResponseType>) => (
// 	{
// 		type: "SET_TODOLIST",
// 		payload: {
// 			todolists
// 		}
// 	} as const)
// export type ChangeTodolistFilterValueActionType = ReturnType<typeof changeTodolistFilterValueAC>
// export const changeTodolistFilterValueAC = (todolistId: string, filter: FilterValueType) => (
// 	{
// 		type: "CHANGE_FILTER_VALUE",
// 		payload: {
// 			todolistId,
// 			filter
// 		}
// 	} as const)
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
// export const addTodolistAC = (todolist: TodolistResponseType) => (
// 	{
// 		type: "ADD_TODOLIST",
// 		payload: {
// 			todolist
// 		}
// 	} as const
// )
// export type UpdateTodolistTitleActionType = ReturnType<typeof updateTodolistTitleAC>
// export const updateTodolistTitleAC = (todolistId: string, title: string) => (
// 	{
// 		type: "UPDATE_TODOLIST_TITLE",
// 		payload: {
// 			todolistId,
// 			title
// 		}
// 	} as const
// )
// export type DeleteTodolistActionType = ReturnType<typeof deleteTodolistAC>
// export const deleteTodolistAC = (todolistId: string) => (
// 	{
// 		type: "DELETE_TODOLIST",
// 		payload: {
// 			todolistId
// 		}
// 	} as const
// )
// export type  ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>
// export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => (
// 	{
// 		type: "CHANGE_TODO_ENTITY_STATUS",
// 		payload: {
// 			todolistId,
// 			status
// 		}
// 	} as const
//
// )
// export type ClearStateActionType = ReturnType<typeof clearStateAC>
// export const clearStateAC = () => (
// 	{
// 		type: "CLEAR_STATE"
// 	} as const
// )

//  -------------  Thunk  ---------------

export const getTodolistTC = () => (dispatch: AppThunkDispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	todolistAPI.getTodolists()
		.then(data => {
			dispatch(setAppStatusAC({status: "succeeded"}))
			dispatch(setTodolistAC({todolists: data}))
			return data
		})
		.then(data => {
			data.forEach(tl => {
				dispatch(getTasksTC(tl.id))
			})
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	todolistAPI.addTodolist(title)

		.then(data => {
			if (data.resultCode === 0) {
				dispatch(addTodolistAC({todolist: data.data.item}))
			} else {
				appServerErrorHandle(data, dispatch)
			}

			dispatch(setAppStatusAC({status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

export const updateTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))

	todolistAPI.updateTodolist(todolistId, title)
		.then(data => {
			if (data.resultCode === 0) {
				dispatch(updateTodolistTitleAC({todolistId, title}))
			} else {
				appServerErrorHandle(data, dispatch)
			}
			dispatch(setAppStatusAC({status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
	dispatch(changeTodolistEntityStatusAC({todolistId, status: "loading"}))
	dispatch(setAppStatusAC({status: "loading"}))
	todolistAPI.deleteTodolist(todolistId)
		.then(data => {
			if (data.resultCode === 0) {
				dispatch(deleteTodolistAC({todolistId}))
			} else {
				appServerErrorHandle(data, dispatch)
			}
			dispatch(setAppStatusAC({status: "succeeded"}))
			dispatch(changeTodolistEntityStatusAC({todolistId, status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

