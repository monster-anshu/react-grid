import React, { FC } from "react";
import { ACTIVATE_CELL } from "~/redux/grid.slice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

type CellProps = {
  id: string;
  value: string | number;
  isSelected: boolean;
  isActive: boolean;
  onChange: (value: string | number) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Cell: FC<CellProps> = ({ id, isActive, onChange, value, onKeyPress }) => {
  const dispatch = useAppDispatch();

  const handleCellClick = () => {
    dispatch(ACTIVATE_CELL(id));
  };

  return (
    <div
      className={`min-h-10 border-r border-b border-gray-200 p-1 ${
        isActive ? "bg-blue-100" : "hover:bg-gray-50"
      }`}
      onClick={handleCellClick}
    >
      {isActive ? (
        <input
          type={typeof value === "number" ? "number" : "text"}
          className="w-full h-full px-1"
          value={value}
          onChange={(e) =>
            onChange(
              typeof value === "number" ? +e.target.value : e.target.value
            )
          }
          autoFocus
          onBlur={() => dispatch(ACTIVATE_CELL(null))}
          onKeyDown={onKeyPress}
        />
      ) : (
        <div className="w-full h-full overflow-hidden">{value}</div>
      )}
    </div>
  );
};

export default Cell;
