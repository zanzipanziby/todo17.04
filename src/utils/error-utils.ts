import {setAppErrorAC, setAppStatusAC} from "../store/reducers/app-reducer";
import {ResponseType} from "../types/types";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

export const appServerErrorHandle = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
	if (data.messages.length) {
		dispatch(setAppErrorAC({error: data.messages[0]}))
	} else {
		dispatch(setAppErrorAC({error: 'some error'}))
	}
}

export const networkServerErrorHandle = (error: AxiosError, dispatch: Dispatch) => {
	dispatch(setAppErrorAC({error: error.message ? error.message : "some error"}))
	dispatch(setAppStatusAC({status: 'failed'}))
}