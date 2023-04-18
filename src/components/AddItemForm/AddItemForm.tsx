import React, {ChangeEvent, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import AddBoxIcon from '@mui/icons-material/AddBox';
import s from './AddItemForm.module.css'

type AddItemFormPropsType = {
    label: string
    getTitle: (title: string) => void
}
const AddItemForm = (props: AddItemFormPropsType) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState(false)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }
    const onClickHandler = () => {
        if (!title) {
            setError(true)
            return
        }
        props.getTitle(title)
        setTitle('')
    }

    return (
        <Box className={s.addItemFormContainer}>
            <TextField
                label={!error ? props.label : "please, enter value"}
                value={title} onChange={onChangeHandler}
                error={error}
                onBlur={() => setError(false)}
            />
            <IconButton>
                <AddBoxIcon color={'primary'} onClick={onClickHandler}/>
            </IconButton>
        </Box>

    );
};

export default AddItemForm;