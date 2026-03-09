import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BASE_API, QUERYKEYS } from "../queryKeys";

const USER_PROFILE_API = `${BASE_API}/user-profile`;

const getUserProfile = async (payload: {
  filter: { userId: string };
}): Promise<any> => {
  const result = await axios.post(`${USER_PROFILE_API}/find`, payload);

  return result.data;
};

export const useGetProfileDetails = (payload: {
  filter: { userId: string };
}) => {
  return useQuery({
    queryKey: [QUERYKEYS.USER_PROFILE, payload], // VERY IMPORTANT
    queryFn: () => getUserProfile(payload),
    enabled: !!payload?.filter?.userId && payload.filter.userId !== "null", // prevents auto-run if empty or "null"
  });
};
