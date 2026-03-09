"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/Redux/hooks";
import { loginSuccess, setInitialized } from "@/Redux/authSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(
        loginSuccess({
          user: JSON.parse(storedUser),
        }),
      );
    } else {
      dispatch(setInitialized(true));
    }
  }, [dispatch]);

  return <>{children}</>;
}
