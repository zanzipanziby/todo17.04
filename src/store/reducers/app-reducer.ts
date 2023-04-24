import {ActionsType, AppStateType, RequestStatusType} from "../../types/types";
import {Dispatch} from "redux";
import {authAPI} from "../../api/api";
import {setIsLoggedInAC} from "./login-reducer";

const initialState: AppStateType = {
    initialized: false,
    status: "idle",
    error: null
}
export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case "SET_APP_STATUS":
            return {...state, status: action.payload.status}
        case "SET_APP_ERROR":
            return {...state, error: action.payload.error}
        case "SET_INITIALIZED":
            return {...state, initialized: action.payload.value}
        default:
            return state
    }
}

export type setAppStatusActionType = ReturnType<typeof setAppStatusAC>
export const setAppStatusAC = (status: RequestStatusType) => (
    {
        type: "SET_APP_STATUS",
        payload: {
            status
        }
    } as const
)

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export const setAppErrorAC = (error: string | null) => (
    {
        type: "SET_APP_ERROR",
        payload: {
            error
        }
    } as const
)

export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
export const setAppInitializedAC = (value: boolean) => (
    {
        type: "SET_INITIALIZED",
        payload: {
            value
        }
    } as const
)

// --------- Thunk ---------------

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.authMe()
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else {

            }
            dispatch(setAppInitializedAC(true))
        })
}