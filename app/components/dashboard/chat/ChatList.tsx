import React, { useState } from "react";
import { Avatar, Badge, Button, Input, Tooltip, Typography } from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import ChatFooter from "./ChatFooter";

const { Text } = Typography;

interface ChatItem {
  _id: string;
  opponentProfile?: {
    displayName?: string;
    isOnline?: boolean;
    avatarUrl?: string;
    status?: string;
  };
  lastMessage?: { text?: string; isOwn?: boolean };
  lastMessageAt: string | number | Date;
  unreadCount?: number;
}

interface ChatListProps {
  chatList?: ChatItem[];
  onSelectChat?: (item: ChatItem) => void;
}

function formatTime(date: string | number | Date) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type FilterType = "All" | "Unread" | "Mentions";

const ChatList: React.FC<ChatListProps> = ({ chatList, onSelectChat }) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    chatList?.[0]?._id ?? null,
  );
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered =
    chatList?.filter((item) => {
      const nameMatch = item.opponentProfile?.displayName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      if (activeFilter === "Unread")
        return nameMatch && (item.unreadCount ?? 0) > 0;
      return nameMatch;
    }) ?? [];

  return (
    <div className="flex flex-col h-screen w-full bg-white border-r border-slate-100 select-none">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <span
          className="text-xl font-extrabold tracking-tight text-blue-500"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          EliteChat
        </span>
        <Tooltip title="Filter chats">
          <Button
            type="text"
            size="small"
            className="!text-slate-400 hover:!text-blue-500 !border-0 !w-8 !h-8 !flex !items-center !justify-center !rounded-lg"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="9" y2="18" />
                <polyline points="17 15 21 12 17 9" />
              </svg>
            }
          />
        </Tooltip>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3">
        <Input
          prefix={<SearchOutlined className="!text-slate-400 text-sm" />}
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="!rounded-xl !bg-slate-100 !border-0 !shadow-none
            [&_input]:!bg-transparent [&_input]:!text-slate-700
            [&_input]:placeholder:!text-slate-400
            hover:!bg-slate-100 focus-within:!bg-slate-100"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 px-4 pb-3">
        {(["All", "Unread", "Mentions"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={[
              "text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer transition-all duration-150",
              activeFilter === f
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Chat List ── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Text className="!text-slate-400 !text-sm">No conversations</Text>
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = selectedId === item._id;
            const hasUnread = (item.unreadCount ?? 0) > 0;

            return (
              <div
                key={item._id}
                onClick={() => {
                  setSelectedId(item._id);
                  onSelectChat?.(item);
                }}
                className={[
                  "relative flex items-center border-b-1 gap-3 px-4 py-3 cursor-pointer transition-colors duration-150",
                  isSelected ? "bg-blue-50" : "hover:bg-slate-50",
                ].join(" ")}
              >
                {/* Selected stripe */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-blue-500 rounded-r-full" />
                )}

                {/* Avatar with online badge */}
                <Badge
                  dot={item.opponentProfile?.isOnline}
                  status="success"
                  offset={[-3, 41]}
                  styles={{
                    indicator: {
                      width: 10,
                      height: 10,
                      boxShadow: "0 0 0 2px #fff",
                    },
                  }}
                >
                  <Avatar
                    size={44}
                    src={item.opponentProfile?.avatarUrl}
                    style={{
                      borderRadius: 14,
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {!item.opponentProfile?.avatarUrl &&
                      getInitials(item.opponentProfile?.displayName)}
                  </Avatar>
                </Badge>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  {/* Name + time */}
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Text
                        ellipsis
                        strong
                        className="!text-[13.5px] !text-slate-800 !leading-snug !max-w-[95px]"
                      >
                        {item.opponentProfile?.displayName ?? "Unknown"}
                      </Text>
                      {item.opponentProfile?.status === "ACTIVE" && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded tracking-wide flex-shrink-0 uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <span
                      className={[
                        "text-[11px] flex-shrink-0 ml-1",
                        hasUnread
                          ? "text-blue-500 font-semibold"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {formatTime(item.lastMessageAt)}
                    </span>
                  </div>

                  {/* Message preview + unread badge */}
                  <div className="flex items-center justify-between gap-1">
                    <Text
                      ellipsis
                      className={[
                        "!text-xs flex-1 min-w-0",
                        hasUnread
                          ? "!text-slate-700 !font-medium"
                          : "!text-slate-400",
                      ].join(" ")}
                    >
                      {item.lastMessage?.text ?? "No messages yet"}
                    </Text>
                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                        {(item.unreadCount ?? 0) > 99
                          ? "99+"
                          : item.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer / Current User ── */}

      <ChatFooter />
    </div>
  );
};

export default ChatList;
