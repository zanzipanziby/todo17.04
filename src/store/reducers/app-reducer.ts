import {AppStateType, RequestStatusType} from "../../types/types";
import {authAPI} from "../../api/api";
import {setIsLoggedInAC} from "./login-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appServerErrorHandle} from "../../utils/error-utils";

const initialState: AppStateType = {
	initialized: false,
	status: "idle",
	error: null
}
const slice = createSlice({
	name: "app",
	initialState: initialState,
	reducers: {
		setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
			state.status = action.payload.status
		},
		setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
			state.error = action.payload.error
		},
		// setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
		// 	state.initialized = action.payload.isInitialized
		// }

	},
	extraReducers: builder => {
		// TODO добавить реакцию на диспатч санок других слайсов(крутили, ерроры итд) с помощью addMatcher
		builder.addCase(initializeAppTC.fulfilled, state => {
			state.initialized = true
		})
	}
})

export const appReducer = slice.reducer

export const {
	setAppStatusAC,
	setAppErrorAC,
	// setAppInitializedAC
} = slice.actions

// export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
// 	switch (action.type) {
// 		case "SET_APP_STATUS":
// 			return {...state, status: action.payload.status}
// 		case "SET_APP_ERROR":
// 			return {...state, error: action.payload.error}
// 		case "SET_INITIALIZED":
// 			return {...state, initialized: action.payload.value}
// 		default:
// 			return state
// 	}
// }

// export type setAppStatusActionType = ReturnType<typeof setAppStatusAC>
// export const setAppStatusAC = (status: RequestStatusType) => (
// 	{
// 		type: "SET_APP_STATUS",
// 		payload: {
// 			status
// 		}
// 	} as const
// )
//
// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export const setAppErrorAC = (error: string | null) => (
// 	{
// 		type: "SET_APP_ERROR",
// 		payload: {
// 			error
// 		}
// 	} as const
// )
//
// export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
// export const setAppInitializedAC = (value: boolean) => (
// 	{
// 		type: "SET_INITIALIZED",
// 		payload: {
// 			value
// 		}
// 	} as const
// )

// --------- Thunk ---------------


export const initializeAppTC = createAsyncThunk(
	"app/initialize",
	async (arg, thunkAPI) => {
		const dispatch = thunkAPI.dispatch
		const res = await authAPI.authMe()
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedInAC({isLoggedIn: true}))
		} else {
			appServerErrorHandle(res.data, dispatch)
		}
		// dispatch(setAppInitializedAC({isInitialized: true}))
	}
)

// export const initializeAppTC = () => (dispatch: Dispatch) => {
// 	authAPI.authMe()
// 		.then((data) => {
// 			if (data.resultCode === 0) {
// 				dispatch(setIsLoggedInAC({isLoggedIn: true}))
// 			}
// 			dispatch(setAppInitializedAC({isInitialized: true}))
// 		})
// }