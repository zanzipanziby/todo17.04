import React from "react";
import s from "./Todolist.module.css";
import {
  DomainTaskType,
  FilterValueType,
  RequestStatusType,
  TaskStatuses,
} from "../../types/types";

import { tasksActions } from "../../store/reducers/tasks-reducer";
import { useAppSelector } from "../../customHooks/useAppSelector";
import Task from "../Task/Task";
import { todolistsActions } from "../../store/reducers/todolist-reducers";
import { Button, ButtonGroup, Card } from "@mui/material";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import DeleteButton from "../DeleteButton/DeleteButton";
import Box from "@mui/material/Box";
import { tasksSelectors } from "../../store/selectors";
import { useActions } from "../../customHooks/useActions";

type TodolistPropsType = {
  todolistId: string;
  filter: FilterValueType;
  title: string;
  entityStatus: RequestStatusType;
};

export const Todolist = (props: TodolistPropsType) => {
  const {
    deleteTodolistTC,
    updateTodolistTitleTC,
    changeTodolistFilterValueAC,
  } = useActions(todolistsActions);
  const { updateTaskTC, addTaskTC, deleteTaskTC } = useActions(tasksActions);

  //todo need refactoring tasks selector
  const tasks = useAppSelector((state) =>
    tasksSelectors.selectTasksForTodolist(state, props.todolistId)
  );

  const filteredTasks = (tasks: DomainTaskType[], filter: FilterValueType) => {
    switch (filter) {
      case "all":
        return tasks;
      case "active":
        return tasks.filter((t) => t.status !== TaskStatuses.Completed);
      case "complete":
        return tasks.filter((t) => t.status === TaskStatuses.Completed);
    }
  };

  const deleteTodolist = () => {
    deleteTodolistTC({ todolistId: props.todolistId });
  };
  const updateTodolistTitle = (title: string) => {
    updateTodolistTitleTC({ todolistId: props.todolistId, title });
  };
  const changeTodolistFilterValue = (filterValue: FilterValueType) => {
    changeTodolistFilterValueAC({
      todolistId: props.todolistId,
      filter: filterValue,
    });
  };
  const deleteTask = (taskId: string) => {
    deleteTaskTC({ todolistId: props.todolistId, taskId: taskId });
  };

  const addTask = (title: string) => {
    addTaskTC({ todolistId: props.todolistId, title });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatuses) => {
    updateTaskTC({
      todolistId: props.todolistId,
      taskId,
      updateModel: { status: status },
    });
  };

  const updateTaskTitle = (taskId: string, title: string) => {
    updateTaskTC({
      todolistId: props.todolistId,
      taskId,
      updateModel: { title },
    });
  };
  const filterButtonStyle = (value: FilterValueType) => {
    if (props.filter === value) {
      return "contained";
    }
  };

  const tasksRender = filteredTasks(tasks, props.filter).map((task) => {
    return (
      <li>
        <Task
          title={task.title}
          status={task.status}
          deleteTask={() => deleteTask(task.id)}
          updateTaskStatus={(status: TaskStatuses) =>
            updateTaskStatus(task.id, status)
          }
          updateTaskTitle={(title: string) => updateTaskTitle(task.id, title)}
          entityStatus={task.entityStatus}
        />
      </li>
    );
  });

  return (
    <Card className={s.card}>
      <Box className={s.titleContainer}>
        <h2>
          <EditableSpan
            title={props.title}
            changeTitle={updateTodolistTitle}
            disableEditMode={props.entityStatus === "loading"}
          />
        </h2>
        <DeleteButton
          callback={deleteTodolist}
          disabled={props.entityStatus === "loading"}
        />
      </Box>
      <AddItemForm
        label={"New Task"}
        getTitle={addTask}
        disabled={props.entityStatus === "loading"}
      />
      <ul>{tasksRender}</ul>
      <ButtonGroup size="small" className={s.buttonGroup}>
        <Button
          onClick={() => changeTodolistFilterValue("all")}
          variant={filterButtonStyle("all")}
        >
          All
        </Button>
        <Button
          onClick={() => changeTodolistFilterValue("active")}
          variant={filterButtonStyle("active")}
        >
          Active
        </Button>
        <Button
          onClick={() => changeTodolistFilterValue("complete")}
          variant={filterButtonStyle("complete")}
        >
          Completed
        </Button>
      </ButtonGroup>
    </Card>
  );
};
