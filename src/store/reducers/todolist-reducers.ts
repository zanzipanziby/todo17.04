import {ActionsType, FilterValueType, TodolistDomainType, TodolistResponseType} from "../../types/types";
import {Dispatch} from "redux";
import {todolistAPI} from "../../api/api";


export const todolistReducers = (state: TodolistDomainType[] = [], action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "SET_TODOLIST":
            return action.payload.todolists.map(tl => ({...tl, filter: 'all'}))
        case "CHANGE_FILTER_VALUE":
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.filter} : tl)

        default:
            return state
    }
}


export type setTodolistActionType = ReturnType<typeof setTodolistAC>
export const setTodolistAC = (todolists: Array<TodolistResponseType>) => (
    {
        type: "SET_TODOLIST",
        payload: {
            todolists
        }
    } as const)

export type ChangeTodolistFilterValueActionType = ReturnType<typeof changeTodolistFilterValueAC>
export const changeTodolistFilterValueAC = (todolistId: string, filter: FilterValueType) => (
    {
        type: "CHANGE_FILTER_VALUE",
        payload: {
            todolistId,
            filter
        }
    } as const)

export const getTodolist = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
        .then(data => dispatch(setTodolistAC(data)))
}