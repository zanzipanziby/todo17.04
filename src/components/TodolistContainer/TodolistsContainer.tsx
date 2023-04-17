import React, {useEffect} from 'react';
import {useAppDispatch} from "../../customHooks/useAppDispatch";
import {useAppSelector} from "../../customHooks/useAppSelector";
import {Todolist} from "../Todolist/Todolist";
import {TodolistDomainType} from "../../types/types";
import {getTodolist} from "../../store/reducers/todolist-reducers";
import s from "./TodolistsContainer.module.css"

export const TodolistsContainer = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(state => state.todolists)
    useEffect(() => {
        dispatch(getTodolist())
    }, [])

    const todolistsRender = todolists.map((todolist: TodolistDomainType) => {
        return (

            <Todolist
                key={todolist.id}
                todolistId={todolist.id}
                filter={todolist.filter}
                title={todolist.title}
            />)
    })


    return (
        <div className={s.todolistsContainer}>
            {todolistsRender}
        </div>
    );
};

