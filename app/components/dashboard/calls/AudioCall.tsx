"use client";

import { Button } from "antd";
import React, { useState } from "react";
import { PhoneOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useCreateCalls } from "@/service/calls/callService";
import { useSocket } from "@/app/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { createPeerConnection } from "@/service/peerService/peerService";
import { startCall } from "@/Redux/ReduxChat/chatSlice";

const AudioCall = ({
  opponentProfile,
  chatId,
}: {
  chatId?: string;
  opponentProfile: any;
}) => {
  const dispatch = useDispatch();

  const handleAudioOn = async () => {
    dispatch(
      startCall({
        chatId,
        callType: "audio",
        receiverId: opponentProfile?.userId,
        receiverName: opponentProfile?.displayName || opponentProfile?.userName,
      }),
    );
  };

  return (
    <div>
      <Button
        onClick={handleAudioOn}
        type="default"
        icon={<PhoneOutlined />}
        className="text-gray-600 hover:bg-gray-100"
        size="large"
      />
    </div>
  );
};

export default AudioCall;
