import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import s from './AppBarComponent.module.css'
import {LinearProgress} from "@mui/material";
import {useAppSelector} from "../../customHooks/useAppSelector";

export  function AppBarComponent() {
    const status = useAppSelector(state => state.app.status)
    return (
        <Box className={s.appBar}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Todolist
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress/>}
        </Box>
    );
}