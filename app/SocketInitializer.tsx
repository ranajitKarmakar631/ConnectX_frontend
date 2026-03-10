"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./SocketProvider";
import IncomingCallModal from "./components/dashboard/calls/IncomingCallModal";
import { clearIncomingCall } from "@/Redux/ReduxChat/chatSlice";
import { Modal } from "antd";
import OnVideoCall from "./components/dashboard/calls/OnVideoCall";
import { stat } from "fs";

export default function SocketInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth?._id);
  const incomingCall = useSelector((state: any) => state.chat.incomingCall);
  const outgoingCall = useSelector((state: any) => state.chat.outgoingCall);
  const isCallActive = useSelector((state: any) => state.chat.isCallActive);
  const callType = useSelector(
    (state: any) =>
      state.chat.outgoingCall?.callType || state.chat.incomingCall?.callType,
  );

  const socket = useSocket();

  useEffect(() => {
    if (userId) {
      dispatch({ type: "socket/connect", payload: userId });
      console.log("📡 SocketMiddleware connect dispatched for:", userId);
    }
  }, [dispatch, userId]);

  const handleAcceptCall = () => {
    console.log("📞 [SocketInitializer] Call accepted. Data:", incomingCall);
    dispatch({ type: "chat/acceptCall" });
  };

  const handleDeclineCall = () => {
    console.log(
      "📞 [SocketInitializer] Call declined. Data:",
      incomingCall || outgoingCall,
    );
    dispatch({ type: "chat/endCall" });
  };

  console.log("🔔 [SocketInitializer] Modal State:", {
    open: !!incomingCall || isCallActive,
    isCallActive,
    hasIncoming: !!incomingCall,
    hasOutgoing: !!outgoingCall,
  });

  return (
    <>
      {children}
      <Modal open={!!incomingCall || isCallActive} footer={null}>
        <OnVideoCall
          callType={callType}
          declineCall={handleDeclineCall}
          acceptCall={handleAcceptCall}
          isCallActive={isCallActive}
        />
      </Modal>
    </>
  );
}
