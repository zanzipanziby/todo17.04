import {TasksStateType, TaskStatuses} from "../../../types/types";
import {deleteTaskTC, tasksReducers} from "../tasks-reducer";

export let startState: TasksStateType = {}
beforeEach(() => {
	startState = {
		'todolistId1': [
			{
				id: "1",
				title: "HTML",
				status: TaskStatuses.New,
				deadline: null, startDate: "",
				entityStatus: "idle", addedDate: "",
				description: "",
				todoListId: 'todolistId1',
				priority: 0,
				order: 0
			},
			{
				id: "2",
				title: "CSS",
				status: TaskStatuses.Completed,
				deadline: null, startDate: "",
				entityStatus: "idle", addedDate: "",
				description: "",
				todoListId: 'todolistId1',
				priority: 0,
				order: 0
			}
		],
		'todolistId2': [
			{
				id: "3",
				title: "React",
				status: TaskStatuses.New,
				deadline: null, startDate: "",
				entityStatus: "idle", addedDate: "",
				description: "",
				todoListId: 'todolistId2',
				priority: 0,
				order: 0
			},
			{
				id: "4",
				title: "Redux",
				status: TaskStatuses.Completed,
				deadline: null, startDate: "",
				entityStatus: "idle", addedDate: "",
				description: "",
				todoListId: 'todolistId2',
				priority: 0,
				order: 0
			}
		],
	}
})

test('task should be deleted',()=> {
	const action = deleteTaskTC.fulfilled(
		{todolistId:'todolistId1', taskId: "1"},
		"",
		{todolistId:'todolistId1', taskId: "1"}

		)
	const endState = tasksReducers(startState, action)

	expect(endState['todolistId1'].length).toBe(1)
})








