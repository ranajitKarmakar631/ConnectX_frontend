"use client";

import React from "react";
import { Modal, Button, Avatar, Space } from "antd";
import { Phone, PhoneOff } from "lucide-react";

interface IncomingCallModalProps {
  visible: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingAudioCallModal: React.FC<IncomingCallModalProps> = ({
  visible,
  callerName,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      title="Incoming Audio Call"
      open={visible}
      footer={null}
      closable={false}
      centered
      width={350}
      styles={{ body: { textAlign: "center", padding: "30px 20px" } }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Avatar
          size={80}
          style={{
            backgroundColor: "#722ed1",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          {callerName?.charAt(0).toUpperCase()}
        </Avatar>

        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {callerName}
        </div>

        <div style={{ color: "#8c8c8c" }}>
          is calling you (Audio)...
        </div>

        <Space size="large" style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onAccept}
          >
            <Phone size={24} />
          </Button>

          <Button
            danger
            shape="circle"
            size="large"
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onDecline}
          >
            <PhoneOff size={24} />
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default IncomingAudioCallModal;
