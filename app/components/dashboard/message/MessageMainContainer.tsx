import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import MessageBox from "./MessageBox";
import { useSelector } from "react-redux";
import { useSocket } from "@/app/SocketProvider";
import { useGetUserOnline } from "@/service/redis/redisService";

const MessageMainContainer = ({ selectedChat }: { selectedChat: any }) => {
  const { userId } = useParams();
  const socket = useSocket();
  const { data: onlineStatus } = useGetUserOnline({
    _id: selectedChat?.opponentProfile?._id,
  });
  const reduxIsTypingChat = useSelector(
    (state: any) => state.chat.typingChats as string[],
  );
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (reduxIsTypingChat.includes(selectedChat?._id)) setIsTyping(true);
    else setIsTyping(false);
  }, [reduxIsTypingChat, selectedChat?._id]);

  /* ── No chat selected ── */
  if (!selectedChat) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(20,184,166,0.05) 0%, transparent 70%), #f8fafc",
          gap: "16px",
        }}
      >
        {/* Decorative icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #e0f2fe, #ccfbf1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(20,184,166,0.15)",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#334155",
              fontWeight: 700,
              fontSize: "16px",
              margin: 0,
            }}
          >
            No conversation selected
          </p>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "13px",
              marginTop: "6px",
              margin: "6px 0 0",
            }}
          >
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  /* ── Main layout ── */
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        background: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <MessageHeader
        chatId={selectedChat._id}
        isTyping={isTyping}
        opponentProfile={selectedChat.opponentProfile}
        isOnline={onlineStatus?.data?.isOnline}
      />

      {/* Message area — flex-1 with hidden overflow so MessageBox scrolls internally */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <MessageBox selectedChat={selectedChat} />
      </div>

      {/* Input */}
      <MessageInput senderId={userId as string} selectedChat={selectedChat} />
    </div>
  );
};

export default MessageMainContainer;
