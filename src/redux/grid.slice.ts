import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridState } from '~/type';

const initialState: GridState = {
  cells: {},
  redoStack: [],
  undoStack: [],
  selectedCells: [],
};

export type UpdateContent = { cellId: string; content: string | number };

const cloneState = ({ cells, selectedCells }: GridState) =>
  JSON.parse(JSON.stringify({ cells, selectedCells })) as Pick<
    GridState,
    'cells' | 'selectedCells'
  >;

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    SAVE_STATE: (state) => {
      const stateClone = cloneState(state);
      state.undoStack.push(stateClone);

      // if (state.undoStack.length > 100) {
      //   state.undoStack.length = 100;
      // }

      state.redoStack = [];
    },
    SELECT_CELL: (
      state,
      action: PayloadAction<{
        cellId: string | string[];
        removeSelection: boolean;
      }>,
    ) => {
      gridSlice.caseReducers.SAVE_STATE(state);
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
      gridSlice.caseReducers.SAVE_STATE(state);
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
      gridSlice.caseReducers.SAVE_STATE(state);

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
            type: typeof content === 'number' ? 'number' : 'text',
          };
          return;
        }
        cell.value = content;
        cell.type = typeof content === 'number' ? 'number' : 'text';
      });
    },
    UNDO: (state) => {
      const popped = state.undoStack.pop();
      if (!popped) return;
      state.redoStack.push(cloneState(state));
      Object.assign(state, popped);
    },
    REDO: (state) => {
      const popped = state.redoStack.pop();
      if (!popped) return;
      state.undoStack.push(cloneState(state));
      Object.assign(state, popped);
    },
  },
});

export const {
  SET_CONTENT,
  SELECT_CELL,
  REMOVE_SELECTION,
  SAVE_STATE,
  UNDO,
  REDO,
} = gridSlice.actions;
