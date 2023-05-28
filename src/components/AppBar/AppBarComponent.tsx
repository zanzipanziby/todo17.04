import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import s from "./AppBarComponent.module.css";
import { LinearProgress } from "@mui/material";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { CustomizedSnackbars } from "../ErrorSnackbar/ErrorSnackbar";
import { logoutTC } from "../../store/reducers/login-reducer";
import { useAppDispatch } from "../../customHooks/useAppDispatch";
import {appSelectors, loginSelectors} from "../../store/selectors";

export function AppBarComponent() {
  const status = useAppSelector(appSelectors.selectStatus);
  const isLoggedIn = useAppSelector(loginSelectors.selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(logoutTC());
  };
  return (
    <Box className={s.appBar}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todolist
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {status === "loading" ? (
        <LinearProgress />
      ) : (
        <div style={{ height: "4px" }}></div>
      )}
      <CustomizedSnackbars />
    </Box>
  );
}
