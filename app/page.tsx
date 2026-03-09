"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/Redux/hooks";

export default function Page() {
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state: any) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated && user?._id) {
        router.replace(`/chat/${user._id}`);
      } else {
        router.replace("/login");
      }
    }
  }, [isInitialized, isAuthenticated, user, router]);

  return null;
}
