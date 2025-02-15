import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const MAX_COL = 10;
export const MAX_ROW = 10;

const initialState: GridState = {
  cells: {},
  redoStack: [],
  undoStack: [],
  selectedCells: [],
  activeCell: null,
};

export const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    SELECT_CELL: (state, action: PayloadAction<string | null>) => {
      state.activeCell = action.payload;
    },
    SET_CONTENT: (
      state,
      action: PayloadAction<{ cellId: string; content: string | number }>
    ) => {
      const cell = state.cells[action.payload.cellId];
      if (!action.payload.content) {
        delete state.cells[action.payload.cellId];
        return;
      }
      if (!cell) {
        state.cells[action.payload.cellId] = {
          id: action.payload.cellId,
          value: action.payload.content,
          type: "text",
        };
        return;
      }
      cell.value = action.payload.content;
    },
  },
});

export const { SELECT_CELL, SET_CONTENT } = gridSlice.actions;
type Actions = ReturnType<typeof SELECT_CELL | typeof SET_CONTENT>;
