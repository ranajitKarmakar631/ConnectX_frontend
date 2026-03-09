import { Button } from "antd";
import React, { useState } from "react";
import { VideoCameraOutlined } from "@ant-design/icons";
import { useCreateCalls } from "@/service/calls/callService";
import { useSocket } from "@/app/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { createPeerConnection } from "@/service/peerService/peerService";
import { startCall } from "@/Redux/ReduxChat/chatSlice";
import { useGetProfileDetails } from "@/service/userProfile/userProfileService";
import { useParams } from "next/navigation";

const VideoCall = ({
  opponentProfile,
  chatId,
}: {
  chatId?: string;
  opponentProfile: any;
}) => {
  const dispatch = useDispatch();
  const {userId}= useParams()
  
   const { data: userData } = useGetProfileDetails({filter:{userId}});
  const handleVideoOn = async () => {
    dispatch(
      startCall({
        chatId,
        callType:'video',
        receiverId: opponentProfile?.userId,
        senderName: userData?.data?.displayName,
         receiverName: opponentProfile?.displayName || opponentProfile?.userName,
      }),
    );
  };

  return (
    <div>
      <Button
        onClick={handleVideoOn}
        type="default"
        icon={<VideoCameraOutlined />}
        className="text-gray-600 hover:bg-gray-100"
        size="large"
      />
    </div>
  );
};

export default VideoCall;
