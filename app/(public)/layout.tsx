"use client";

import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAppSelector(
    (state: any) => state.auth
  );

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      router.replace(`/chat/${user._id}`);
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) return null;

  return <>{children}</>;
}
