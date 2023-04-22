import React from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";
import s from './DeleteButton.module.css'


type DeleteButtonPropsType = {
    callback: () => void
    disabled: boolean
}
const DeleteButton = (props: DeleteButtonPropsType) => {
    return (
        <div className={s.buttonContainer}>
            <IconButton size={"small"} onClick={props.callback} disabled={props.disabled}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
};

export default DeleteButton;