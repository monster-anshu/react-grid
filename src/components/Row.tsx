import { FC, ReactNode, useRef } from 'react';
import Resizer from './Resizer';

type RowProps = {
  children?: ReactNode;
  row: number;
};

const Row: FC<RowProps> = ({ row, children }) => {
  const resizableRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={resizableRef}
      className='relative flex h-full items-center justify-center border-r-2 border-gray-200 bg-gray-100 font-bold'
    >
      {children}
      <Resizer resizableRef={resizableRef} row={row + 1} />
    </div>
  );
};

export default Row;
