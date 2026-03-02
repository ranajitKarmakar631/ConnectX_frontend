import React from 'react';
import { Button, Result } from 'antd';

const NotFound: React.FC = ({message}:{message?:String}) => (
  <Result
    status="404"
    title="404"
    subTitle= {message}
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default NotFound;