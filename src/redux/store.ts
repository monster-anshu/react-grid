import { configureStore } from "@reduxjs/toolkit";
import { gridSlice } from "./grid.slice";

export const store = configureStore({
  reducer: {
    grid: gridSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
