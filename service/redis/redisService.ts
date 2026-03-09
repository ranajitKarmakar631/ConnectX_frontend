
import axios from "axios";
import { BASE_API, QUERYKEYS } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const USER_PROFILE_API = `${BASE_API}/redis`;

const getIsOnline = async (payload: any): Promise<any> => {
  const result = await axios.post(
    `${USER_PROFILE_API}/isOnline`,
    payload
  );

  return result.data;
};

export const useGetUserOnline = (payload: any) => {
  return useQuery({
    queryKey: [QUERYKEYS.USER_ONLINE, payload], 
    queryFn: () => getIsOnline(payload),
  });
};




// const getLastMessage = async (payload: any): Promise<any> => {
//   const result = await axios.post(
//     `${USER_PROFILE_API}/last-message`,
//     payload
//   );
//   return result.data;
// };

// export const useGetLastMessage = (payload: any) => {
//   return useQuery({
//     queryKey: [QUERYKEYS.CHAT_LAST_MESSAGE, payload],
//     queryFn: () => getLastMessage(payload),
//   });
// };
