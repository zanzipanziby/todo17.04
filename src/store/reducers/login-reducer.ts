import {ActionsType, LoginRequestType, LoginStateType} from "../../types/types";
import {authAPI} from "../../api/api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {appServerErrorHandle, networkServerErrorHandle} from "../../utils/error-utils";
import {AxiosError} from "axios";

const initialState: LoginStateType = {
    isLoggedIn: false
}
export const loginReducer = (state: LoginStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "SET_IS_LOGGED_IN":
            return {...state, isLoggedIn: action.payload.isLoggedIn}
        default:
            return state
    }
}

//------------  Action ----------------

export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
export const setIsLoggedInAC = (isLoggedIn: boolean) => (
    {
        type: "SET_IS_LOGGED_IN",
        payload: {
            isLoggedIn
        }
    } as const
)


// ------------ Thunks ----------------

export const loginTC = (data: LoginRequestType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    authAPI.login(data)
        .then((res) => {
            if (res.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else {
                appServerErrorHandle(res, dispatch)
            }
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch((error: AxiosError) => {
            networkServerErrorHandle(error, dispatch)
        })
}