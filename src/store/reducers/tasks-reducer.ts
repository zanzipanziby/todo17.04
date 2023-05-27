import {
  RequestStatusType,
  TasksStateType,
  UpdateTaskDomainModelType,
} from "../../types/types";
import { tasksAPI } from "../../api/api";
import { RootStateType } from "../store";
import { setAppStatusAC } from "./app-reducer";
import {
  addTodolistTC,
  changeTodolistEntityStatusAC,
  deleteTodolistTC,
  getTodolistTC,
} from "./todolist-reducers";
import { AxiosError } from "axios";
import {
  appServerErrorHandle,
  networkServerErrorHandle,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {logoutTC} from "./login-reducer";

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
      .addCase(getTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          action.payload.todolists.forEach((tl) => {
            state[tl.id] = [];
          });
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolist.id] = [];
        }
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          delete state[action.payload.todolistId];
        }
      })
      .addCase(logoutTC.fulfilled, () => {
        return {};
      })
      .addCase(getTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
          ...t,
          entityStatus: "idle",
        }));
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          const index = state[action.payload.todolistId].findIndex(
            (t) => t.id === action.payload?.taskId
          );
          if (index > -1) {
            state[action.payload.todolistId].splice(index, 1);
          }
        }
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolistId].unshift({
            ...action.payload.task,
            entityStatus: "idle",
          });
        }
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
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
export const getTasksTC = createAsyncThunk(
  "tasks/getTasks",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await tasksAPI.getTasks(todolistId);
    thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
    return { todolistId, tasks: res.data.items };
  }
);

export const deleteTaskTC = createAsyncThunk(
  "tasks/deleteTask",
  async (arg: { todolistId: string; taskId: string }, thunkAPI) => {
    const { todolistId, taskId } = arg;
    const dispatch = thunkAPI.dispatch;
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTaskEntityStatusAC({ todolistId, taskId, status: "loading" })
    );

    try {
      const res = await tasksAPI.deleteTask(todolistId, taskId);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
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

export const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (arg: { todolistId: string; title: string }, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { todolistId, title } = arg;
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));
    const res = await tasksAPI.addTask(todolistId, title);
    try {
      dispatch(
        changeTodolistEntityStatusAC({ todolistId, status: "succeeded" })
      );
      dispatch(setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { todolistId, task: res.data.data.item };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
    } catch (e) {
      const error = e as AxiosError;
      networkServerErrorHandle(error, dispatch);
    }
  }
);
export const updateTaskTC = createAsyncThunk(
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
    dispatch(setAppStatusAC({ status: "loading" }));
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
      dispatch(setAppStatusAC({ status: "succeeded" }));
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

export const tasksReducers = slice.reducer;
export const {
  // setTasksAC,
  // deleteTaskAC,
  // addTaskAC,
  changeTaskEntityStatusAC,
} = slice.actions;
