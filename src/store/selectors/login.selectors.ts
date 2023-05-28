import {RootStateType} from "../store";

export const selectIsLoggedIn = (state: RootStateType) => state.login.isLoggedIn;