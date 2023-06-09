import axios from "axios";
import {
  AuthMeDataType,
  LoginRequestType,
  ResponseTaskType,
  ResponseType,
  ServerTaskType,
  TodolistResponseType,
  UpdateTaskModelType,
} from "../types/types";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  withCredentials: true,
  headers: {
    "api-key": "e4ef45f4-a82b-4eac-8c32-94376658e62c",
  },
});


export const authAPI = {
	authMe() {
		return instance.get<ResponseType<AuthMeDataType>>("auth/me")

	},
	login(data: LoginRequestType) {
		return instance.post<ResponseType<{ userId: string }>>("auth/login", data)

	},
	logout() {
		return instance.delete<ResponseType<{ id: number, email: string, login: string }>>('auth/login')

	}
}

export const todolistAPI = {
	getTodolists() {
		return instance.get<TodolistResponseType[]>("todo-lists")

	},
	addTodolist(title: string) {
		return instance.post<ResponseType<{ item: TodolistResponseType }>>("todo-lists", {title})

	},
	updateTodolist(todolistId: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})

	},
	deleteTodolist(todolistId: string) {
		return instance.delete<ResponseType>(`todo-lists/${todolistId}`)

	}
}


export const tasksAPI = {
	getTasks(todolistId: string) {
		return instance.get<ResponseTaskType>(`todo-lists/${todolistId}/tasks`)

	},
	addTask(todolistId: string, title: string) {
		return instance.post<ResponseType<{ item: ServerTaskType }>>(`todo-lists/${todolistId}/tasks`, {title})

	},
	updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
		return instance.put<ResponseType<{ item: ServerTaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)

	},
	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)

	}
}
