import React, { FC } from "react";
import { MAX_COL, MAX_ROW, SELECT_CELL, SET_CONTENT } from "~/redux/grid.slice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

type ICellProps = {
  cell: Cell;
};

const Cell: FC<ICellProps> = ({ cell }) => {
  const [rowStr = "", colStr = ""] = cell.id.split("_");
  const row = +rowStr,
    col = +colStr;

  const dispatch = useAppDispatch();
  const isSelected =
    useAppSelector((state) => state.grid.activeCell) === cell.id;

  const handleCellClick = () => {
    dispatch(SELECT_CELL(cell.id));
  };

  const handleInputChange = (value: string) => {
    dispatch(SET_CONTENT({ cellId: cell.id, content: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && dispatch(SELECT_CELL(null));

    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const nextCol = (col + 1) % MAX_COL;
      const nextRow = (nextCol === 0 ? row + 1 : row) % MAX_ROW;
      const id = `${nextRow}_${nextCol}`;
      dispatch(SELECT_CELL(id));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextRow = (row === 0 ? MAX_ROW - 1 : row - 1) % MAX_ROW;
      const id = `${nextRow}_${col}`;
      dispatch(SELECT_CELL(id));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = (row + 1) % MAX_ROW;
      const id = `${nextRow}_${col}`;
      dispatch(SELECT_CELL(id));
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextCol = (col === 0 ? MAX_COL - 1 : col - 1) % MAX_COL;
      const id = `${row}_${nextCol}`;
      dispatch(SELECT_CELL(id));
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextCol = (col + 1) % MAX_COL;
      const id = `${row}_${nextCol}`;
      dispatch(SELECT_CELL(id));
      return;
    }
  };

  return (
    <div
      className={`min-h-10 border-r border-b border-gray-200 p-1 ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-50"
      }`}
      onClick={handleCellClick}
    >
      {isSelected ? (
        <input
          type="text"
          className="w-full h-full px-1"
          value={cell.value}
          onChange={(e) => handleInputChange(e.target.value)}
          autoFocus
          onBlur={() => dispatch(SELECT_CELL(null))}
          onKeyDown={handleKeyPress}
        />
      ) : (
        <div className="w-full h-full overflow-hidden">{cell.value}</div>
      )}
    </div>
  );
};

export default Cell;
