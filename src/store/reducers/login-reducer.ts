import { LoginRequestType, LoginStateType } from "../../types/types";
import { authAPI } from "../../api/api";
import { setAppStatusAC } from "./app-reducer";
import {
  appServerErrorHandle,
  networkServerErrorHandle,
} from "../../utils/error-utils";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LoginStateType = {
	isLoggedIn: false
}


// ----------   RTC Slice   ------------

const slice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
			state.isLoggedIn = action.payload.isLoggedIn
		}
	},
	extraReducers: builder => {
		builder
			.addCase(loginTC.fulfilled, (state, action) => {
				if (action.payload) {
					state.isLoggedIn = action.payload.isLoggedIn
				}
			})
	}
})

// ------------ Thunks RTC  ----------------
export const loginTC = createAsyncThunk(
	"auth/login",
	async (arg: LoginRequestType, thunkAPI) => {
		thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
		try {
			const res = await authAPI.login(arg)
			thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
			if (res.data.resultCode === 0) {
				return {isLoggedIn: true}
			} else {
				appServerErrorHandle(res.data, thunkAPI.dispatch)
				return thunkAPI.rejectWithValue({isLoggedIn: false})
			}

		} catch (error) {
			networkServerErrorHandle(error as AxiosError, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({isLoggedIn: false})
		}
	}
)


// ------------ Thunks Redux  ----------------

// export const loginTCC = (data: LoginRequestType) => (dispatch: Dispatch) => {
// 	dispatch(setAppStatusAC({status: "loading"}))
// 	authAPI.login(data)
// 		.then((res) => {
// 			if (res.resultCode === 0) {
// 				dispatch(setIsLoggedInAC({isLoggedIn: true}))
// 			} else {
// 				appServerErrorHandle(res, dispatch)
// 			}
// 			dispatch(setAppStatusAC({status: "succeeded"}))
// 		})
// 		.catch((error: AxiosError) => {
// 			networkServerErrorHandle(error, dispatch)
// 		})
// }


export const logoutTC = createAsyncThunk(
	"auth/logout",
	async (arg, thunkAPI) => {
		const dispatch = thunkAPI.dispatch
		dispatch(setAppStatusAC({status: "loading"}))

		try {
			const res = await authAPI.logout()
			dispatch(setAppStatusAC({status: "succeeded"}))

			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC({isLoggedIn: false}))
			} else {
				appServerErrorHandle(res.data, dispatch)
			}

		} catch (e) {
			networkServerErrorHandle(e as AxiosError, dispatch)
		}
	}
)
// export const logoutTC = () => (dispatch: Dispatch) => {
//
// 	authAPI.logout()
// 		.then(data => {
// 			if (data.resultCode === 0) {
// 				dispatch(setIsLoggedInAC({isLoggedIn: false}))
// 				dispatch(clearStateAC())
// 			} else {
// 				appServerErrorHandle(data, dispatch)
// 			}
// 			dispatch(setAppStatusAC({status: "succeeded"}))
// 		})
// 		.catch((error: AxiosError) => {
// 			networkServerErrorHandle(error, dispatch)
// 		})
// }


export const loginReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

