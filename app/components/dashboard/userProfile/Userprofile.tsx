import React from "react";
import { Card, Avatar, Badge, Tag, Tooltip, Space, Typography } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SafetyOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;

interface Address {
  city?: string;
  state?: string;
  country?: string;
}

interface Privacy {
  lastSeen?: string;
  profilePhoto?: string;
  about?: string;
  readReceipts?: boolean;
}

interface UserProfileProps {
  userData?: {
    displayName?: string;
    about?: string;
    isOnline?: boolean;
    lastSeen?: string | { $date: string };
    address?: Address;
    privacy?: Privacy;
    isActive?: boolean;
    createdAt?: string | { $date: string };
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Text type="secondary">Loading profile...</Text>
      </div>
    );
  }

  const {
    displayName = "Unknown User",
    about = "No bio available",
    isOnline = false,
    lastSeen,
    address = {},
    privacy = {},
    isActive = false,
    createdAt,
  } = userData;

  const formatDate = (dateValue?: string | { $date: string }): string => {
    if (!dateValue) return "N/A";

    const dateStr =
      typeof dateValue === "object" && dateValue !== null && "$date" in dateValue
        ? dateValue.$date
        : (dateValue as string);

    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLastSeenText = (): string => {
    if (isOnline) return "Online now";
    if (!lastSeen) return "Offline";

    const dateStr =
      typeof lastSeen === "object" && lastSeen !== null && "$date" in lastSeen
        ? lastSeen.$date
        : (lastSeen as string);

    const lastSeenDate = new Date(dateStr);
    if (isNaN(lastSeenDate.getTime())) return "Offline";

    return `Last seen ${lastSeenDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <Card
      className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
      style={{ padding: "24px" }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center mb-6">
        <Badge
          dot
          offset={[-8, 8]}
          color={isOnline ? "#52c41a" : "#d9d9d9"}
          className="mb-4"
        >
          <Avatar
            size={100}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-md"
            style={{ border: "4px solid white" }}
          />
        </Badge>

        <Title level={4} className="mb-1 mt-3 text-center">
          {displayName}
          {isActive && (
            <CheckCircleFilled
              className="ml-2 text-blue-500"
              style={{ fontSize: "16px" }}
            />
          )}
        </Title>

        <Text type="secondary" className="text-xs mb-2">
          {getLastSeenText()}
        </Text>

        <div className="w-full bg-blue-50 rounded-lg p-3 mt-3">
          <Paragraph className="mb-0 text-center text-gray-700 text-sm">
            {about}
          </Paragraph>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <Space direction="vertical" size={2} className="w-full">
          <div className="flex items-center text-gray-600">
            <EnvironmentOutlined className="mr-2 text-red-500" />
            <Text strong className="text-xs">
              Location
            </Text>
          </div>
          <Text className="text-xs text-gray-600 ml-6">
            {address?.city || "N/A"}
            {address?.state ? `, ${address.state}` : ""}
          </Text>
          <Text className="text-xs text-gray-500 ml-6">
            {address?.country || ""}
          </Text>
        </Space>
      </div>

      {/* Privacy Settings */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <SafetyOutlined className="mr-2 text-green-500" />
          <Text strong className="text-xs">
            Privacy Settings
          </Text>
        </div>

        <div className="flex flex-wrap gap-2 ml-6">
          <Tooltip title={`Last seen visible to ${privacy?.lastSeen || "N/A"}`}>
            <Tag color="blue" className="text-xs cursor-help">
              <EyeOutlined className="mr-1" />
              Last Seen: {privacy?.lastSeen || "N/A"}
            </Tag>
          </Tooltip>

          <Tooltip title={`Profile photo visible to ${privacy?.profilePhoto || "N/A"}`}>
            <Tag color="purple" className="text-xs cursor-help">
              Photo: {privacy?.profilePhoto || "N/A"}
            </Tag>
          </Tooltip>

          <Tooltip title={`About visible to ${privacy?.about || "N/A"}`}>
            <Tag color="cyan" className="text-xs cursor-help">
              About: {privacy?.about || "N/A"}
            </Tag>
          </Tooltip>

          {privacy?.readReceipts && (
            <Tag color="green" className="text-xs">
              Read Receipts ✓
            </Tag>
          )}
        </div>
      </div>

      {/* Member Since */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <InfoCircleOutlined className="mr-2 text-gray-400 text-xs" />
          <Text type="secondary" className="text-xs">
            Member since {formatDate(createdAt)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;