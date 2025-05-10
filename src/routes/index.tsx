import { createFileRoute } from '@tanstack/react-router';
import React, { FC } from 'react';
import Grid from '~/components/Grid';

type IGridPageProps = {};

const GridPage: FC<IGridPageProps> = () => {
  return (
    <Grid columns={10} rows={50} onCellUpdate={() => {}} onSort={() => {}} />
  );
};

export default GridPage;

export const Route = createFileRoute('/')({
  component: GridPage,
});
