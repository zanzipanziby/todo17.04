import React from "react";
import s from "./LoginPage.module.css";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { useFormik } from "formik";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { Navigate } from "react-router-dom";
import { loginSelectors } from "../../store/selectors";
import { loginActions } from "../../store/reducers/login-reducer";
import { useActions } from "../../customHooks/useActions";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};
export const LoginPage = () => {
  const isLoggedIn = useAppSelector(loginSelectors.selectIsLoggedIn);
  const { loginTC } = useActions(loginActions);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length > 20) {
        errors.password = "Must be 20 characters or less";
      }

      return errors;
    },
    onSubmit: (values) => {
      loginTC(values);
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      height={"60vh"}
      alignItems={"center"}
    >
      <Grid item justifyContent={"center"}>
        <Paper style={{ padding: "20px" }} elevation={3}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={"https://social-network.samuraijs.com/"}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <TextField
                  label="Email"
                  margin="normal"
                  {...formik.getFieldProps("email")}
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className={s.errorText}>{formik.errors.email}</div>
                ) : null}
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  {...formik.getFieldProps("password")}
                />
                {formik.errors.password && formik.touched.password ? (
                  <div className={s.errorText}>{formik.errors.password}</div>
                ) : null}
                <FormControlLabel
                  label={"Remember me"}
                  control={
                    <Checkbox
                      {...formik.getFieldProps("rememberMe")}
                      checked={formik.values.rememberMe}
                    />
                  }
                />
                <Button type={"submit"} variant={"contained"} color={"primary"}>
                  Login
                </Button>
              </FormGroup>
            </form>
          </FormControl>
        </Paper>
      </Grid>
    </Grid>
  );
};
