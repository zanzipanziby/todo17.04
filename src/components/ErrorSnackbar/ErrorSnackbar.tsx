import React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { appActions } from "../../store/reducers/app-reducer";
import { appSelectors } from "../../store/selectors";
import { useActions } from "../../customHooks/useActions";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function CustomizedSnackbars() {
  const error = useAppSelector(appSelectors.selectError);
  const { setAppErrorAC } = useActions(appActions);
  const isOpen = error !== null;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAppErrorAC({ error: null });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
