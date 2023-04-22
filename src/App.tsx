import React from 'react';
import './App.css';
import {TodolistsContainer} from "./components/TodolistContainer/TodolistsContainer";
import {Container} from "@mui/material";
import {AppBarComponent} from "./components/AppBar/AppBarComponent";
import {Route, Routes} from 'react-router-dom'
import {LoginPage} from "./components/LoginPage/LoginPage";



function App() {
    return (
        <div className="App">
            <Container maxWidth={"lg"} >
                <AppBarComponent/>
                <Routes>
                    <Route path={"/"} element={<TodolistsContainer/>}/>
                    <Route path={"/login"} element={<LoginPage/>}/>
                </Routes>


            </Container>
        </div>
    );
}

export default App;
