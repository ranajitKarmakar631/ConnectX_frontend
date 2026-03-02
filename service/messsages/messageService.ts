import axios from "axios";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API, QUERYKEYS } from "../queryKeys";


const MESSAGE_API= `${BASE_API}/messages`
export interface MessagePayload {
  senderId?: string;
  message?: string;
  chatId?: string;
}

const createMessage = async (
  payload: MessagePayload,
): Promise<void> => {
  const response = await axios.post<any>(
    `${MESSAGE_API}/create`,
    payload,
  );
  return response.data; // 👈 return only data
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: createMessage,

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.MESSAGES],
      });
    },
  });
};



const getChatMessage = async (
  payload: any,
  pageParam: number
): Promise<any> => {

  const result = await axios.post<any>(
    `${MESSAGE_API}/list`,
    {
      ...payload,
      page: pageParam,
    }
  );
  return result.data;
};

export const useGetChatMessageList = (payload: any) => {
  return useInfiniteQuery({
    queryKey: [QUERYKEYS.MESSAGES, payload],
    queryFn: ({ pageParam = 1 }) =>
      getChatMessage(payload, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } =
        lastPage?.data?.pagination;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },

    // 🔥 THIS IS THE MAGIC
    select: (data) => {
      return data.pages.flatMap(
        (page: any) => page.data.results
      );
    },
  });
};