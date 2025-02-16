import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { ACTIVATE_CELL, SELECT_CELL, SET_CONTENT } from '~/redux/grid.slice';
import Cell from '~/components/Cell';
import React, { useEffect, useRef, useState } from 'react';
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from 'react-icons/hi';
import Header from './Header';
import Row from './Row';

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

  const widths = useAppSelector((state) => state.layout.widths);
  const heights = useAppSelector((state) => state.layout.heights);

  const keyRef = useRef<KeyboardEvent>(null);

  const cellIdRowColRef = useRef<Record<string, `${number}_${number}`>>({});
  const cellIdRowColReverseRef = useRef<Record<string, string>>({});

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

  const handleInputChange = (id: string, value: string | number) => {
    dispatch(SET_CONTENT({ cellId: id, content: value }));
    onCellUpdate(id, value);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    cellId: string,
  ) => {
    const rowCol = cellIdRowColRef.current[cellId];
    if (!rowCol) return;

    const [row, col] = rowCol.split('_').map(Number);
    if (typeof row !== 'number' || typeof col !== 'number') return;

    e.key === 'Enter' && dispatch(ACTIVATE_CELL(null));

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
      const cellId = cellIdRowColReverseRef.current[nextId] ?? null;
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
  };

  const handleSingleSelect = (cellId: string) => {
    if (keyRef.current?.key === 'Control') {
      dispatch(SELECT_CELL({ cellId: cellId, removeSelection: false }));
      return;
    }
    dispatch(SELECT_CELL({ cellId: cellId, removeSelection: true }));
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

        const valA = cellA?.value ?? '';
        const valB = cellB?.value ?? '';

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

  console.log(cellIdRowColRef.current);

  useEffect(() => {
    const addKey = (e: KeyboardEvent) => {
      if (!keyRef.current || keyRef.current.key === e.key) {
        keyRef.current = e;
        return;
      }
    };

    const removeKey = (e: KeyboardEvent) => {
      keyRef.current = keyRef.current?.key == e.key ? null : keyRef.current;
    };

    document.addEventListener('keydown', addKey);
    document.addEventListener('keyup', removeKey);

    return () => {
      document.removeEventListener('keydown', addKey);
      document.removeEventListener('keyup', removeKey);
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
                  onChange={(value) => handleInputChange(cell.id, value)}
                  value={cell.value}
                  onKeyPress={(e) => handleKeyPress(e, cellId)}
                  col={col + 1}
                  row={row + 1}
                  onSelect={handleSingleSelect}
                />
              </React.Fragment>
            );
          }),
        )}
      </div>
    </div>
  );
}
