import {LoginRequestType, LoginStateType} from "../../types/types";
import {authAPI} from "../../api/api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {clearStateAC} from "./todolist-reducers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: LoginStateType = {
	isLoggedIn: false
}


// RTC Slice

const slice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
			state.isLoggedIn = action.payload.isLoggedIn
		}
	}
})


export const loginReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
// export const loginReducer = (state: LoginStateType = initialState, action: ActionsType) => {
//     switch (action.type) {
//         case "SET_IS_LOGGED_IN":
//             return {...state, isLoggedIn: action.payload.isLoggedIn}
//         default:
//             return state
//     }
// }


//------------  Action ----------------

// export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
// export const setIsLoggedInAC = (isLoggedIn: boolean) => (
// 	{
// 		type: "SET_IS_LOGGED_IN",
// 		payload: {
// 			isLoggedIn
// 		}
// 	} as const
// )


// ------------ Thunks ----------------

export const loginTC = (data: LoginRequestType) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: "loading"}))
	authAPI.login(data)
		.then((res) => {
			if (res.resultCode === 0) {
				dispatch(setIsLoggedInAC({isLoggedIn: true}))
			} else {
				appServerErrorHandle(res, dispatch)
			}
			dispatch(setAppStatusAC({status: "succeeded"}))
		})
		.catch((error: AxiosError) => {
			networkServerErrorHandle(error, dispatch)
		})
}

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