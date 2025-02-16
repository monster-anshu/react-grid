import React, { FC, ReactNode, useRef } from "react";
import { useAppDispatch } from "~/redux/hooks";
import { setHeight } from "~/redux/width.slice";

type RowProps = {
  children?: ReactNode;
  row: number;
};

const Row: FC<RowProps> = ({ row, children }) => {
  const resizableRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const dispatch = useAppDispatch();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current || !resizableRef.current) return;
    const newHeight =
      event.clientY - resizableRef.current.getBoundingClientRect().top;
    dispatch(setHeight({ rowIndex: row + 1, height: newHeight }));
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative h-full bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200">
      {children}
      <div
        ref={resizableRef}
        className="w-full h-0.5 bg-gray-700 cursor-row-resize absolute left-0 bottom-0"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Row;
