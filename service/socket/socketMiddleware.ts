import { Middleware } from "@reduxjs/toolkit";
import { socketService } from "./socketService";
import {
  messageReceived,
  setIncomingCall,
  userIsTyping,
  userStopTyping,
} from "@/Redux/ReduxChat/chatSlice";

export const socketMiddleware: Middleware = (store) => {
  return (next) => (action: any) => {
    if (action.type === "socket/connect") {
      const userId = action.payload;
      socketService.connect(userId);
      console.log("🔌 Socket connected via middleware for user:", userId);

      // Listen for incoming calls
      socketService.on("incoming:call", (data) => {
        console.log("📞 Middleware: Incoming call received:", data);
        console.log(' yeee tera incoming call', data);
        store.dispatch(setIncomingCall(data));
      });

      // Listen for remote hang-up
      socketService.on("call-ended", () => {
        console.log("📞 Middleware: Remote user ended call");
        store.dispatch({ type: "chat/endCall" });
      });

      // Listen for new messages
      socketService.on("receive-message", (data) => {
        console.log("📩 Middleware: Message received:", data);
        store.dispatch(messageReceived(data));
      });

      // Listen for typing events
      socketService.on(
        "user-typing",
        (data: { userId: string; chatId: string }) => {
          console.log("⌨️ Middleware: User is typing:", data);
          store.dispatch(userIsTyping(data.chatId));
        },
      );

      socketService.on(
        "user-stop-typing",
        (data: { userId: string; chatId: string }) => {
          console.log("⌨️ Middleware: User stopped typing:", data);
          store.dispatch(userStopTyping(data.chatId));
        },
      );

      // Listen for online status
      socketService.on("user-online", (userId) => {
        store.dispatch({ type: "chat/userCameOnline", payload: userId });
      });

      socketService.on("user-offline", (userId) => {
        store.dispatch({ type: "chat/userWentOffline", payload: userId });
      });

      // Re-join active room if exists
      const state = store.getState();
      const currentChatId = state.chat?.currentChatId;
      if (currentChatId) {
        console.log(
          "🔄 Re-joining active room after reconnect:",
          currentChatId,
        );
        socketService.emit("join-room", currentChatId);
      }
    }

    if (action.type === "chat/joinRoom" || action.type === "socket/join-room") {
      console.log("🚪 Joining room:", action.payload);
      socketService.emit("join-room", action.payload);
    }

    if (action.type === "socket/send-message") {
      console.log("📤 Sending message:", action.payload);
      socketService.emit("send-message", action.payload);
    }

    return next(action);
  };
};
