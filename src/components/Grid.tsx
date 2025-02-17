import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  ACTIVATE_CELL,
  REMOVE_SELECTION,
  SELECT_CELL,
  SET_CONTENT,
} from '~/redux/grid.slice';
import Cell from '~/components/Cell';
import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Row from './Row';
import Clipboard from './Clipboard';

interface GridProps {
  rows: number; // Number of rows
  columns: number; // Number of columns
  onCellUpdate: (cellId: string, value: string | number) => void;
  onSort: (columnId: string, direction: 'asc' | 'desc') => void;
}

export default function Grid({
  columns: MAX_COL,
  rows: MAX_ROW,
  onCellUpdate,
  onSort,
}: GridProps) {
  const cells = useAppSelector((state) => state.grid.cells);
  const activeCell = useAppSelector((state) => state.grid.activeCell);
  const selectedCells = useAppSelector((state) => state.grid.selectedCells);

  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  const widths = useAppSelector((state) => state.layout.widths);
  const heights = useAppSelector((state) => state.layout.heights);

  const keyRef = useRef(new Set<string>());

  const startCellIdRef = useRef('');
  const isDraggingRef = useRef(false);

  const cellIdRowColRef = useRef<Record<string, string>>({});
  const cellIdRowColReverseRef = useRef<Record<string, string>>({});

  const getRowCol = (cellId: string) => {
    const [row, col] =
      cellIdRowColRef.current[cellId]?.split('_').map(Number) || [];
    if (typeof row === 'number' && typeof col === 'number') {
      return [row, col] as const;
    }
    return [0, 0] as const;
  };

  const getCellId = (rowCol: string) => {
    return cellIdRowColReverseRef.current[rowCol] || null;
  };

  const dispatch = useAppDispatch();
  const [sort, setSort] = useState({
    columnId: 0,
    direction: 'asc',
  });

  const [rows, setrows] = useState(() => {
    return Array.from({ length: MAX_ROW }, (_, row) => ({
      index: row,
      values: Array.from({ length: MAX_COL }, (_, col) => {
        const id = `__${row}_${col}__`;
        return id;
      }),
    }));
  });

  const handleKeyPress = (e: React.KeyboardEvent, cellId: string) => {
    const [row, col] = getRowCol(cellId);

    let nextId;

    switch (e.key) {
      case 'Enter':
        dispatch(ACTIVATE_CELL(null));
        break;

      case 'Tab':
        if (!e.shiftKey) {
          e.preventDefault();
          const nextCol = (col + 1) % MAX_COL;
          const nextRow = (nextCol === 0 ? row + 1 : row) % MAX_ROW;
          nextId = `${nextRow}_${nextCol}`;
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        const upRow = (row === 0 ? MAX_ROW - 1 : row - 1) % MAX_ROW;
        nextId = `${upRow}_${col}`;
        break;

      case 'ArrowDown':
        e.preventDefault();
        const downRow = (row + 1) % MAX_ROW;
        nextId = `${downRow}_${col}`;
        break;

      case 'ArrowLeft':
        e.preventDefault();
        const leftCol = (col === 0 ? MAX_COL - 1 : col - 1) % MAX_COL;
        nextId = `${row}_${leftCol}`;
        break;

      case 'ArrowRight':
        e.preventDefault();
        const rightCol = (col + 1) % MAX_COL;
        nextId = `${row}_${rightCol}`;
        break;
    }

    if (nextId) {
      const cellId = getCellId(nextId);
      cellId &&
        dispatch(SELECT_CELL({ cellId: cellId, removeSelection: true }));
      dispatch(ACTIVATE_CELL(cellId));
    }
  };

  const columns = [
    '',
    ...Array.from({ length: MAX_COL }, (_, i) => String.fromCharCode(65 + i)),
  ];

  const handleSort = (columnId: number) => {
    let curr = sort;

    if (!curr || curr.columnId !== columnId)
      curr = { columnId: columnId, direction: 'asc' };
    else
      curr = {
        columnId: columnId,
        direction: curr.direction === 'asc' ? 'desc' : 'asc',
      };

    setSort(curr);
    onSort(curr.columnId + '', curr.direction as 'asc' | 'desc');
  };

  const handleMouseDown = (e: React.MouseEvent, cellId: string) => {
    e.preventDefault();
    if (keyRef.current.has('Control')) {
      return;
    }
    startCellIdRef.current = cellId;
    isDraggingRef.current = true;
    dispatch(SELECT_CELL({ cellId: [cellId], removeSelection: true }));
  };

  const handleMouseEnter = (cellId: string) => {
    if (!isDraggingRef.current) return;
    handleSelectRange(startCellIdRef.current, cellId);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || selectedCells.length < 2) {
      return;
    }
    console.log(selectedCells);
  };

  const handleSelectRange = (startCellIdRef: string, endCellId: string) => {
    const [startRow, startCol] = getRowCol(startCellIdRef);
    const [endRow, endCol] = getRowCol(endCellId);

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const idToSelect = [] as string[];

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const nextId = getCellId(`${row}_${col}`) ?? '';
        idToSelect.push(nextId);
      }
    }

    dispatch(SELECT_CELL({ cellId: idToSelect, removeSelection: false }));
  };

  const handleSingleSelect = (e: React.MouseEvent, cellId: string) => {
    dispatch(ACTIVATE_CELL(null));
    if (keyRef.current.has('Control') && keyRef.current.has('Shift')) {
      const lastSelectedCellId = selectedCells.at(-1);
      if (!lastSelectedCellId) return;
      handleSelectRange(lastSelectedCellId, cellId);
      return;
    }

    if (keyRef.current.has('Control')) {
      dispatch(SELECT_CELL({ cellId: cellId, removeSelection: false }));
      return;
    }
    dispatch(SELECT_CELL({ cellId: cellId, removeSelection: true }));
  };

  const handleChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const cellId = target.getAttribute?.('data-cell-id');
    if (!cellId) return;
    const value = target.value;
    dispatch(SET_CONTENT({ cellId: cellId, content: value }));
    onCellUpdate(cellId, value);
  };

  const handleBlur = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const cellId = target.getAttribute?.('data-cell-id');
    if (!cellId) return;
    dispatch(ACTIVATE_CELL(null));
    dispatch(REMOVE_SELECTION({ cellId }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const cellId = target.getAttribute?.('data-cell-id');
    if (!cellId) return;
    handleKeyPress(e, cellId);
  };

  const handleSingleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const cellId = target.getAttribute?.('data-cell-id');
    if (!cellId) return;
    handleSingleSelect(e, cellId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const cellId = target.getAttribute?.('data-cell-id');
    if (!cellId) return;
    dispatch(SELECT_CELL({ cellId: cellId, removeSelection: true }));
    dispatch(ACTIVATE_CELL(cellId));
  };

  useEffect(() => {
    setrows(([...rows]) => {
      rows.sort((a, b) => {
        if (sort.columnId === 0) {
          if (a.index < b.index) return sort.direction === 'asc' ? -1 : 1;
          if (a.index > b.index) return sort.direction === 'asc' ? 1 : -1;
          return 0;
        }

        const cellA = cells[a.values[sort.columnId - 1] || ''];
        const cellB = cells[b.values[sort.columnId - 1] || ''];

        let valA = cellA?.value ?? '';
        let valB = cellB?.value ?? '';

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
        }

        if (typeof valB === 'string') {
          valB = valB.toLowerCase();
        }

        // Handle empty values
        if (valA === '' && valB !== '') return 1; // Push empty A to end
        if (valB === '' && valA !== '') return -1; // Push empty B to end
        if (valA === '' && valB === '') return 0; // Both empty = equal

        // Handle non-empty values based on sort direction
        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
      return rows;
    });
  }, [sort]);

  useEffect(() => {
    const addKey = (e: KeyboardEvent) => {
      keyRef.current.add(e.key);
    };

    const removeKey = (e: KeyboardEvent) => {
      keyRef.current.delete(e.key);
    };

    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
      startCellIdRef.current = '';
    };

    document.addEventListener('keydown', addKey);
    document.addEventListener('keyup', removeKey);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('keydown', addKey);
      document.removeEventListener('keyup', removeKey);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className=''>
      <div
        className='relative grid border border-gray-200'
        style={{
          gridTemplateColumns: Array.from({ length: MAX_COL + 1 })
            .map((_, index) => {
              const width = widths[index];
              if (typeof width !== 'number') {
                return 'minmax(100px, 1fr)';
              }
              return Math.max(width, 50) + 'px';
            })
            .join(' '),
          gridTemplateRows: Array.from({ length: MAX_ROW + 1 })
            .map((_, index) => {
              const height = heights[index] ?? 36;
              return Math.max(height, 36) + 'px';
            })
            .join(' '),
        }}
        onChange={handleChange}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleSingleClick}
      >
        {columns.map((col, colIndex) => (
          <Header
            onClick={() => handleSort(colIndex)}
            direction={sort.columnId === colIndex ? sort.direction : null}
            col={colIndex}
            key={colIndex}
          >
            {col}
          </Header>
        ))}
        <Clipboard getRowCol={getRowCol} getCellId={getCellId} />
        {rows.map((cols, row) =>
          cols.values.map((cellId, col) => {
            const cell = cells[cellId] || {
              id: cellId,
              type: 'text',
              value: '',
            };
            const idForMap = `${row}_${col}` as const;
            cellIdRowColRef.current[cellId] = idForMap;
            cellIdRowColReverseRef.current[idForMap] = cellId;
            return (
              <React.Fragment key={cell.id}>
                {col === 0 && <Row row={row}>{cols.index + 1}</Row>}
                <Cell
                  id={cell.id}
                  isActive={activeCell === cell.id}
                  isSelected={selectedCells.includes(cell.id)}
                  value={cell.value}
                  col={col + 1}
                  onMouseDown={(e) => handleMouseDown(e, cellId)}
                  onMouseEnter={() => handleMouseEnter(cellId)}
                  onMouseUp={() => handleMouseUp()}
                />
              </React.Fragment>
            );
          }),
        )}
      </div>
    </div>
  );
}
