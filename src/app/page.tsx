'use client';
import { Provider } from 'react-redux';
import Grid from '~/components/Grid';
import { store } from '~/redux/store';

export default function Home() {
  return (
    <Provider store={store}>
      <Grid columns={10} rows={20} onCellUpdate={() => {}} onSort={() => {}} />
    </Provider>
  );
}
