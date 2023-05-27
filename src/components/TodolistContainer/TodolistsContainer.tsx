import React, { useEffect } from "react";
import { useAppDispatch } from "../../customHooks/useAppDispatch";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { Todolist } from "../Todolist/Todolist";
import { TodolistDomainType } from "../../types/types";
import {
  addTodolistTC,
  getTodolistTC,
} from "../../store/reducers/todolist-reducers";
import s from "./TodolistsContainer.module.css";
import { Grid } from "@mui/material";
import AddItemForm from "../AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";

export const TodolistsContainer = () => {
  const dispatch = useAppDispatch();
  const todolists = useAppSelector((state) => state.todolists);
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  useEffect(() => {
    dispatch(getTodolistTC());
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const addTodolist = (title: string) => {
    dispatch(addTodolistTC({ title }));
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
