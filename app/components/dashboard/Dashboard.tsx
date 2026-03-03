"use client";

import { Col, Row, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./chat/ChatList";
import MessageMainContainer from "./message/MessageMainContainer";
import { useParams } from "next/navigation";
import { useGetConnectionList } from "@/service/userService/userService";
import UserProfile from "./userProfile/Userprofile";
import { useSelector } from "react-redux";
import NotificationButton from "./notification/NotificationButton";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const { userId } = useParams();

  const { data, isLoading } = useGetConnectionList({
    userId: userId,
  });

  const connections =
    data?.pages?.flatMap((pages: any) => pages.data.results) ?? [];

  const [selectChat, setSelectChat] = useState<any>(connections[0]);
  const [providedChat, setprovidedChat] = useState<any>(connections[0]);
  // Controls whether the chat list panel is visible on mobile
  const [showChatList, setShowChatList] = useState<boolean>(true);

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    setprovidedChat(selectChat);
  }, [selectChat]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        console.log(entry.contentRect.height);
      }
    });

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // On mobile, when a chat is selected, switch to the message view
  const handleSelectChat = (chat: any) => {
    setSelectChat(chat);
    setShowChatList(false); // hide chat list, show messages
  };

  // Go back to the chat list on mobile
  const handleBack = () => {
    setShowChatList(true);
  };

  if (isLoading) return <Spin />;

  return (
    <>
      {/* ── Desktop layout (md and above) ── */}
      <Row
        ref={rowRef}
        style={{ minHeight: "100vh", margin: 0 }}
        gutter={[0, 0]}
        className="dashboard-row"
      >
        {/* Chat list sidebar – visible on md+ */}
        <Col
          xs={0}
          sm={0}
          md={6}
          lg={6}
          xl={6}
          style={{ minHeight: "100vh" }}
        >
          <ChatList chatList={connections} onSelectChat={setSelectChat} />
        </Col>

        {/* Message area – visible on md+ */}
        <Col xs={0} sm={0} md={18} xl={18}>
          <MessageMainContainer selectedChat={providedChat} />
        </Col>
      </Row>

      {/* ── Mobile layout (xs / sm only) ── */}
      <div className="mobile-dashboard">
        {/* Chat List View */}
        {showChatList ? (
          <div className="mobile-panel mobile-chat-list">
            {/* Optional top bar */}
            <div className="mobile-topbar">
              <NotificationButton />
            </div>
            <ChatList
              chatList={connections}
              onSelectChat={handleSelectChat}
            />
          </div>
        ) : (
          /* Message View */
          <div className="mobile-panel mobile-messages">
            {/* Back button */}
            <div className="mobile-topbar mobile-topbar--messages">
              <button
                className="mobile-back-btn"
                onClick={handleBack}
                aria-label="Back to chats"
              >
                <ArrowLeftOutlined />
                <span>Chats</span>
              </button>
            </div>
            <MessageMainContainer selectedChat={providedChat} />
          </div>
        )}
      </div>

      <style jsx>{`
        /* Hide desktop layout on mobile */
        @media (max-width: 767px) {
          .dashboard-row {
            display: none !important;
          }
          .mobile-dashboard {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            width: 100%;
          }
        }

        /* Hide mobile layout on desktop */
        @media (min-width: 768px) {
          .mobile-dashboard {
            display: none !important;
          }
        }

        .mobile-dashboard {
          margin: 0;
          padding: 0;
        }

        .mobile-panel {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .mobile-topbar {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-topbar--messages {
          justify-content: flex-start;
          gap: 8px;
        }

        .mobile-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #1677ff;
          padding: 4px 0;
        }

        .mobile-back-btn:hover {
          opacity: 0.75;
        }

        /* Slide-in animation for the message panel */
        .mobile-messages {
          animation: slideInFromRight 0.25s ease;
        }

        .mobile-chat-list {
          animation: slideInFromLeft 0.25s ease;
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;