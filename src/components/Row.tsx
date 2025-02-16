import React, { FC, ReactNode, useRef } from 'react';
import { useAppDispatch } from '~/redux/hooks';
import { setHeight } from '~/redux/width.slice';

type RowProps = {
  children?: ReactNode;
  row: number;
};

const Row: FC<RowProps> = ({ row, children }) => {
  const resizableRef = useRef<HTMLDivElement>(null);
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
    const newHeight =
      event.clientY - resizableRef.current.getBoundingClientRect().top;
    dispatch(setHeight({ rowIndex: row + 1, height: newHeight }));
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='relative flex h-full items-center justify-center border-r border-b border-gray-200 bg-gray-100 font-bold'>
      {children}
      <div
        ref={resizableRef}
        className='absolute bottom-0 left-0 h-0.5 w-full cursor-row-resize bg-gray-700'
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Row;
