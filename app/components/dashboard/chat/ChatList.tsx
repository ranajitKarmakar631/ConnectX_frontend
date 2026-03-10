
import React, { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Tooltip, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ChatFooter from "./ChatFooter";
import { ReduxMessage } from "../message/MessageBox";

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
  last?: string;
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

  if (diffDays < 7)
    return d.toLocaleDateString([], { weekday: "short" });

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

  const reduxMessages = useSelector(
    (state: any) => state.chat.messages as ReduxMessage[]
  );

  const lastMessageMap = useMemo(() => {
    const map: Record<string, ReduxMessage> = {};

    reduxMessages?.forEach((msg) => {
      map[msg.chatId] = msg;
    });

    return map;
  }, [reduxMessages]);

  const chatListWithLastMessage = useMemo(() => {
    return chatList?.map((chat) => ({
      ...chat,
      last: lastMessageMap[chat._id]?.message,
    }));
  }, [chatList, lastMessageMap]);

  /* ───────── Filtering ───────── */

  const filtered = chatListWithLastMessage?.filter((item) => {
    const nameMatch = item.opponentProfile?.displayName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (activeFilter === "Unread")
      return nameMatch && (item.unreadCount ?? 0) > 0;

    return nameMatch;
  });

  return (
    <div className="flex flex-col h-screen w-full bg-white border-r border-slate-100 select-none">
      {/* Header */}
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
          >
            ⚙
          </Button>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <Input
          prefix={<SearchOutlined className="!text-slate-400 text-sm" />}
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="!rounded-xl !bg-slate-100 !border-0 !shadow-none"
        />
      </div>

      {/* Filter Tabs */}
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

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filtered?.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Text className="!text-slate-400 !text-sm">
              No conversations
            </Text>
          </div>
        ) : (
          filtered?.map((item) => {
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
                  "relative flex items-center border-b gap-3 px-4 py-3 cursor-pointer transition-colors duration-150",
                  isSelected ? "bg-blue-50" : "hover:bg-slate-50",
                ].join(" ")}
              >
                {/* Avatar */}
                <Badge dot={item.opponentProfile?.isOnline} status="success">
                  <Avatar
                    size={44}
                    src={item.opponentProfile?.avatarUrl}
                    style={{ borderRadius: 14 }}
                  >
                    {!item.opponentProfile?.avatarUrl &&
                      getInitials(item.opponentProfile?.displayName)}
                  </Avatar>
                </Badge>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <Text
                      ellipsis
                      strong
                      className="!text-[13.5px] !text-slate-800"
                    >
                      {item.opponentProfile?.displayName ?? "Unknown"}
                    </Text>

                    <span
                      className={[
                        "text-[11px]",
                        hasUnread
                          ? "text-blue-500 font-semibold"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {formatTime(item.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Text
                      ellipsis
                      className={[
                        "!text-xs flex-1",
                        hasUnread
                          ? "!text-slate-700 !font-medium"
                          : "!text-slate-400",
                      ].join(" ")}
                    >
                      {item?.last ?? "No messages yet"}
                    </Text>

                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                        {(item.unreadCount ?? 0) > 99
                          ? "99+"
                          : item.unreadCount}
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

      {/* Footer */}
      <ChatFooter />
    </div>
  );
};

export default ChatList;

