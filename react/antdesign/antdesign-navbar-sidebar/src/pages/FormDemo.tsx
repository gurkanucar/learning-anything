import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Slider,
  Upload,
  Modal,
  message,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Rate,
  Space,
  Tag,
  Card,
  Row,
  Col,
  TimePicker,
} from 'antd';
import { UploadOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps } from 'antd';
import type { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const FormDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [disabled, setDisabled] = useState(false);
  const format = 'HH:mm';

  const tagOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'sports', label: 'Sports' },
  ];

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
  ];

  const handleSubmit = (values: any) => {
    Modal.success({
      title: 'Form Submitted Successfully!',
      content: (
        <div>
          <p>Your form has been submitted with the following values:</p>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      ),
    });
  };

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const handleTagInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Advanced Form Demo" 
        bordered={false}
        className="form-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            switch: true,
            slider: 50,
            rate: 3,
          }}
        >
          <Row gutter={[24, 0]}>
            {/* Basic Inputs - First Column */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>

            {/* TextArea - Full Width */}
            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </Col>

            {/* Number Input and Country Select */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: 'Please enter your age' }]}
              >
                <InputNumber min={0} max={150} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please select your country' }]}
              >
                <Select placeholder="Select your country">
                  <Select.Option value="usa">United States</Select.Option>
                  <Select.Option value="uk">United Kingdom</Select.Option>
                  <Select.Option value="canada">Canada</Select.Option>
                  <Select.Option value="australia">Australia</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Price and Percentage Inputs */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Price"
                name="price"
                initialValue={1000}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Percentage"
                name="percentage"
                initialValue={100}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value?.replace('%', '') as unknown as number}
                />
              </Form.Item>
            </Col>

            {/* Tags Select and Categories */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Tags Select"
                name="tagsSelect"
                rules={[{ required: true, message: 'Please select at least one tag' }]}
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Select or create tags"
                  onChange={handleChange}
                  options={tagOptions}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Categories"
                name="categories"
                rules={[{ required: true, message: 'Please select at least one category' }]}
              >
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select categories"
                  onChange={handleChange}
                  options={categoryOptions}
                  allowClear
                  maxTagCount={3}
                  maxTagTextLength={10}
                />
              </Form.Item>
            </Col>

            {/* Date Pickers */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Birth Date"
                name="birthDate"
                rules={[{ required: true, message: 'Please select your birth date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Available Dates"
                name="dateRange"
                rules={[{ required: true, message: 'Please select date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* Time Pickers */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Select Time"
                name="time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }}
                  format={format}
                  changeOnScroll 
                  needConfirm={false}
                  placeholder="Select time"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Time Range"
                name="timeRange"
                rules={[{ required: true, message: 'Please select time range' }]}
              >
                <TimePicker.RangePicker
                  style={{ width: '100%' }}
                  format={format}
                  defaultValue={[startTime, endTime]}
                  placeholder={['Start time', 'End time']}
                />
              </Form.Item>
            </Col>

            {/* Slider - Full Width */}
            <Col span={24}>
              <Form.Item
                label="Experience Level"
                name="slider"
              >
                <Slider marks={{
                  0: 'Novice',
                  33: 'Intermediate',
                  66: 'Advanced',
                  100: 'Expert'
                }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Range Slider"
                name="rangeSlider"
                initialValue={[20, 50]}
              >
                <Slider 
                  range={{ draggableTrack: true }} 
                  marks={{
                    0: '0',
                    20: '20',
                    50: '50',
                    100: '100'
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Basic Slider"
                name="basicSlider"
                initialValue={30}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Slider defaultValue={30} disabled={disabled} />
                  <Switch
                    checked={disabled}
                    onChange={setDisabled}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                  />
                </Space>
              </Form.Item>
            </Col>

            {/* Switch and Radio Group */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Notifications"
                name="switch"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="City"
                name="city"
                initialValue="a"
                rules={[{ required: true, message: 'Please select a city' }]}
              >
                <Radio.Group buttonStyle="solid">
                  <Space wrap>
                    <Radio.Button value="a">Hangzhou</Radio.Button>
                    <Radio.Button value="b">Shanghai</Radio.Button>
                    <Radio.Button value="c">Beijing</Radio.Button>
                    <Radio.Button value="d">Chengdu</Radio.Button>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/* Checkbox Group and Rate */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Interests"
                name="interests"
                rules={[{ required: true, message: 'Please select at least one interest' }]}
              >
                <Checkbox.Group>
                  <Space direction="vertical">
                    <Checkbox value="sports">Sports</Checkbox>
                    <Checkbox value="reading">Reading</Checkbox>
                    <Checkbox value="music">Music</Checkbox>
                    <Checkbox value="travel">Travel</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Rating"
                name="rate"
              >
                <Rate />
              </Form.Item>
            </Col>

            {/* Tags Input - Full Width */}
            <Col span={24}>
              <Form.Item label="Tags">
                <Space wrap>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleTagClose(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {inputVisible ? (
                    <Input
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onBlur={handleTagInputConfirm}
                      onPressEnter={handleTagInputConfirm}
                    />
                  ) : (
                    <Tag onClick={() => setInputVisible(true)}>
                      <PlusOutlined /> New Tag
                    </Tag>
                  )}
                </Space>
              </Form.Item>
            </Col>

            {/* File Upload - Full Width */}
            <Col span={24}>
              <Form.Item
                label="File Upload"
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={e => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Form.Item>
            </Col>

            {/* Submit Button - Full Width */}
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Submit Form
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default FormDemo; 