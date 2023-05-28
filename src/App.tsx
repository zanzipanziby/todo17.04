import React, { useEffect } from "react";
import "./App.css";
import { TodolistsContainer } from "./components/TodolistContainer/TodolistsContainer";
import { CircularProgress, Container } from "@mui/material";
import { AppBarComponent } from "./components/AppBar/AppBarComponent";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage/LoginPage";
import { useAppSelector } from "./customHooks/useAppSelector";
import { useAppDispatch } from "./customHooks/useAppDispatch";
import { initializeAppTC } from "./store/reducers/app-reducer";
import { selectInitialized } from "./store/selectors/app.selectors";

function App() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(selectInitialized);
  useEffect(() => {
    dispatch(initializeAppTC());
  }, [dispatch]);

  if (!initialized) {
    return (
      <CircularProgress
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
        }}
      />
    );
  }

  return (
    <div className="App">
      <Container maxWidth={"lg"}>
        <AppBarComponent />
        <Routes>
          <Route path={"/"} element={<TodolistsContainer />} />
          <Route path={"/login"} element={<LoginPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
