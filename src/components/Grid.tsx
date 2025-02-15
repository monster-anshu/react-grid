import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { ACTIVATE_CELL, SET_CONTENT } from "~/redux/grid.slice";
import Cell from "~/components/Cell";
import React, { useEffect, useState } from "react";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";

interface GridProps {
  rows: number; // Number of rows
  columns: number; // Number of columns
  onCellUpdate: (cellId: string, value: string | number) => void;
  onSort: (columnId: string, direction: "asc" | "desc") => void;
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
  const dispatch = useAppDispatch();
  const [sort, setSort] = useState<null | {
    columnId: number;
    direction: "asc" | "desc";
  }>(null);

  const handleInputChange = (id: string, value: string | number) => {
    dispatch(SET_CONTENT({ cellId: id, content: value }));
    onCellUpdate(id, value);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    e.key === "Enter" && dispatch(ACTIVATE_CELL(null));

    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const nextCol = (col + 1) % MAX_COL;
      const nextRow = (nextCol === 0 ? row + 1 : row) % MAX_ROW;
      const id = `${nextRow}_${nextCol}`;
      dispatch(ACTIVATE_CELL(id));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextRow = (row === 0 ? MAX_ROW - 1 : row - 1) % MAX_ROW;
      const id = `${nextRow}_${col}`;
      dispatch(ACTIVATE_CELL(id));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = (row + 1) % MAX_ROW;
      const id = `${nextRow}_${col}`;
      dispatch(ACTIVATE_CELL(id));
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextCol = (col === 0 ? MAX_COL - 1 : col - 1) % MAX_COL;
      const id = `${row}_${nextCol}`;
      dispatch(ACTIVATE_CELL(id));
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextCol = (col + 1) % MAX_COL;
      const id = `${row}_${nextCol}`;
      dispatch(ACTIVATE_CELL(id));
      return;
    }
  };

  const columns = [
    "",
    ...Array.from({ length: MAX_COL }, (_, i) => String.fromCharCode(65 + i)),
  ];

  const rows = Array.from({ length: MAX_ROW }, (_, row) => ({
    index: row,
    values: Array.from({ length: MAX_COL }, (_, col) => {
      const id = `${row}_${col}`;
      const cell = cells[id] || {
        id: id,
        type: "text",
        value: "",
      };
      return cell;
    }),
  }));

  if (sort) {
    rows.sort((a, b) => {
      const valA = (a.values[sort.columnId]?.value || "").toString();
      const valB = (b.values[sort.columnId]?.value || "").toString();

      // Handle empty values
      if (valA === "" && valB !== "") return 1; // Push empty A to end
      if (valB === "" && valA !== "") return -1; // Push empty B to end
      if (valA === "" && valB === "") return 0; // Both empty = equal

      // Handle non-empty values based on sort direction
      if (valA < valB) return sort.direction === "asc" ? -1 : 1;
      if (valA > valB) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  useEffect(() => {
    if (activeCell) {
      setSort(null);
    }
  }, [activeCell]);

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-11 grid-rows-11 h-full w-full border border-gray-200">
        {columns.map((col, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="min-h-10 bg-gray-100 gap-2 flex items-center justify-center font-bold border-r border-b border-gray-200"
            onClick={() => {
              const columnId = colIndex - 1;
              setSort((curr) => {
                if (!curr || curr.columnId !== columnId)
                  return { columnId: columnId, direction: "asc" };
                return {
                  columnId: columnId,
                  direction: curr.direction === "asc" ? "desc" : "asc",
                };
              });
            }}
          >
            <p>{col}</p>
            {sort?.columnId === colIndex - 1 && (
              <p className="mt-1">
                {sort.direction === "asc" ? (
                  <HiOutlineSortAscending />
                ) : (
                  <HiOutlineSortDescending />
                )}
              </p>
            )}
          </div>
        ))}
        {Array.from({ length: MAX_ROW }).map((_, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            <div className="min-h-10 h-full bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200">
              {rowIndex + 1}
            </div>
            {rowIndex == 0 && (
              <div className="grid col-span-10 grid-cols-10 grid-rows-10 row-span-10">
                {rows.map((values, row) =>
                  values.values.map((cell, col) => (
                    <Cell
                      id={cell.id}
                      isActive={activeCell === cell.id}
                      isSelected={selectedCells.includes(cell.id)}
                      onChange={(value) => handleInputChange(cell.id, value)}
                      key={cell.id}
                      value={cell.value}
                      onKeyPress={(e) => handleKeyPress(e, row, col)}
                    />
                  ))
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
