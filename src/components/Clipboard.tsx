import { FC, useEffect } from 'react';
import { useGrid } from '~/hooks/grid';

type IClipboardProps = {
  getRowCol: (cellId: string) => readonly [number, number];
  getCellId: (rowCol: string) => string | null;
};

const Clipboard: FC<IClipboardProps> = (props) => {
  const { convertToArray, populateFromArray, selectedCellsRef, activeCellRef } =
    useGrid(props);

  const handleCopy = (event: ClipboardEvent) => {
    if (!selectedCellsRef.current.length) return;

    event.preventDefault();

    const gridData = convertToArray();

    const clipboardText = gridData.map((row) => row.join('\t')).join('\n');
    event.clipboardData?.setData('text/plain', clipboardText);
  };

  const handlePaste = (event: ClipboardEvent) => {
    const lastSelected = selectedCellsRef.current.at(-1);
    if (!lastSelected || activeCellRef.current) return;
    event.preventDefault();
    const clipboardText = event.clipboardData?.getData('text/plain');
    if (!clipboardText) return;
    const dataRows = clipboardText.split('\n').map((row) => row.split('\t'));
    populateFromArray(dataRows);
  };

  useEffect(() => {
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return null;
};

export default Clipboard;
