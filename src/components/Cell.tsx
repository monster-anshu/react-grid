import React, { FC, useRef } from 'react';
import Resizer from './Resizer';
import { twMerge } from 'tailwind-merge';

type CellProps = {
  id: string;
  value: string | number;
  isSelected: boolean;
  isActive: boolean;
  onChange?: (value: string | number) => void;
  col: number;

  onMouseEnter?: React.ComponentProps<'div'>['onMouseEnter'];
  onMouseDown?: React.ComponentProps<'div'>['onMouseDown'];
  onMouseUp?: React.ComponentProps<'div'>['onMouseUp'];
};

const Cell: FC<CellProps> = ({
  id,
  isActive,
  onChange,
  value,
  col,
  isSelected,
  ...props
}) => {
  const resizableRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      className={twMerge(
        'relative overflow-visible border-b-2 border-gray-200',
        isSelected ? '' : 'bg-gray-50',
      )}
      ref={resizableRef}
      data-cell-id={id}
    >
      <div
        className={twMerge(
          'absolute bottom-0 left-0 right-[2px] top-0 p-1 outline-green-700',
          isSelected ? 'z-20 outline outline-2' : '',
        )}
        data-cell-id={id}
      >
        {isActive ? (
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            className='h-full w-full px-1 focus:outline-none'
            value={value}
            data-cell-id={id}
            autoFocus
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <div className='h-full w-full overflow-hidden' data-cell-id={id}>
            {value}
          </div>
        )}
      </div>
      <Resizer col={col} resizableRef={resizableRef} isSelected={isSelected} />
    </div>
  );
};

export default Cell;
