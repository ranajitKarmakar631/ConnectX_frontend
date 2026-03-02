"use client";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { socketService } from "@/service/socket/socketService";

const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket as Socket;
};

interface Props {
  children: ReactNode;
}

export default function SocketProvider({ children }: Props) {
  const userId = useSelector((state: any) => state.auth?._id);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (userId) {
      console.log("🔌 SocketProvider syncing with userId:", userId);
      // We rely on the middleware to call socketService.connect(userId)
      // but we need to update our state so components get the socket object
      const interval = setInterval(() => {
        const s = socketService.getSocket();
        if (s) {
          setSocket(s);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      // 🛑 Disconnect socket on logout
      socketService.disconnect();
      setSocket(null);
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
