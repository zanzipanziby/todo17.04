import {ActionsType, ServerTaskType, TasksStateType, UpdateTaskDomainModelType} from "../../types/types";
import {Dispatch} from "redux";
import {tasksAPI} from "../../api/api";
import {RootStateType} from "../store";

export const tasksReducers = (state: TasksStateType = {}, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_TODOLIST":
            const stateCopy = {...state}
            action.payload.todolists.forEach(todolist => {
                stateCopy[todolist.id] = []
            })
            return stateCopy
        case "SET_TASKS":
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        case "DELETE_TASK":
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)
            }
        case "ADD_TASK":
            return {
                ...state, [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]
            }
        case "UPDATE_TASK":
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.taskId ? action.payload.updatedTask : t)
            }
        case "ADD_TODOLIST":
            return {
                ...state, [action.payload.todolist.id]:[]
            }
        case "DELETE_TODOLIST":
            const copyState = {...state}
            delete copyState[action.payload.todolistId]
            return copyState
        default:
            return state
    }
}


// -------- Action -------------

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


export type DeleteTaskActionType = ReturnType<typeof deleteTaskAC>
export const deleteTaskAC = (todolistId: string, taskId: string) => (
    {
        type: "DELETE_TASK",
        payload: {
            todolistId,
            taskId
        }
    } as const
)

export type AddTaskActionType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistId: string, task: ServerTaskType) => (
    {
        type: "ADD_TASK",
        payload: {
            todolistId,
            task
        }
    } as const

)
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (todolistId: string, taskId: string, updatedTask: ServerTaskType) => (
    {
        type: "UPDATE_TASK",
        payload: {
            todolistId,
            taskId,
            updatedTask
        }
    } as const
)


// ------------  Thunk  --------------

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    tasksAPI.getTasks(todolistId)
        .then(data => {
            dispatch(setTasksAC(todolistId, data.items))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    tasksAPI.deleteTask(todolistId, taskId)
        .then(data => {
            if (data.resultCode === 0) {
                dispatch(deleteTaskAC(todolistId, taskId))
            }
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    tasksAPI.addTask(todolistId, title)
        .then(data => {
            if (data.resultCode === 0) {
                dispatch(addTaskAC(todolistId, data.data.item))
            }
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, updateModel: UpdateTaskDomainModelType) =>
    (dispatch: Dispatch, getState: () => RootStateType) => {
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
                if (data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, data.data.item))
                }
            })
    }