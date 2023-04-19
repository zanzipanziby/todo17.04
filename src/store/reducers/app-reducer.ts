import {ActionsType, AppStateType, RequestStatusType} from "../../types/types";

const initialState: AppStateType = {
    status: "idle",
    error: null
}
export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case "SET_APP_STATUS":
            return {...state, status: action.payload.status}
        case "SET_APP_ERROR":
            return {...state, error: action.payload.error}

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