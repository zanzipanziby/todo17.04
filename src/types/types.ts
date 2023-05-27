


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

export type DomainTaskType = ServerTaskType & { entityStatus: RequestStatusType }

export type UpdateTaskModelType = {
	title: string
	description: string
	status: TaskStatuses
	priority: number
	startDate: string
	deadline: string | null
}

export type UpdateTaskDomainModelType = Partial<UpdateTaskModelType>

export type ResponseTaskType = {
	items: ServerTaskType[]
	totalCount: number
	error: string

}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// ---- Reducers ---
export type TodolistStateType = Array<TodolistDomainType>
export type TasksStateType = {
	[key: string]: Array<DomainTaskType>
}
export type AppStateType = {
	status: RequestStatusType
	error: string | null
	initialized: boolean
}

export type LoginStateType = {
	isLoggedIn: boolean
}


