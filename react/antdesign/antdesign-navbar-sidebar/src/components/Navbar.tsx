import { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Avatar, Switch } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MenuOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    GlobalOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

interface NavbarProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = false; // TODO: Replace with actual auth state

    const menuItems = [
        {
            key: '/',
            label: 'Home',
            onClick: () => navigate('/'),
        },
        {
            key: '/dashboard',
            label: 'Dashboard',
            onClick: () => navigate('/dashboard'),
        },
    ];

    const settingsMenu: MenuProps['items'] = [
        {
            key: 'theme',
            label: (
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    Dark Mode
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        size="small"
                    />
                </Space>
            ),
        },
        {
            key: 'language',
            label: 'Language',
            icon: <GlobalOutlined />,
            children: [
                {
                    key: 'en',
                    label: 'English',
                    onClick: () => setLanguage('en'),
                },
                {
                    key: 'es',
                    label: 'Español',
                    onClick: () => setLanguage('es'),
                },
                {
                    key: 'fr',
                    label: 'Français',
                    onClick: () => setLanguage('fr'),
                },
            ],
        },
    ];

    const authMenu: MenuProps['items'] = [
        {
            key: '/login',
            label: 'Login',
            icon: <UserOutlined />,
            onClick: () => navigate('/login'),
            style: location.pathname === '/login' ? {
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                color: '#1890ff',
            } : {},
        },
        {
            key: '/register',
            label: 'Register',
            onClick: () => navigate('/register'),
            style: location.pathname === '/register' ? {
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                color: '#1890ff',
            } : {},
        },
        { type: 'divider' },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            children: settingsMenu,
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: (
                <span style={{ color: '#ff4d4f' }}>Logout</span>
            ),
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
            onClick: () => {
                console.log('Logout clicked');
                navigate('/login');
            },
            danger: true,
            style: { marginTop: 'auto' },
        },
    ];

    const profileMenu: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            children: settingsMenu,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: (
                <span style={{ color: '#ff4d4f' }}>Logout</span>
            ),
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
            onClick: () => {
                console.log('Logout clicked');
                navigate('/login');
            },
            danger: true,
        },
    ];

    return (
        <>
            <Header
                className="navbar"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: isDarkMode ? '#141414' : '#001529',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    height: '100%',
                }}>
                    <div className="app-title" style={{
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                    }}>
                        My App
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="desktop-menu"
                        style={{
                            minWidth: 200,
                            background: 'transparent',
                            border: 'none',
                            height: '100%',
                        }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    height: '100%',
                }}>
                    <Dropdown
                        menu={{
                            items: isLoggedIn ? profileMenu : authMenu
                        }}
                        placement="bottomRight"
                    >
                        <Avatar
                            icon={<UserOutlined />}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: isLoggedIn ? '#1890ff' : 'rgba(255, 255, 255, 0.2)',
                            }}
                        />
                    </Dropdown>

                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="mobile-menu-button"
                        style={{
                            color: 'white',
                        }}
                    />
                </div>
            </Header>

            <Menu
                mode="inline"
                className="mobile-menu"
                style={{
                    display: mobileMenuOpen ? 'block' : 'none',
                    position: 'fixed',
                    top: 64,
                    right: 0,
                    width: '250px',
                    height: 'calc(100vh - 64px)',
                    zIndex: 1000,
                    background: isDarkMode ? '#141414' : '#001529',
                    overflowY: 'auto',
                }}
                theme="dark"
                selectedKeys={[location.pathname]}
                items={[
                    ...menuItems,
                    { type: 'divider' as const },
                    ...(isLoggedIn ? profileMenu : authMenu),
                ].filter(Boolean)}
            />
        </>
    );
} 