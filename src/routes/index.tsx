import { createFileRoute } from "@tanstack/react-router";
import { useAppSelector } from "~/redux/hooks";
import { MAX_COL, MAX_ROW } from "~/redux/grid.slice";
import Cell from "~/components/Cell";
import React from "react";

export const Route = createFileRoute("/")({
  component: ExcelGrid,
});

const columns = [
  "",
  ...Array.from({ length: MAX_COL }, (_, i) => String.fromCharCode(65 + i)),
];

function ExcelGrid() {
  const cells = useAppSelector((state) => state.grid.cells);
  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-11 h-full w-full border border-gray-200">
        {columns.map((col, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="min-h-10 bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200"
          >
            {col}
          </div>
        ))}

        {Array.from({ length: MAX_ROW }).map((_, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            <div className="min-h-10 bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200">
              {rowIndex + 1}
            </div>
            {Array.from({ length: MAX_COL }).map((_, colIndex) => {
              const id = `${rowIndex}_${colIndex}`;
              const cell = cells[id];
              return (
                <Cell
                  cell={
                    cell || {
                      id: id,
                      type: "text",
                      value: "",
                    }
                  }
                  key={id}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
