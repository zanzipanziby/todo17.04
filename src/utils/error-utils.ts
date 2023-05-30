import { ResponseType } from "../types/types";
import { Dispatch } from "redux";
import { AxiosError } from "axios";
import { appActions } from "../store/reducers/app-reducer";

export const appServerErrorHandle = <T>(
  data: ResponseType<T>,
  dispatch: Dispatch
) => {
  if (data.messages.length) {
    dispatch(appActions.setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppErrorAC({ error: "some error" }));
  }
};

export const networkServerErrorHandle = (
  error: AxiosError,
  dispatch: Dispatch
) => {
  dispatch(
    appActions.setAppErrorAC({
      error: error.message ? error.message : "some error",
    })
  );
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};
