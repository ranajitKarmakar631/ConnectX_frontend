export const QUERYKEYS = {
  USER: "login_user",
  CONNECTION: "user_connection",
  USER_PROFILE: "user_profile",
  CALL_CONNECTION: "calls_connection",
  MESSAGES:'messages',
  USER_ONLINE :'user_online',
};

export const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:4000/api";
