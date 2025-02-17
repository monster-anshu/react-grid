import React, { FC, useEffect, useRef } from 'react';
import { SET_CONTENT, UpdateContent } from '~/redux/grid.slice';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

type IClipboardProps = {
  getRowCol: (cellId: string) => readonly [number, number];
  getCellId: (rowCol: string) => string | null;
};

const Clipboard: FC<IClipboardProps> = ({ getRowCol, getCellId }) => {
  const cells = useAppSelector((state) => state.grid.cells);
  const selectedCells = useAppSelector((state) => state.grid.selectedCells);
  const dispatch = useAppDispatch();

  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  const handleCopy = (event: ClipboardEvent) => {
    if (!selectedCellsRef.current.length) return;

    event.preventDefault();

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

    const clipboardText = gridData.map((row) => row.join('\t')).join('\n');
    event.clipboardData?.setData('text/plain', clipboardText);
  };

  const handlePaste = (event: ClipboardEvent) => {
    const lastSelected = selectedCellsRef.current.at(-1);
    if (!lastSelected) return;

    event.preventDefault();
    const clipboardText = event.clipboardData?.getData('text/plain');
    if (!clipboardText) return;

    const dataRows = clipboardText.split('\n').map((row) => row.split('\t'));
    const [startRow, startCol] = getRowCol(lastSelected);

    const updatedCells: UpdateContent[] = [];

    dataRows.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const targetCellId = getCellId(
          `${startRow + rowIndex}_${startCol + colIndex}`,
        );
        if (targetCellId) {
          updatedCells.push({ cellId: targetCellId, content: value });
        }
      });
    });

    dispatch(SET_CONTENT(updatedCells));
  };

  useEffect(() => {
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return null;
};

export default Clipboard;
