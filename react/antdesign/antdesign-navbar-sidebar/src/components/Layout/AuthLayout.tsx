import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = AntLayout;

export default function AuthLayout() {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        minHeight: '100vh',
      }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
} 