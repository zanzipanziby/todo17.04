import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistReducers} from "./reducers/todolist-reducers";
import {tasksReducers} from "./reducers/tasks-reducer";
import thunk from "redux-thunk";



const rootReducer = combineReducers({
    todolists: todolistReducers,
    tasks: tasksReducers
})

export const store = createStore(rootReducer,applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof rootReducer>

