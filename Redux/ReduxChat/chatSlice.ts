import { createSlice } from "@reduxjs/toolkit";

interface Message {
  id: number | string;
  chatId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [] as Message[],
    onlineUsers: [] as string[],
    typingChats: [] as string[],
    currentChatId: null as string | null,
    incomingCall: null as any,
    outgoingCall: null as any,
    isCallActive: false,
  },
  reducers: {
    messageReceived: (state, action) => {
      console.log(
        "📩 REDUX: Message received and added to state:",
        
        action.payload,
      );
      state.messages.push(action.payload);
    },
    userCameOnline: (state, action) => {
      console.log("🟢 REDUX: User came online:", action.payload);
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userWentOffline: (state, action) => {
      console.log("🔴 REDUX: User went offline:", action.payload);
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload,
      );
    },
    joinRoom: (state, action) => {
      state.currentChatId = action.payload;
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userIsTyping: (state, action) => {
      if (!state.typingChats.includes(action.payload)) {
        state.typingChats.push(action.payload);
      }
    },

    userStopTyping: (state, action) => {
      state.typingChats = state.typingChats.filter(
        (id) => id !== action.payload,
      );
    },
    setIncomingCall: (state, action) => {
      console.log("🔔 REDUX: Setting incoming call:", action.payload);
      state.incomingCall = action.payload;
    },
    startCall: (state, action) => {
      console.log("📞 REDUX: Starting call", action.payload);
      state.isCallActive = true;
      state.outgoingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      console.log("🔕 REDUX: Clearing incoming call");
      state.incomingCall = null;
    },
    acceptCall: (state) => {
      console.log("📞 REDUX: Accepting call");
      state.isCallActive = true;
      // state.incomingCall = null; // Preserve it for signaling logic
    },
    endCall: (state) => {
      console.log("📞 REDUX: Ending call");
      state.isCallActive = false;
      state.incomingCall = null;
      state.outgoingCall = null;
    },
    resetChat: (state) => {
      state.messages = [];
      state.onlineUsers = [];
      state.typingChats = [];
      state.currentChatId = null;
      state.incomingCall = null;
      state.outgoingCall = null;
      state.isCallActive = false;
    },
  },
});

export const {
  messageReceived,
  userCameOnline,
  userWentOffline,
  joinRoom,
  userIsTyping,
  userStopTyping,
  setIncomingCall,
  clearIncomingCall,
  acceptCall,
  endCall,
  startCall,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
