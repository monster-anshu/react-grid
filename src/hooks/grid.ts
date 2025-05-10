import { useRef } from 'react';
import { SELECT_CELL, SET_CONTENT, UpdateContent } from '~/redux/grid.slice';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { NUMBER_ONLY } from '~/utils/regex';

export type UseGridOptions = {
  getRowCol: (cellId: string) => readonly [number, number];
  getCellId: (rowCol: string) => string | null;
};

export const useGrid = ({ getCellId, getRowCol }: UseGridOptions) => {
  const cells = useAppSelector((state) => state.grid.cells);
  const selectedCells = useAppSelector((state) => state.grid.selectedCells);

  const dispatch = useAppDispatch();

  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;
  const activeCellRef = useRef(
    selectedCells.length === 1 ? selectedCells[0] : null,
  );
  activeCellRef.current = selectedCells.length === 1 ? selectedCells[0] : null;

  const populateFromArray = (
    dataRows: (string | number)[][],
    cellId: string,
  ) => {
    const [startRow, startCol] = getRowCol(cellId);

    const updatedCells: UpdateContent[] = [];
    const cellIds: string[] = [];

    dataRows.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const targetCellId = getCellId(
          `${startRow + rowIndex}_${startCol + colIndex}`,
        );
        if (targetCellId) {
          cellIds.push(targetCellId);
          updatedCells.push({
            cellId: targetCellId,
            content: NUMBER_ONLY.test(value + '') ? +value : value,
          });
        }
      });
    });

    dispatch(SET_CONTENT(updatedCells));
    dispatch(SELECT_CELL({ cellId: cellIds, removeSelection: true }));
  };

  const convertToArray = () => {
    const gridData: string[][] = [];
    let minRow = Infinity,
      minCol = Infinity,
      maxRow = -Infinity,
      maxCol = -Infinity;

    selectedCellsRef.current.forEach((cellId) => {
      const [row, col] = getRowCol(cellId);
      minRow = Math.min(minRow, row);
      minCol = Math.min(minCol, col);
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, col);
    });

    for (let i = minRow; i <= maxRow; i++) {
      gridData[i - minRow] = new Array(maxCol - minCol + 1).fill('');
    }

    selectedCellsRef.current.forEach((cellId) => {
      const [row, col] = getRowCol(cellId);
      const value = cellsRef.current[cellId]?.value ?? '';
      gridData[row - minRow]![col - minCol] = value + '';
    });

    return gridData;
  };

  return { convertToArray, populateFromArray, selectedCellsRef, activeCellRef };
};
