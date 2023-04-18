import React, {useEffect} from 'react';
import {useAppDispatch} from "../../customHooks/useAppDispatch";
import {useAppSelector} from "../../customHooks/useAppSelector";
import {Todolist} from "../Todolist/Todolist";
import {TodolistDomainType} from "../../types/types";
import {addTodolistTC, getTodolistTC} from "../../store/reducers/todolist-reducers";
import s from "./TodolistsContainer.module.css"
import {Grid} from "@mui/material";
import AddItemForm from "../AddItemForm/AddItemForm";

export const TodolistsContainer = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(state => state.todolists)
    useEffect(() => {
        dispatch(getTodolistTC())
    }, [])
    const addTodolist = (title:string) => {
        dispatch(addTodolistTC(title))
    }

    const todolistsRender = todolists.map((todolist: TodolistDomainType) => {
        return (

            <Grid item>
                    <Todolist
                        key={todolist.id}
                        todolistId={todolist.id}
                        filter={todolist.filter}
                        title={todolist.title}
                    />
            </Grid>
        )
    })


    return (
        <div className={s.todolistsContainer}>
            <AddItemForm label={"New Todolist"} getTitle={addTodolist}/>
            <Grid container spacing={5}>
                {todolistsRender}
            </Grid>
        </div>
    );
};

