import React, { ChangeEvent, useState } from "react";
import { TextField } from "@mui/material";

type EditableSpanPropsType = {
  title: string;
  changeTitle: (title: string) => void;
  disableEditMode: boolean;
};
const EditableSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [error, setError] = useState(false);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    setError(false);
  };
  const onBlurHandler = () => {
    if (!title.trim()) {
      setError(true);
      return;
    }
    props.changeTitle(title.trim());
    setEditMode(false);
  };

  const onDoubleClickHandler = () => {
    !props.disableEditMode && setEditMode(true);
  };

  if (editMode) {
    return (
      <TextField
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        error={error}
        label={!error ? "" : "please, enter value"}
        value={title}
        variant={"standard"}
        size={"medium"}
        autoFocus
      />
    );
  }

  return <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>;
};

export default EditableSpan;
