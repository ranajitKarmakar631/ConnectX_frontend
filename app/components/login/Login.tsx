import React from "react";
import LoginForm from "./LoginForm";
import { Card, Typography, Divider, Button, Space } from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md z-10">
        <Card
          className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border-white/20"
          bordered={false}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <MessageOutlined className="text-white text-3xl" />
            </div>
            <Title
              level={2}
              className="!mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Let&apos;s Talk
            </Title>
            <Text type="secondary" className="text-sm">
              Welcome back! Sign in to continue your conversations
            </Text>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Divider */}
          <Divider plain className="!my-6">
            <Text type="secondary" className="text-xs uppercase">
              Or continue with
            </Text>
          </Divider>

          {/* Social Login Buttons */}
          <Space direction="vertical" size="middle" className="w-full">
            <Button
              icon={<GoogleOutlined />}
              size="large"
              block
              className="!rounded-xl !h-11 hover:!shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="font-medium">Continue with Google</span>
            </Button>
            <Button
              icon={<FacebookOutlined />}
              size="large"
              block
              className="!rounded-xl !h-11 hover:!shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="font-medium">Continue with Facebook</span>
            </Button>
          </Space>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Text type="secondary">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold">
                Sign up for free
              </Link>
            </Text>
          </div>

          {/* Security Badge */}
          <div className="mt-5 text-center">
            <Text type="secondary" className="text-xs">
              🔒 Secure login • End-to-end encrypted
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
