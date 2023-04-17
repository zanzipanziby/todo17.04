import {RootStateType} from "../store/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";

export type AppThunkDispatch = ThunkDispatch<RootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();

