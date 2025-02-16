import React, { FC, useRef } from 'react';
import { ACTIVATE_CELL } from '~/redux/grid.slice';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import Resizer from './Resizer';

type CellProps = {
  id: string;
  value: string | number;
  isSelected: boolean;
  isActive: boolean;
  onChange: (value: string | number) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  col: number;
  row: number;
};

const Cell: FC<CellProps> = ({
  id,
  isActive,
  onChange,
  value,
  onKeyPress,
  col,
  row,
}) => {
  const dispatch = useAppDispatch();
  const resizableRef = useRef<HTMLDivElement>(null);

  const handleCellClick = () => {
    dispatch(ACTIVATE_CELL(id));
  };

  return (
    <div
      className={`relative border-b-2 border-gray-200 p-1 ${
        isActive ? 'bg-blue-100' : 'hover:bg-gray-50'
      }`}
      ref={resizableRef}
      onClick={handleCellClick}
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
          onKeyDown={onKeyPress}
        />
      ) : (
        <div className='h-full w-full overflow-hidden'>{value}</div>
      )}
      <Resizer col={col} resizableRef={resizableRef} />
    </div>
  );
};

export default Cell;
