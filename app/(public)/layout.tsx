"use client";

import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state: any) => state.auth,
  );

  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated && user?._id) {
      router.replace(`/chat/${user._id}`);
    }
  }, [isAuthenticated, user, router, isInitialized]);

  if (isInitialized && isAuthenticated) return null;

  return <>{children}</>;
}
