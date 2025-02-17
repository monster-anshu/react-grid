import React, { FC, useRef } from 'react';
import {
  ACTIVATE_CELL,
  REMOVE_SELECTION,
  SELECT_CELL,
} from '~/redux/grid.slice';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import Resizer from './Resizer';
import { twMerge } from 'tailwind-merge';

type CellProps = {
  id: string;
  value: string | number;
  isSelected: boolean;
  isActive: boolean;
  onChange: (value: string | number) => void;
  col: number;

  onKeyDown: React.ComponentProps<'input'>['onKeyDown'];
  onClick?: React.ComponentProps<'div'>['onClick'];
  onMouseEnter?: React.ComponentProps<'div'>['onMouseEnter'];
  onMouseDown?: React.ComponentProps<'div'>['onMouseDown'];
};

const Cell: FC<CellProps> = ({
  id,
  isActive,
  onChange,
  value,
  onKeyDown,
  col,
  isSelected,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const resizableRef = useRef<HTMLDivElement>(null);

  const handleCellClick = () => {
    dispatch(REMOVE_SELECTION({ cellId: null }));
    dispatch(ACTIVATE_CELL(id));
  };

  return (
    <div
      {...props}
      className={twMerge(
        'relative overflow-visible border-b-2 border-gray-200',
        isSelected ? '' : 'bg-gray-50',
      )}
      ref={resizableRef}
      onDoubleClick={handleCellClick}
    >
      <div
        className={twMerge(
          'absolute top-0 right-[2px] bottom-0 left-0 p-1 outline-green-700',
          isSelected ? 'z-20 outline-2' : '',
        )}
      >
        {isActive ? (
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            className='h-full w-full px-1 focus:outline-none'
            value={value}
            onChange={(e) =>
              onChange(
                typeof value === 'number' ? +e.target.value : e.target.value,
              )
            }
            autoFocus
            onBlur={() => dispatch(ACTIVATE_CELL(null))}
            onKeyDown={onKeyDown}
          />
        ) : (
          <div className='h-full w-full overflow-hidden'>{value}</div>
        )}
      </div>
      <Resizer col={col} resizableRef={resizableRef} isSelected={isSelected} />
    </div>
  );
};

export default Cell;
