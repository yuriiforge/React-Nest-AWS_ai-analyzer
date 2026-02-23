import { Outlet } from 'react-router-dom';
import { Layout } from '@/components/layout';

export const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
