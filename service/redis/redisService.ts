
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
  console.log('alllllllllllllllll', payload);
  return useQuery({
    queryKey: [QUERYKEYS.USER_ONLINE, payload], // VERY IMPORTANT
    queryFn: () => getIsOnline(payload),
    // enabled: !!payload, // prevents auto-run if empty
  });
};
