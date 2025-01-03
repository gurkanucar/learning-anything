import { Drawer, List, Switch, Radio, Space, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { Title } = Typography;

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function SettingsMenu({
  open,
  onClose,
  isDarkMode,
  toggleTheme,
  language,
  setLanguage,
}: SettingsMenuProps) {
  const handleLanguageChange = (e: RadioChangeEvent) => {
    setLanguage(e.target.value);
  };

  return (
    <Drawer
      title="Settings"
      placement="right"
      onClose={onClose}
      open={open}
      width={300}
    >
      <List>
        <List.Item>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>Dark Mode</span>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </Space>
        </List.Item>
        <List.Item>
          <div style={{ width: '100%' }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              <GlobalOutlined /> Language
            </Title>
            <Radio.Group 
              value={language} 
              onChange={handleLanguageChange}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="en">English</Radio>
                <Radio value="es">Español</Radio>
                <Radio value="fr">Français</Radio>
              </Space>
            </Radio.Group>
          </div>
        </List.Item>
      </List>
    </Drawer>
  );
} 