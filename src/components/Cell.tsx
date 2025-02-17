import React, { FC, FormEvent, useEffect, useRef } from 'react';
import Resizer from './Resizer';
import { twJoin, twMerge } from 'tailwind-merge';
import { PiMagicWandThin } from 'react-icons/pi';
import { NUMBER_ONLY } from '~/utils/regex';
import { MdNumbers } from 'react-icons/md';
import { GoDot } from 'react-icons/go';

type CellProps = {
  id: string;
  value: string | number;
  type: 'text' | 'number';
  isSelected: boolean;
  isActive: boolean;
  onChange?: (value: string | number) => void;
  col: number;
  row: number;
  isAISelection: boolean;
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
  row,
  isAISelection,
  type,
  ...props
}) => {
  const resizableRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = onChange
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === '') {
          onChange('');
          return;
        }

        if (type === 'number' && !NUMBER_ONLY.test(value)) {
          return;
        }

        onChange(type === 'number' ? +value : value);
      }
    : () => null;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isActive) {
      element.focus();
    }

    return () => {};
  }, [isActive]);

  return (
    <div
      {...props}
      className={twMerge(
        'group relative overflow-visible border-b-2 border-gray-200',
        isSelected ? '' : 'bg-gray-50',
      )}
      ref={resizableRef}
      data-cell-id={id}
    >
      <div
        className={[
          'absolute bottom-0 left-0 right-[2px] top-0 p-1',
          isSelected ? 'outline outline-2' : '',
          row === 1 && 'mt-[2px]',
          isAISelection ? 'outline-blue-700' : 'outline-green-700',
        ].join(' ')}
        data-cell-id={id}
      >
        <input
          type='text'
          className={twJoin(
            'h-full w-full px-1 focus:outline-none',
            type === 'number' ? 'text-right' : 'text-left',
          )}
          value={value}
          data-cell-id={id}
          onChange={handleChange}
          ref={ref}
        />
      </div>
      <Resizer
        col={col}
        resizableRef={resizableRef}
        isSelected={isSelected}
        isAISelection={isAISelection}
      />
      {value && (
        <div
          className='absolute bottom-0 right-0 hidden cursor-move resize pb-[1px] pr-[2px] group-hover:block'
          data-ai-selection
        >
          <PiMagicWandThin size={12} data-ai-selection />
        </div>
      )}
    </div>
  );
};

export default Cell;
