import { combineReducers } from "redux";

import { configureStore } from "@reduxjs/toolkit";
import {
  appReducer,
  loginReducer,
  tasksReducers,
  todolistReducers,
} from "./reducers";

const rootReducer = combineReducers({
  todolists: todolistReducers,
  tasks: tasksReducers,
  app: appReducer,
  login: loginReducer,
});


export const store = configureStore({
  reducer: rootReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

//
//@ts-ignore
window.store = store;
