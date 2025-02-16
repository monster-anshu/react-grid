import React, { useState, useRef, ReactNode, useEffect } from 'react';
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from 'react-icons/hi';
import { useAppDispatch } from '~/redux/hooks';
import { setWidth } from '~/redux/width.slice';

type HeaderProps = {
  direction: string | null;
  children?: ReactNode;
  onClick: () => void;
  col: number;
};

const Header = ({ direction, children, onClick, col }: HeaderProps) => {
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
    const newWidth =
      event.clientX - resizableRef.current.getBoundingClientRect().left;

    dispatch(setWidth({ colIndex: col, width: newWidth }));
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onClick={onClick}
      ref={resizableRef}
      className='sticky top-0 flex h-full items-center justify-center gap-2 border-r border-b border-gray-200 bg-gray-100 font-bold'
    >
      <div>{children}</div>
      {direction && (
        <div className='mt-1'>
          {direction === 'asc' ? (
            <HiOutlineSortAscending />
          ) : (
            <HiOutlineSortDescending />
          )}
        </div>
      )}
      <div
        className='absolute top-0 right-0 h-full w-0.5 cursor-col-resize bg-gray-700'
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Header;
