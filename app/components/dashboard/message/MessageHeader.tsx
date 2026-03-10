// import React from "react";
// import { Avatar, Badge, Button } from "antd";
// import {
//   PhoneOutlined,
//   VideoCameraOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import AudioCall from "../calls/AudioCall";
// import VideoCall from "../calls/VideoCall";

// interface ChatHeaderProps {
//   opponentProfile: any;
// }

// export const formatLastSeen = (date: string | Date): string => {
//   const lastSeen = dayjs(date);
//   const now = dayjs();

//   if (lastSeen.isSame(now, "minute")) {
//     return "Online";
//   }

//   if (lastSeen.isSame(now, "day")) {
//     return `Last seen today at ${lastSeen.format("hh:mm A")}`;
//   }

//   if (lastSeen.isSame(now.subtract(1, "day"), "day")) {
//     return `Last seen yesterday at ${lastSeen.format("hh:mm A")}`;
//   }

//   if (now.diff(lastSeen, "day") < 7) {
//     return `Last seen ${lastSeen.fromNow()}`;
//   }

//   return `Last seen on ${lastSeen.format("DD MMM YYYY")}`;
// };

// export const formatMessageTime = (date: string | Date): string => {
//   const messageDate = dayjs(date);
//   const now = dayjs();

//   if (messageDate.isSame(now, "day")) {
//     // Today → show time only
//     return messageDate.format("hh:mm A");
//   }

//   if (messageDate.isSame(now.subtract(1, "day"), "day")) {
//     return "Yesterday";
//   }

//   if (messageDate.isSame(now, "year")) {
//     return messageDate.format("DD MMM");
//   }

//   return messageDate.format("DD MMM YYYY");
// };

// const MessageHeader= ({chatId, opponentProfile, isTyping }:{chatId?:string, isTyping?:boolean, opponentProfile?: ChatHeaderProps}) => {

//   if (!opponentProfile) return null;

//   console.log(isTyping)

//   const initials = opponentProfile.displayName
//     ?.split(" ")
//     .map((n: string) => n[0])
//     .join("")
//     .toUpperCase();

//   const location = `${opponentProfile.address?.city ?? ""}${
//     opponentProfile.address?.city && opponentProfile.address?.country ? ", " : ""
//   }${opponentProfile.address?.country ?? ""}`;

//   const statusText = opponentProfile?.isOnline
//     ? "Active now"
//     : opponentProfile?.lastSeen
//     ? `Last seen ${new Date(opponentProfile?.lastSeen).toLocaleString()}`
//     : "Offline";

//   return (
//     <div className="relative bg-white p-6 shadow-md border-b border-gray-200">
//   <div className="flex items-center justify-between">
//     <div className="flex items-center gap-4">
//       <Badge
//         dot
//         status={opponentProfile?.isOnline ? "success" : "default"}
//         offset={[-5, 45]}
//       >
//         <Avatar
//           size={56}
//           className="bg-orange-500 text-white font-bold shadow"
//           style={{ fontSize: "22px" }}
//         >
//           {initials}
//         </Avatar>
//       </Badge>

//       <div>
//         <h2 className="text-xl font-semibold text-gray-800 mb-1">
//           {opponentProfile?.displayName}
//         </h2>

//         <p className="text-sm text-gray-500 font-medium">
//           {isTyping && <p style={{color:'#25D366'}}>typing...</p>}
//         </p>
//       </div>
//     </div>

//     <div className="flex items-center gap-2">

//       <AudioCall />
//       <VideoCall chatId={chatId} opponentProfile={opponentProfile}/>
//       <Button
//         type="text"
//         icon={<MoreOutlined />}
//         className="text-gray-600 hover:bg-gray-100"
//         size="large"
//       />
//     </div>
//   </div>
// </div>

//   );
// };

// export default MessageHeader;

import React from "react";
import { Avatar, Badge, Button, Typography } from "antd";
import {
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import AudioCall from "../calls/AudioCall";
import VideoCall from "../calls/VideoCall";

import { User } from "@/types";

interface ChatHeaderProps {
  opponentProfile: User;
}

export const formatLastSeen = (date: string | Date): string => {
  const lastSeen = dayjs(date);
  const now = dayjs();

  if (lastSeen.isSame(now, "minute")) return "Online";
  if (lastSeen.isSame(now, "day"))
    return `Last seen today at ${lastSeen.format("hh:mm A")}`;
  if (lastSeen.isSame(now.subtract(1, "day"), "day"))
    return `Last seen yesterday at ${lastSeen.format("hh:mm A")}`;
  if (now.diff(lastSeen, "day") < 7) return `Last seen ${lastSeen?.fromNow()}`;
  return `Last seen on ${lastSeen.format("DD MMM YYYY")}`;
};

export const formatMessageTime = (date: string | Date): string => {
  const messageDate = dayjs(date);
  const now = dayjs();

  if (messageDate.isSame(now, "day")) return messageDate.format("hh:mm A");
  if (messageDate.isSame(now.subtract(1, "day"), "day")) return "Yesterday";
  if (messageDate.isSame(now, "year")) return messageDate.format("DD MMM");
  return messageDate.format("DD MMM YYYY");
};

const MessageHeader = ({
  chatId,
  opponentProfile,
  isTyping,
  isOnline = false,
}: {
  chatId?: string;
  isTyping?: boolean;
  opponentProfile?: any;
  isOnline: boolean;
}) => {
  if (!opponentProfile) return null;
  // console.log("onlineeeeeeeeeee",isOnline)
  const initials = opponentProfile.displayName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const statusText = isOnline
    ? "Online"
    : opponentProfile?.lastSeen
      ? `${formatLastSeen(opponentProfile?.lastSeen)}`
      : "Offline";

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        position: "relative",
        zIndex: 10,
        flexShrink: 0,
      }}
      className="px-6 py-4"
    >
      {/* Subtle top shimmer line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent)",
        }}
      />

      <div className="flex items-center justify-between">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-4">
          <Avatar
            size={52}
            style={{
              // background: "linear-gradient(135deg, #14b8a6, #0ea5e9)",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              borderRadius: "14px",
            }}
          >
            {initials}
          </Avatar>

          <div>
            <Typography.Title level={5}>
              {opponentProfile?.displayName}
            </Typography.Title>

            <div style={{ marginTop: "2px", height: "18px" }}>
              {isTyping ? (
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      color: "#14b8a6",
                      fontSize: "12px",
                      fontWeight: 500,
                      fontStyle: "italic",
                    }}
                  >
                    typing
                  </span>
                  {/* Animated dots */}
                  <div
                    className="flex items-center gap-0.5"
                    style={{ marginTop: "2px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          background: "#14b8a6",
                          display: "inline-block",
                          animation: "typingDot 1.2s infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <style>{`
                    @keyframes typingDot {
                      0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
                      30% { opacity: 1; transform: translateY(-3px); }
                    }
                  `}</style>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: "12px",
                    color: isOnline ? "#4ade80" : "#64748b",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {isOnline && (
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                        boxShadow: "0 0 6px #4ade80",
                      }}
                    />
                  )}
                  {statusText}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Audio Call */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AudioCall chatId={chatId} opponentProfile={opponentProfile} />
          </div>

          {/* Video Call */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <VideoCall chatId={chatId} opponentProfile={opponentProfile} />
          </div>

          {/* More */}
          <Button
            type="text"
            icon={<MoreOutlined style={{ fontSize: "18px" }} />}
            style={{
              color: "#94a3b8",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
