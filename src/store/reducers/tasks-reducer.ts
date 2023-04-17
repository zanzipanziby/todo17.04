import {ActionsType, ServerTaskType, TasksStateType} from "../../types/types";
import {Dispatch} from "redux";
import {tasksAPI} from "../../api/api";

export const tasksReducers = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_TODOLIST":
            const stateCopy = {...state}
            action.payload.todolists.forEach(todolist => {
                stateCopy[todolist.id] = []
            })
            return stateCopy
        case "SET_TASKS":
            debugger
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        default:
            return state
    }
}


export type SetTasksActionType = ReturnType<typeof setTasksAC>
export const setTasksAC = (todolistId: string, tasks: ServerTaskType[]) => (
    {
        type: "SET_TASKS",
        payload: {
            todolistId,
            tasks
        }
    } as const
)


export const getTasks = (todolistId: string) => (dispatch: Dispatch) => {
    tasksAPI.getTasks(todolistId)
        .then(data => {
            dispatch(setTasksAC(todolistId, data.items))
        })
}