import { LoginRequestType, LoginStateType } from "../../types/types";
import { authAPI } from "../../api/api";
import {
  appServerErrorHandle,
  networkServerErrorHandle,
} from "../../utils/error-utils";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "./app-reducer";

const initialState: LoginStateType = {
  isLoggedIn: false,
};

// ----------   RTC Slice   ------------

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = action.payload.isLoggedIn;
      }
    });
  },
});

// ------------ Thunks RTC  ----------------
const loginTC = createAsyncThunk(
  "auth/login",
  async (arg: LoginRequestType, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({ status: "loading" }));
    try {
      const res = await authAPI.login(arg);
      thunkAPI.dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        appServerErrorHandle(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({ isLoggedIn: false });
      }
    } catch (error) {
      networkServerErrorHandle(error as AxiosError, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({ isLoggedIn: false });
    }
  }
);

const logoutTC = createAsyncThunk("auth/logout", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  dispatch(appActions.setAppStatusAC({ status: "loading" }));

  try {
    const res = await authAPI.logout();
    dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ isLoggedIn: false }));
    } else {
      appServerErrorHandle(res.data, dispatch);
    }
  } catch (e) {
    networkServerErrorHandle(e as AxiosError, dispatch);
  }
});

const { setIsLoggedInAC } = slice.actions;
const loginThunk = { loginTC, logoutTC };
export const loginActions = { ...slice.actions, ...loginThunk };
export const loginReducer = slice.reducer;
