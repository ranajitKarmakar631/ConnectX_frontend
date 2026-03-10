"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Avatar, Spin } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { socketService } from "@/service/socket/socketService";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { joinRoom } from "@/Redux/ReduxChat/chatSlice";
import { useGetChatMessageList } from "@/service/messsages/messageService";
import axios from "axios";
import Lootie from "lottie-react";
import Lottie from "lottie-react";
import { Message } from "@/types";

export interface ReduxMessage {
  id: string | number;
  chatId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

interface MessageBoxProps {
  selectedChat?: any;
  contactName?: string;
  contactInitials?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  selectedChat,
  contactName = "Contact",
  contactInitials = "CN",
}) => {
  const dispatch = useDispatch();
  const senderId = useParams()?.userId as string;
  const [emojiData, setEmojiData] = useState<any>(null);

  const loadEmoji = async () => {
    const res = await axios.get(
      "https://fonts.gstatic.com/s/e/notoemoji/latest/1f923/lottie.json",
      {
        withCredentials: false,
      },
    );

    console.log("emoji data", res.data);

    setEmojiData(res.data);
  };

  const messageRef = useRef<HTMLDivElement | null>(null);
  const topObserverRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef<boolean>(true);

  const reduxMessages = useSelector(
    (state: any) => state.chat.messages as ReduxMessage[],
  );

  const reduxIsTypingChat = useSelector(
    (state: any) => state.chat.typingChats as string[],
  );

  const chatId = selectedChat?._id;
  const {
    data: messages,
    hasNextPage,
    isFetchingNextPage,
    isLoading,

    fetchNextPage,
  } = useGetChatMessageList({ filter: { chatId } });

  const apiMessages = messages ?? [];
  const isTyping = reduxIsTypingChat.includes(chatId);

  const socketMessages = reduxMessages.filter((msg) => msg.chatId === chatId);

  /* ───────── Merge + Sort + Deduplicate Messages ───────── */
  const sortedMessages = useMemo(() => {
    const map = new Map<string, Message>();

    [...apiMessages, ...socketMessages].forEach((msg: Message) => {
      const uniqueKey =
        msg._id ||
        (msg.id as string) ||
        `${msg.senderId}-${msg.message}-${msg.createdAt || msg.timestamp}`;

      if (!map.has(uniqueKey)) {
        map.set(uniqueKey, msg);
      }
    });

    return Array.from(map.values())
      .map((msg: Message) => ({
        ...msg,
        time: msg.createdAt || msg.timestamp,
      }))
      .sort(
        (a: Message, b: Message) =>
          new Date(a.createdAt || a.timestamp).getTime() -
          new Date(b.createdAt || b.timestamp).getTime(),
      );
  }, [apiMessages, socketMessages]);

  /* ───────── Join / Leave Room ───────── */
  useEffect(() => {
    if (!chatId) return;

    isInitialLoad.current = true;
    dispatch(joinRoom(chatId));

    return () => {
      socketService.emit("leave-room", chatId);
      dispatch(joinRoom(null));
    };
  }, [chatId, dispatch]);

  /* ───────── Initial + Smart Auto Scroll ───────── */
  useEffect(() => {
    const container = messageRef.current;
    if (!container) return;

    if (sortedMessages.length === 0) return;

    if (isInitialLoad.current) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
      isInitialLoad.current = false;
      return;
    }

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [sortedMessages]);

  /* ───────── IntersectionObserver for Infinite Scroll ───────── */
  useEffect(() => {
    const container = messageRef.current;
    const target = topObserverRef.current;

    if (!container || !target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          const previousHeight = container.scrollHeight;

          await fetchNextPage();

          requestAnimationFrame(() => {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - previousHeight;
          });
        }
      },
      {
        root: container,
        threshold: 1.0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ───────── Time Formatter ───────── */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ───────── UI ───────── */
  return (
    <div
      ref={messageRef}
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "24px 24px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        backgroundImage:
          "url('https://i.pinimg.com/736x/58/c3/33/58c33377dfcbb3022493dec49d098b02.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Observer Sentinel */}
      <div ref={topObserverRef} style={{ height: "1px" }} />

      {/* Top Loading Spinner */}
      {isFetchingNextPage && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "10px" }}
        >
          <Spin size="small" />
        </div>
      )}

      {sortedMessages.length === 0 ? (
        /* ── Empty State ── */
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #e0f2fe, #ccfbf1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(20,184,166,0.15)",
            }}
          >
            <MessageOutlined style={{ fontSize: 32, color: "#14b8a6" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 600 }}>No messages yet</p>
            <p style={{ color: "#94a3b8" }}>Start the conversation!</p>
          </div>
        </div>
      ) : (
        <>
          {sortedMessages.map((message: Message, index: number) => {
            const isUser = message.senderId === senderId;
            const isLast =
              index === sortedMessages.length - 1 ||
              sortedMessages[index + 1]?.senderId !== message.senderId;

            return (
              <div
                key={message._id || message.id}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "10px",
                  paddingInline: "20px",
                  flexDirection: isUser ? "row-reverse" : "row",
                  marginBottom: isLast ? "10px" : "2px",
                }}
              >
                {/* <div style={{ width: "36px", flexShrink: 0 }}>
                  {!isUser && isLast && (
                    <Avatar style={{border:'1px solid white'}} shape="square" size={36}>{contactInitials}</Avatar>
                  )}
                </div> */}

                <div
                  style={{
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "6px 8px 8px 8px",
                      borderRadius: isUser
                        ? isLast
                          ? "10px 0px 10px 10px"
                          : "8px"
                        : isLast
                          ? "0px 10px 10px 10px"
                          : "8px",
                      backgroundColor: isUser ? "#005246" : "#363636",
                      fontSize: "15px",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      // color:'black',
                      boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {message.message}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#667788",
                      }}
                    >
                      {(message.timestamp || message.createdAt) &&
                        formatTime(
                          message.timestamp || message.createdAt || "",
                        )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ padding: "8px", fontSize: "13px", color: "#667781" }}>
              {contactName} is typing...
            </div>
          )}
          <div onClick={loadEmoji} style={{ cursor: "pointer" }}>
            <div>hello</div>

            {emojiData && (
              <Lottie
                animationData={emojiData}
                loop
                autoplay
                style={{ width: 30, display: "inline-block" }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBox;
