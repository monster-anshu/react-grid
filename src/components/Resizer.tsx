import React, { FC, RefObject, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch } from '~/redux/hooks';
import { setHeight, setWidth } from '~/redux/width.slice';

type IResizerProps = {
  resizableRef: RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
  isAISelection?: boolean;
} & (
  | {
      col: number;
      row?: number;
    }
  | {
      row: number;
      col?: number;
    }
);

const Resizer: FC<IResizerProps> = ({
  resizableRef,
  col,
  row,
  isSelected,
  isAISelection,
}) => {
  const isResizing = useRef(false);
  const dispatch = useAppDispatch();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current || !resizableRef.current) return;
    const newWidth =
      event.clientX - resizableRef.current.getBoundingClientRect().left;
    const newHeight =
      event.clientY - resizableRef.current.getBoundingClientRect().top;
    if (typeof col === 'number') {
      dispatch(setWidth({ colIndex: col, width: newWidth }));
    }

    if (typeof row === 'number') {
      dispatch(setHeight({ rowIndex: row, height: newHeight }));
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (typeof row === 'number') {
    return (
      <div
        className={twMerge(
          'absolute bottom-0 left-0 h-[2px] w-full cursor-row-resize',
          isSelected ? 'bg-green-700' : 'bg-gray-200',
          isAISelection && isSelected && 'bg-blue-700',
        )}
        onMouseDown={handleMouseDown}
      ></div>
    );
  }

  return (
    <div
      className={twMerge(
        'absolute right-0 top-0 h-full w-[2px] cursor-col-resize',
        isSelected ? 'bg-green-700' : 'bg-gray-200',
        isAISelection && isSelected && 'bg-blue-700',
      )}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default Resizer;
