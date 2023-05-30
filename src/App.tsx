import React, { useEffect } from "react";
import "./App.css";
import { TodolistsContainer } from "./components/TodolistContainer/TodolistsContainer";
import { CircularProgress, Container, Paper } from "@mui/material";
import { AppBarComponent } from "./components/AppBar/AppBarComponent";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage/LoginPage";
import { selectInitialized } from "./store/selectors/app.selectors";
import { useAppSelector } from "./customHooks/useAppSelector";
import { useActions } from "./customHooks/useActions";
import { appActions } from "./store/reducers/app-reducer";

function App() {
  const { initializeAppTC } = useActions(appActions);
  const initialized = useAppSelector(selectInitialized);
  useEffect(() => {
    initializeAppTC();
  }, [initializeAppTC]);

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
      <Container maxWidth={"lg"} >
        <Paper className={"appContainer"}>
          <AppBarComponent />
          <Routes>
            <Route path={"/"} element={<TodolistsContainer />} />
            <Route path={"/login"} element={<LoginPage />} />
          </Routes>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
