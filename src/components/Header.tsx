import React, { useState, useRef, ReactNode, useEffect } from "react";
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";

type HeaderProps = {
  direction: string | null;
  children?: ReactNode;
  onClick: () => void;
  col: number;
};

const Header = ({ direction, children, onClick, col }: HeaderProps) => {
  const [width, setWidth] = useState<number>(100);
  const resizableRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current || !resizableRef.current) return;
    const newWidth =
      event.clientX - resizableRef.current.getBoundingClientRect().left;

    setWidth(Math.max(newWidth, 10));
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const columns = document.querySelectorAll(`[data-grid-col="${col}"]`);
    console.log(columns);
    columns.forEach((column) => {
      (column as HTMLDivElement).style.width = width + "px";
    });
  }, [width]);

  return (
    <div
      onClick={onClick}
      ref={resizableRef}
      className="min-h-10 h-full bg-gray-100 flex items-center justify-center font-bold border-r border-b border-gray-200 relative"
      style={{
        width: `clamp(0px, ${width}px, 100%)`,
      }}
    >
      <div>{children}</div>
      {direction && (
        <div>
          {direction === "asc" ? (
            <HiOutlineSortAscending />
          ) : (
            <HiOutlineSortDescending />
          )}
        </div>
      )}
      <div
        className="w-1 h-full bg-gray-700 cursor-col-resize absolute top-0 right-0"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Header;
