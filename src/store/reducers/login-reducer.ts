import {LoginRequestType, LoginStateType} from "../../types/types";
import {authAPI} from "../../api/api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearStateAC} from "./todolist-reducers";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

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
		const res = await authAPI.login(arg)
		try {
			if (res.resultCode === 0) {
				return {isLoggedIn: true}
			} else {
				appServerErrorHandle(res, thunkAPI.dispatch)
				return thunkAPI.rejectWithValue({isLoggedIn: false})
			}
			thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
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

export const logoutTC = () => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	authAPI.logout()
		.then(data => {
			if (data.resultCode === 0) {
				dispatch(setIsLoggedInAC({isLoggedIn: false}))
				dispatch(clearStateAC())
			} else {
				appServerErrorHandle(data, dispatch)
			}
			dispatch(setAppStatusAC({status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}


export const loginReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

