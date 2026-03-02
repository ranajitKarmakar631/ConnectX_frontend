import { socketMiddleware } from "@/service/socket/socketMiddleware";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});
