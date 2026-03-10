import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_API, QUERYKEYS } from "../queryKeys";

const USER_API = `${BASE_API}/users`;
axios.defaults.withCredentials = true;

/* ================================
   Types
================================ */

export interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface RegisterResponse {
  success?: boolean;
  message?: string;
  data?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  token?: string; // token might still be in data or separate depending on backend
}

/* ================================
   API Function (NO HOOK HERE)
================================ */

const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${USER_API}/register`,
    payload,
  );
  return response.data; // 👈 return only data
};

/* ================================
   Mutation Hook
================================ */

export const useRegisterUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerUser,

    onSuccess: (data) => {
      // Invalidate users query
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.USER],
      });
    },
  });
};

const useLoginUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${USER_API}/login`,
    payload,
  );
  return response.data; // 👈 return only data
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: useLoginUser,
    onSuccess: (data) => {
      // Invalidate users query
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.USER],
      });
    },
  });
};

const userLogout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${USER_API}/logout`);
  return response.data; // VERY IMPORTANT
};

export const useLogoutuser = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};
