import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const { Content } = AntLayout;

interface MainLayoutProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function MainLayout({ isDarkMode, toggleTheme }: MainLayoutProps) {
  return (
    <AntLayout className="main-layout" style={{ minHeight: '100vh' }}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Content style={{ 
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        height: 'calc(100vh - 64px)',
        overflow: 'auto'
      }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
} 