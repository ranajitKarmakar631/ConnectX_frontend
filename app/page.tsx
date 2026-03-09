"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/Redux/hooks";

export default function Page() {
  const { _id, isInitialized } = useAppSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (_id) {
        router.replace(`/chat/${_id}`);
      } else {
        router.replace("/login");
      }
    }
  }, [isInitialized, _id, router]);

  return null;
}
