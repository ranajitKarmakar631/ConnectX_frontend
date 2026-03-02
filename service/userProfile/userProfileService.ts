import axios from "axios";
import { BASE_API, QUERYKEYS } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

const USER_PROFILE_API = `${BASE_API}/user-profile`;

const getUserProfile = async (payload: any): Promise<any> => {
  const result = await axios.post(
    `${USER_PROFILE_API}/find`,
    payload
  );

  return result.data;
};

export const useGetProfileDetails = (payload: any) => {
  return useQuery({
    queryKey: [QUERYKEYS.USER_PROFILE, payload], // VERY IMPORTANT
    queryFn: () => getUserProfile(payload),
    // enabled: !!payload, // prevents auto-run if empty
  });
};
