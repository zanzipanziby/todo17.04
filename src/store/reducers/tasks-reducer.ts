import {
  RequestStatusType,
  TasksStateType,
  UpdateTaskDomainModelType,
} from "../../types/types";
import { tasksAPI } from "../../api/api";
import { RootStateType } from "../store";
import { AxiosError } from "axios";
import {
  appServerErrorHandle,
  networkServerErrorHandle,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "./todolist-reducers";
import { loginActions } from "./login-reducer";
import { appActions } from "./app-reducer";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        status: RequestStatusType;
      }>
    ) {
      const index = state[action.payload.todolistId].findIndex(
        (t) => t.id === action.payload.taskId
      );
      if (index > -1) {
        state[action.payload.todolistId][index].entityStatus =
          action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.getTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          action.payload.todolists.forEach((tl) => {
            state[tl.id] = [];
          });
        }
      })
      .addCase(todolistsActions.addTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolist.id] = [];
        }
      })
      .addCase(todolistsActions.deleteTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          delete state[action.payload.todolistId];
        }
      })
      .addCase(loginActions.logoutTC.fulfilled, () => {
        return {};
      })
      .addCase(tasksActions.getTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
          ...t,
          entityStatus: "idle",
        }));
      })
      .addCase(tasksActions.deleteTaskTC.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          const index = state[action.payload.todolistId].findIndex(
            (t) => t.id === action.payload?.taskId
          );
          if (index > -1) {
            state[action.payload.todolistId].splice(index, 1);
          }
        }
      })
      .addCase(tasksActions.addTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolistId].unshift({
            ...action.payload.task,
            entityStatus: "idle",
          });
        }
      })
      .addCase(tasksActions.updateTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state[action.payload?.todolistId].findIndex(
            (t) => t.id === action.payload?.taskId
          );
          if (index > -1) {
            state[action.payload.todolistId][index] = {
              ...state[action.payload.todolistId][index],
              ...action.payload.updatedTask,
              entityStatus: "idle",
            };
          }
        }
      });
  },
});

// ------------  Thunk  RTC--------------
const getTasksTC = createAsyncThunk(
  "tasks/getTasks",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({ status: "loading" }));
    const res = await tasksAPI.getTasks(todolistId);
    thunkAPI.dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
    return { todolistId, tasks: res.data.items };
  }
);

const deleteTaskTC = createAsyncThunk(
  "tasks/deleteTask",
  async (arg: { todolistId: string; taskId: string }, thunkAPI) => {
    const { todolistId, taskId } = arg;
    const dispatch = thunkAPI.dispatch;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTaskEntityStatusAC({ todolistId, taskId, status: "loading" })
    );

    try {
      const res = await tasksAPI.deleteTask(todolistId, taskId);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        //TODO здесь диспатчатся экшены редьюсера и возврощаются данные для экстра - это разделение логики, нужно пофиксить
        return { todolistId, taskId };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
      thunkAPI.dispatch(
        changeTaskEntityStatusAC({ todolistId, taskId, status: "succeeded" })
      );
    } catch (e) {
      networkServerErrorHandle(e as AxiosError, dispatch);
    }
  }
);

// ------------  Thunk  Redux--------------

const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (arg: { todolistId: string; title: string }, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { todolistId, title } = arg;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    dispatch(
      todolistsActions.changeTodolistEntityStatusAC({
        todolistId,
        status: "loading",
      })
    );
    try {
      const res = await tasksAPI.addTask(todolistId, title);
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { todolistId, task: res.data.data.item };
      } else {
        appServerErrorHandle(res.data, dispatch);
        return thunkAPI.rejectWithValue(res.data.messages[0]);
      }
    } catch (e) {
      const error = e as AxiosError;
      networkServerErrorHandle(error, dispatch);
      return thunkAPI.rejectWithValue(error.message);
    }
	finally {
		dispatch(
			todolistsActions.changeTodolistEntityStatusAC({
				todolistId,
				status: "succeeded",
			})
		);
	}
  }
);
const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (
    arg: {
      todolistId: string;
      taskId: string;
      updateModel: UpdateTaskDomainModelType;
    },
    thunkAPI
  ) => {
    const dispatch = thunkAPI.dispatch;
    const { todolistId, taskId, updateModel } = arg;
    const state = thunkAPI.getState() as RootStateType;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      return;
    }
    const apiModel = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...updateModel,
    };
    const res = await tasksAPI.updateTask(todolistId, taskId, apiModel);
    try {
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { todolistId, taskId, updatedTask: res.data.data.item };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
    } catch (e) {
      networkServerErrorHandle(e as AxiosError, dispatch);
    }
  }
);

const { changeTaskEntityStatusAC } = slice.actions;

const tasksThunk = { addTaskTC, getTasksTC, updateTaskTC, deleteTaskTC };
export const tasksActions = { ...slice.actions, ...tasksThunk };
export const tasksReducers = slice.reducer;
