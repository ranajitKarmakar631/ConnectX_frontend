"use client";

import React from "react";
import { Avatar, Button, Popconfirm } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

import { useGetProfileDetails } from "@/service/userProfile/userProfileService";
import { getInitials } from "@/uiHelper";
import { useLogoutuser } from "@/service/authService/authService";
import { useAppDispatch } from "@/Redux/hooks";
import { logout } from "@/Redux/authSlice";
import { resetChat } from "@/Redux/ReduxChat/chatSlice";

const ChatFooter = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useParams()?.userId as string;

  const { data: userData } = useGetProfileDetails({filter:{userId}});
  const userProfile = userData?.data;
  console.log("this is my userProfile", userProfile)
  const { mutate: logoutUser, isPending } = useLogoutuser();

  const handleLogout = () => {
    const clearLocalState = () => {
      dispatch(logout());
      dispatch(resetChat());
      router.replace("/login");
    };

    logoutUser(undefined, {
      onSuccess: () => {
        clearLocalState();
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        // Fallback: clear anyway so user isn't stuck
        clearLocalState();
      },
    });
  };

  return (
    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Avatar
          size={36}
          style={{
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {getInitials(userProfile?.displayName)}
        </Avatar>

        <div className="leading-tight">
          <div className="text-[13px] font-bold text-slate-800">
            {userProfile?.displayName}
          </div>
          <div className="text-[10px] font-bold text-blue-500 tracking-wide uppercase">
            Pro Account
          </div>
        </div>
      </div>

      <Popconfirm
        placement="top"
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
      >
        <Button
          type="primary"
          size="large"
          loading={isPending}
          icon={<LogoutOutlined />}
        />
      </Popconfirm>
    </div>
  );
};

export default ChatFooter;
