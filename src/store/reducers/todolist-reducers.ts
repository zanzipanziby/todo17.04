import {
  FilterValueType,
  RequestStatusType,
  TodolistDomainType,
} from "../../types/types";
import { todolistAPI } from "../../api/api";
import { setAppStatusAC } from "./app-reducer";
import {
  appServerErrorHandle,
  networkServerErrorHandle,
} from "../../utils/error-utils";
import { AxiosError } from "axios";
import { getTasksTC } from "./tasks-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutTC } from "./login-reducer";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilterValueAC(
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValueType }>
    ) {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload.todolists.map((tl) => ({
            ...tl,
            filter: "all",
            entityStatus: "idle",
          }));
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          state.unshift({
            ...action.payload.todolist,
            filter: "all",
            entityStatus: "idle",
          });
        }
      })
      .addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.findIndex(
            (tl) => tl.id === action.payload?.todolistId
          );
          if (index > -1) {
            state[index].title = action.payload.title;
          }
        }
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(
          (tl) => tl.id === action.payload?.todolistId
        );
        if (index > -1) {
          state.splice(index, 1);
        }
      })
      .addCase(logoutTC.fulfilled, () => {
        return [];
      });
  },
});
export const { changeTodolistFilterValueAC, changeTodolistEntityStatusAC } =
  slice.actions;
export const todolistReducers = slice.reducer;

//  -------------  Thunk  ---------------

export const getTodolistTC = createAsyncThunk(
  "todolists/getTodolists",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistAPI.getTodolists();
      dispatch(setAppStatusAC({ status: "succeeded" }));
      res.data.forEach((tl) => {
        dispatch(getTasksTC(tl.id));
      });
      return { todolists: res.data };
    } catch (e) {
      networkServerErrorHandle(e as AxiosError, dispatch);
    }
  }
);

export const addTodolistTC = createAsyncThunk(
  "todolists/addTodolist",
  async (arg: { title: string }, thunkAPI) => {
    const { title } = arg;
    const { dispatch } = thunkAPI;
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistAPI.addTodolist(title);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { todolist: res.data.data.item };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
    } catch (error) {
      networkServerErrorHandle(error as AxiosError, dispatch);
    }
  }
);

export const updateTodolistTitleTC = createAsyncThunk(
  "todolists/updateTodolistTitle",
  async (arg: { todolistId: string; title: string }, thunkAPI) => {
    const { todolistId, title } = arg;
    const { dispatch } = thunkAPI;
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistAPI.updateTodolist(todolistId, title);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { todolistId, title };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
    } catch (error) {
      networkServerErrorHandle(error as AxiosError, dispatch);
    }
  }
);

export const deleteTodolistTC = createAsyncThunk(
  "todolists/deleteTodolist",
  async (arg: { todolistId: string }, thunkAPI) => {
    const { todolistId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(changeTodolistEntityStatusAC({ todolistId, status: "loading" }));
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistAPI.deleteTodolist(todolistId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      dispatch(
        changeTodolistEntityStatusAC({ todolistId, status: "succeeded" })
      );
      if (res.data.resultCode === 0) {
        return { todolistId };
      } else {
        appServerErrorHandle(res.data, dispatch);
      }
    } catch (error) {
      networkServerErrorHandle(error as AxiosError, dispatch);
    }
  }
);
