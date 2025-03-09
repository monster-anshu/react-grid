import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  widths: {} as Record<number, number>,
  heights: {} as Record<number, number>,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setWidth: (
      state,
      action: PayloadAction<{ colIndex: number; width: number }>,
    ) => {
      state.widths[action.payload.colIndex] = action.payload.width;
    },
    setHeight: (
      state,
      action: PayloadAction<{ rowIndex: number; height: number }>,
    ) => {
      state.heights[action.payload.rowIndex] = action.payload.height;
    },
  },
});

export const { setHeight, setWidth } = layoutSlice.actions;
