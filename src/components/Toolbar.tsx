import { FC, useEffect } from 'react';
import { REDO, UNDO } from '~/redux/grid.slice';
import { useAppDispatch } from '~/redux/hooks';

const Toolbar: FC = () => {
  const dispatch = useAppDispatch();

  const handlerKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'z' && e.ctrlKey && e.shiftKey) {
      dispatch(REDO());
    }
    if (e.key.toLowerCase() === 'z' && e.ctrlKey && !e.shiftKey) {
      dispatch(UNDO());
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handlerKey);

    return () => {
      document.removeEventListener('keydown', handlerKey);
    };
  }, []);

  return null;
};

export default Toolbar;
