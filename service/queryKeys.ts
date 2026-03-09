export const QUERYKEYS = {
  USER: "login_user",
  CONNECTION: "user_connection",
  USER_PROFILE: "user_profile",
  CALL_CONNECTION: "calls_connection",
  MESSAGES:'messages',
  USER_ONLINE :'user_online',
  CHAT_LAST_MESSAGE:'chat_last_message'
};

export const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:4000/api";
