import React from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";

type DeleteButtonPropsType = {
    callback: () => void
}
const DeleteButton = (props: DeleteButtonPropsType) => {
    return (
        <IconButton size={"small"} onClick={props.callback}>
            <DeleteIcon/>
        </IconButton>
    );
};

export default DeleteButton;