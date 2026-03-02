import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BASE_API, QUERYKEYS } from "../queryKeys";


const USER_API = `${BASE_API}/chats`;

const getConnection = async (
  payload: any,
  pageParam: number
): Promise<any> => {

  const result = await axios.post<any>(
    `${USER_API}/connection-list`,
    {
      ...payload,
      page: pageParam,
    }
  );
  return result.data;
};

export const useGetConnectionList = (payload: any) => {
  return useInfiniteQuery({
    queryKey: [QUERYKEYS.CONNECTION, payload],
    
    queryFn: ({ pageParam = 1 }) =>
      getConnection(payload, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } =
        lastPage?.data?.pagination;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
};
