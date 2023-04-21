import React from 'react';
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";
import {RequestStatusType} from "../../types/types";

type DeleteButtonPropsType = {
    callback: () => void
    disabled: boolean
}
const DeleteButton = (props: DeleteButtonPropsType) => {
    return (
        <IconButton size={"small"} onClick={props.callback} disabled={props.disabled}>
            <DeleteIcon/>
        </IconButton>
    );
};

export default DeleteButton;