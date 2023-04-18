import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}
const EditableSpan = (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [error, setError] = useState(false)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }
    const onBlurHandler = () => {
        if(!title) {
            setError(true)
            return
        }
        props.changeTitle(title)
        setEditMode(false)

    }

    if(editMode) {
        return <TextField
            onDoubleClick={()=> setEditMode(false)}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            error={error}
            label={!error ? "" : "please, enter value"}
            value={title}
            variant={"standard"}
            size={"medium"}
            autoFocus
        />
    }

        return <span onDoubleClick={()=>setEditMode(true)}>{props.title}</span>

};

export default EditableSpan;