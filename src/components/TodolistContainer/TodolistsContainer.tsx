import React, { useEffect } from "react";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { Todolist } from "../Todolist/Todolist";
import { TodolistDomainType } from "../../types/types";
import { todolistsActions } from "../../store/reducers/todolist-reducers";
import s from "./TodolistsContainer.module.css";
import { Grid } from "@mui/material";
import AddItemForm from "../AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import { loginSelectors, todolistsSelectors } from "../../store/selectors";
import { useActions } from "../../customHooks/useActions";

export const TodolistsContainer = () => {
  const { getTodolistTC, addTodolistTC } = useActions(todolistsActions);
  const todolists = useAppSelector(todolistsSelectors.selectTodolists);
  const isLoggedIn = useAppSelector(loginSelectors.selectIsLoggedIn);
  useEffect(() => {
    getTodolistTC();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const addTodolist = (title: string) => {
    addTodolistTC({ title });
  };

  const todolistsRender = todolists.map((todolist: TodolistDomainType) => {
    return (
      <Grid item>
        <Todolist
          key={todolist.id}
          todolistId={todolist.id}
          filter={todolist.filter}
          title={todolist.title}
          entityStatus={todolist.entityStatus}
        />
      </Grid>
    );
  });

  return (
    <div className={s.todolistsContainer}>
      <AddItemForm label={"New Todolist"} getTitle={addTodolist} />
      <Grid container spacing={5}>
        {todolistsRender}
      </Grid>
    </div>
  );
};
