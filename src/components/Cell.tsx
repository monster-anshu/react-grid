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
        'relative border-b-2 border-gray-200 p-1',
        isSelected ? 'bg-blue-400' : 'bg-gray-50',
      )}
      ref={resizableRef}
      onDoubleClick={handleCellClick}
    >
      {isActive ? (
        <input
          type={typeof value === 'number' ? 'number' : 'text'}
          className='h-full w-full px-1'
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
      <Resizer col={col} resizableRef={resizableRef} />
    </div>
  );
};

export default Cell;
