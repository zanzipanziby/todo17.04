import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "../store";

const selectTasks = (state: RootStateType) => state.tasks;

export const selectTasksForTodolist = createSelector(
	[selectTasks, (state: RootStateType, todolistId: string) => todolistId],
	(tasks, todolistId) => tasks[todolistId]
);