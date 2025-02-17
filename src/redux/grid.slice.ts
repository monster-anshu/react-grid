import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridState } from '~/type';

const initialState: GridState = {
  cells: {},
  redoStack: [],
  undoStack: [],
  selectedCells: [],
  activeCell: null,
};

export type UpdateContent = { cellId: string; content: string | number };

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    ACTIVATE_CELL: (state, action: PayloadAction<string | null>) => {
      state.activeCell = action.payload;
    },
    SELECT_CELL: (
      state,
      action: PayloadAction<{
        cellId: string | string[];
        removeSelection: boolean;
      }>,
    ) => {
      if (Array.isArray(action.payload.cellId)) {
        state.selectedCells = action.payload.cellId;
        return;
      }
      if (action.payload.removeSelection) {
        state.selectedCells = [];
      }
      if (state.selectedCells.includes(action.payload.cellId)) {
        return;
      }
      state.selectedCells.push(action.payload.cellId);
    },
    REMOVE_SELECTION: (
      state,
      { payload }: PayloadAction<{ cellId: string | null }>,
    ) => {
      if (payload.cellId === null) {
        state.selectedCells = [];
        return;
      }
      state.selectedCells = state.selectedCells.filter(
        (item) => item !== payload.cellId,
      );
    },
    SET_CONTENT: (
      state,
      action: PayloadAction<UpdateContent | UpdateContent[]>,
    ) => {
      const payload = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      payload.forEach(({ cellId, content }) => {
        const cell = state.cells[cellId];
        if (!content) {
          delete state.cells[cellId];
          return;
        }
        if (!cell) {
          state.cells[cellId] = {
            id: cellId,
            value: content,
            type: 'text',
          };
          return;
        }
        cell.value = content;
      });
    },
  },
});

export const { ACTIVATE_CELL, SET_CONTENT, SELECT_CELL, REMOVE_SELECTION } =
  gridSlice.actions;

export type Actions = ReturnType<typeof ACTIVATE_CELL | typeof SET_CONTENT>;
