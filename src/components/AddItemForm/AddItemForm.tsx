import React, {ChangeEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import s from "./AddItemForm.module.css";

type AddItemFormPropsType = {
	label: string;
	getTitle: (title: string) => Promise<string | null>;
	disabled?: boolean;
};
const AddItemForm = (props: AddItemFormPropsType) => {
	const [title, setTitle] = useState("");
	const [error, setError] = useState("");
	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setError("");
		setTitle(e.currentTarget.value);
	};
	const onClickHandler = async () => {
		debugger;
		if (!title) {
			setError("please enter value");
			return;
		}
		const res = await props.getTitle(title);
		console.log(res);
		if (res) {
			setError(res);
		} else {
			setTitle("");
		}
	};

	return (
		<Box className={s.addItemFormContainer}>
			<TextField
				title={error && error}
				label={!error ? props.label : error}
				value={title}
				onChange={onChangeHandler}
				error={!!error}
				onBlur={() => setError("")}
				disabled={props.disabled}
			/>
			<IconButton
				color={"primary"}
				onClick={onClickHandler}
				disabled={props.disabled}
			>
				<AddBoxIcon/>
			</IconButton>
		</Box>
	);
};

export default AddItemForm;
