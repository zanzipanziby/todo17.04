import React from 'react';
import './App.css';
import {TodolistsContainer} from "./components/TodolistContainer/TodolistsContainer";
import {Container} from "@mui/material";
import {AppBarComponent} from "./components/AppBar/AppBarComponent";


function App() {
    return (
        <div className="App">
            <Container maxWidth={"lg"} >
                <AppBarComponent/>
                <TodolistsContainer/>
            </Container>
        </div>
    );
}

export default App;
