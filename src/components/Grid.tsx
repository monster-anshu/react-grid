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

  const [rows, setrows] = useState(() => {
    return Array.from({ length: MAX_ROW }, (_, row) => ({
      index: row,
      values: Array.from({ length: MAX_COL }, (_, col) => {
        const id = `${row}_${col}`;
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

  const handleSort = (columnId: number) => {
    let curr = sort;

    if (!curr || curr.columnId !== columnId)
      curr = { columnId: columnId, direction: "asc" };
    else
      curr = {
        columnId: columnId,
        direction: curr.direction === "asc" ? "desc" : "asc",
      };

    setSort(curr);

    setrows(([...rows]) => {
      rows.sort((a, b) => {
        const cellA = cells[a.values[curr.columnId] || ""];
        const cellB = cells[b.values[curr.columnId] || ""];

        const valA = cellA?.value || "";
        const valB = cellB?.value || "";

        // Handle empty values
        if (valA === "" && valB !== "") return 1; // Push empty A to end
        if (valB === "" && valA !== "") return -1; // Push empty B to end
        if (valA === "" && valB === "") return 0; // Both empty = equal

        // Handle non-empty values based on sort direction
        if (valA < valB) return curr.direction === "asc" ? -1 : 1;
        if (valA > valB) return curr.direction === "asc" ? 1 : -1;
        return 0;
      });
      return rows;
    });
  };

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-11 grid-rows-11 min-h-full min-w-full border border-gray-200">
        {columns.map((col, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="min-h-10 bg-gray-100 gap-2 flex items-center justify-center font-bold border-r border-b border-gray-200"
            onClick={() => handleSort(colIndex - 1)}
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
        {rows.map((values, row) =>
          values.values.map((cellId, col) => {
            const cell = cells[cellId] || {
              id: cellId,
              type: "text",
              value: "",
            };
            return (
              <React.Fragment key={cell.id}>
                {col === 0 && (
                  <div className="min-h-10 h-full bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200">
                    {row + 1}
                  </div>
                )}
                <Cell
                  id={cell.id}
                  isActive={activeCell === cell.id}
                  isSelected={selectedCells.includes(cell.id)}
                  onChange={(value) => handleInputChange(cell.id, value)}
                  value={cell.value}
                  onKeyPress={(e) => handleKeyPress(e, row, col)}
                />
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
