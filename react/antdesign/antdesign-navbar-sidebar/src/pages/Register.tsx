import { Button, Form, Input, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const onFinish = (values: RegisterForm) => {
    // TODO: Implement actual registration logic
    console.log('Register form submitted:', values);
    message.success('Registration successful!');
    navigate('/login');
  };

  const handleGithubRegister = () => {
    // TODO: Implement GitHub OAuth registration
    console.log('GitHub registration clicked');
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth registration
    console.log('Google registration clicked');
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
        title="Register" 
        bordered={false}
        style={{ width: '100%' }}
      >
        <Form
          name="register"
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
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
            style={{ marginBottom: '24px' }}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
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

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
            style={{ marginBottom: '24px' }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login now!</Link>
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
              onClick={handleGithubRegister}
              style={{ minWidth: '120px' }}
            >
              GitHub
            </Button>
            <Button 
              icon={<GoogleOutlined />} 
              size="large"
              onClick={handleGoogleRegister}
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