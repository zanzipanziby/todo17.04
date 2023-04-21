import {
    AddTodolistActionType,
    ChangeTodolistEntityStatusActionType,
    ChangeTodolistFilterValueActionType,
    DeleteTodolistActionType,
    setTodolistActionType,
    UpdateTodolistTitleActionType
} from "../store/reducers/todolist-reducers";
import {
    AddTaskActionType,
    DeleteTaskActionType,
    SetTasksActionType,
    UpdateTaskActionType
} from "../store/reducers/tasks-reducer";
import {SetAppErrorActionType, setAppStatusActionType} from "../store/reducers/app-reducer";

export type AuthMeDataType = {
    id: number
    email: string
    login: string
}
export type ResponseType<T = {}> = {
    data: T
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
}


//requestTypes
export type LoginRequestType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}

export type TodolistResponseType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type FilterValueType = 'all' | 'complete' | 'active'

export type TodolistDomainType = TodolistResponseType & { filter: FilterValueType, entityStatus: RequestStatusType }

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export type ServerTaskType = {
    id: string
    title: string
    todoListId: string
    status: TaskStatuses
    addedDate: string
    deadline: null
    description: string
    order: number
    priority: number
    startDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string | null
}

export type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: number
    startDate?: string
    deadline?: string | null
}

export type ResponseTaskType = {
    items: ServerTaskType[]
    totalCount: number
    error: string

}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// ---- Reducers ---
export type TodolistStateType = Array<TodolistDomainType>
export type TasksStateType = {
    [key: string]: Array<ServerTaskType>
}
export type AppStateType = {
    status: RequestStatusType
    error: string | null
}


// -------------  Actions Type  ----------------

export type ActionsType =
    | setTodolistActionType
    | SetTasksActionType
    | ChangeTodolistFilterValueActionType
    | DeleteTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodolistActionType
    | UpdateTodolistTitleActionType
    | DeleteTodolistActionType
    | setAppStatusActionType
    | SetAppErrorActionType
    | ChangeTodolistEntityStatusActionType