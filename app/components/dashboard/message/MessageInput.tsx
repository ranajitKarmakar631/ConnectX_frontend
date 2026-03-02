import React, { useRef, useState } from "react";
import { Mic, Paperclip, Smile } from "lucide-react";
import { socketService } from "@/service/socket/socketService";
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useCreateMessage } from "@/service/messsages/messageService";

interface MessageInputProps {
  senderId: string;
  selectedChat: any;
}

const MessageInput: React.FC<MessageInputProps> = ({
  senderId,
  selectedChat,
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const messageMutation = useCreateMessage();
  const chatId = selectedChat?._id;
  const canSend = message.trim().length > 0;

  const handleTyping = (value: string) => {
    if (!chatId) return;

    if (!isTypingRef.current && value.trim() !== "") {
      socketService.emit("start-typing", chatId);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit("stop-typing", chatId);
      isTypingRef.current = false;
    }, 2000);
  };

  const handleChange = (value: string) => {
    setMessage(value);
    handleTyping(value);
  };
  const handleSend = async () => {
    if (!canSend || !chatId) return;

    const payload = {
      chatId,
      senderId,
      message: message.trim(),
      timestamp: new Date(),
    };

    socketService.emit("stop-typing", { chatId, senderId });
    isTypingRef.current = false;

    socketService.emit("send-message", payload);
    await messageMutation.mutateAsync({
      chatId,
      message,
      senderId,
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "10px 16px",
        background: "#efeae2",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px",
          background: "#f0f2f5",
          borderRadius: "24px",
        }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<Paperclip size={20} />}
          style={{ color: "#54656f" }}
        />

        <Button
          type="text"
          shape="circle"
          icon={<Smile size={20} />}
          style={{ color: "#54656f" }}
        />

        <TextArea
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{
            flex: 1,
            fontSize: "14.5px",
            lineHeight: "1.6",
            background: "transparent",
          }}
        />

        {canSend ? (
          <Button
            onClick={handleSend}
            shape="circle"
            type="primary"
            icon={<SendOutlined style={{ transform: "rotate(-20deg)" }} />}
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#25D366",
              borderColor: "#25D366",
            }}
          />
        ) : (
          <Button
            type="text"
            shape="circle"
            icon={<Mic size={20} />}
            style={{ color: "#54656f" }}
          />
        )}
      </div>
    </div>
  );
};

export default MessageInput;