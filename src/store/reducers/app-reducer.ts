import { AppStateType, RequestStatusType } from "../../types/types";
import { authAPI } from "../../api/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appServerErrorHandle } from "../../utils/error-utils";
import { loginActions } from "./login-reducer";

const initialState: AppStateType = {
  initialized: false,
  status: "idle",
  error: null,
};
const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatusAC(
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      state.status = action.payload.status;
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    // TODO добавить реакцию на диспатч санок других слайсов(крутили, ерроры итд) с помощью addMatcher
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.initialized = true;
    });
  },
});

// --------- Thunk ---------------

const initializeAppTC = createAsyncThunk(
  "app/initialize",
  async (arg, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const res = await authAPI.authMe();
    if (res.data.resultCode === 0) {
      dispatch(loginActions.setIsLoggedInAC({ isLoggedIn: true }));
    } else {
      appServerErrorHandle(res.data, dispatch);
    }
  }
);

const appThunk = { initializeAppTC };
export const appActions = { ...slice.actions, ...appThunk };
export const appReducer = slice.reducer;
