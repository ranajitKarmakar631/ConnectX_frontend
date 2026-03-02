import axios from "axios";
import { BASE_API, QUERYKEYS } from "../queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CALL_API = `${BASE_API}/calls`;
const callCreate = async (payload: any): Promise<any> => {
  const response = await axios.post<any>(`${CALL_API}/create`, payload);
  return response.data; // 👈 return only data
};

/* ================================
   Mutation Hook
================================ */

export const useCreateCalls = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: callCreate,

    onSuccess: (data: any) => {
      // Invalidate users query
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.CALL_CONNECTION],
      });
    },
  });
};
