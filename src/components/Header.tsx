import { useRef, ReactNode } from 'react';
import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from 'react-icons/hi';
import Resizer from './Resizer';

type HeaderProps = {
  direction: string | null;
  children?: ReactNode;
  onClick: () => void;
  col: number;
};

const Header = ({ direction, children, onClick, col }: HeaderProps) => {
  const resizableRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={onClick}
      ref={resizableRef}
      className='sticky top-0 flex h-full items-center justify-center gap-2 border-b-2 border-gray-200 bg-gray-100 font-bold'
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
      <Resizer col={col} resizableRef={resizableRef} />
    </div>
  );
};

export default Header;
