import { RootStateType } from "../store";

export const selectStatus = (state: RootStateType) => state.app.status;
export const selectInitialized = (state: RootStateType) =>
  state.app.initialized;
export const selectError = (state: RootStateType) => state.app.error;
