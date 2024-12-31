import { Button, Form, Input, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values: LoginForm) => {
    // TODO: Implement actual login logic
    console.log('Login form submitted:', values);
    message.success('Login successful!');
    navigate('/');
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth login
    console.log('GitHub login clicked');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log('Google login clicked');
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%'
    }}>
      <Card 
        title="Login" 
        bordered={false}
        style={{ width: '100%' }}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            style={{ marginBottom: '24px' }}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: '24px' }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
            Or <Link to="/register">register now!</Link>
          </Form.Item>

          <Divider style={{ marginBottom: '24px' }}>Or continue with</Divider>

          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <Button 
              icon={<GithubOutlined />} 
              size="large"
              onClick={handleGithubLogin}
              style={{ minWidth: '120px' }}
            >
              GitHub
            </Button>
            <Button 
              icon={<GoogleOutlined />} 
              size="large"
              onClick={handleGoogleLogin}
              style={{ minWidth: '120px' }}
            >
              Google
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
} 