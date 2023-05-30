import { combineReducers } from "redux";
import { todolistReducers } from "./reducers/todolist-reducers";
import { tasksReducers } from "./reducers/tasks-reducer";
import { appReducer } from "./reducers/app-reducer";
import { loginReducer } from "./reducers/login-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistReducers,
  tasks: tasksReducers,
  app: appReducer,
  login: loginReducer,
});

// export const store = createStore(rootReducer,applyMiddleware(thunk))
export const store = configureStore({
  reducer: rootReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

//
//@ts-ignore
window.store = store;
