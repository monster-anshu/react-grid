import React, { FC, forwardRef, Ref, RefObject, useRef } from 'react';
import { useAppDispatch } from '~/redux/hooks';
import { setHeight, setWidth } from '~/redux/width.slice';

type IResizerProps = {
  resizableRef: RefObject<HTMLDivElement | null>;
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

const Resizer: FC<IResizerProps> = ({ resizableRef, col, row }) => {
  const isResizing = useRef(false);
  const dispatch = useAppDispatch();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
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

  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (typeof row === 'number') {
    return (
      <div
        className='absolute bottom-0 left-0 h-[2px] w-full cursor-row-resize bg-gray-200'
        onMouseDown={handleMouseDown}
      ></div>
    );
  }

  return (
    <div
      className='absolute top-0 right-0 h-full w-[2px] cursor-col-resize bg-gray-200'
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default Resizer;
