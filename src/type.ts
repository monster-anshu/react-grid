// Basic cell structure
export interface Cell {
  id: string;
  value: string | number; // Actual cell value
  type: 'text' | 'number'; // Data type
}

// Grid state management
export interface GridState {
  cells: Record<string, Cell>; // Map of cell id to cell data
  selectedCells: string[]; // Array of selected cell ids
  activeCell: string | null; // Currently active cell id
  undoStack: GridAction[]; // Stack of actions for undo
  redoStack: GridAction[]; // Stack of actions for redo
}

// Action for undo/redo
export interface GridAction {
  type: 'UPDATE_CELL' | 'SORT_COLUMN' | 'MULTI_UPDATE';
  payload: {
    cellId?: string;
    value?: string | number;
    previousValue?: string | number;
    // Add other relevant action data
  };
}
