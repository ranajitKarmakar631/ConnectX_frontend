"use client";

import Dashboard from "@/app/components/dashboard/Dashboard";
import FingerPrint from "@/app/components/dashboard/fingerPrint/FingerPrint";
// import FingerPrint from "@/app/components/dashboard/fingerPrint/fingerPrint";
import NotificationButton from "@/app/components/dashboard/notification/NotificationButton";
import SocketProvider from "@/app/SocketProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const isAuthenticated = true; // from your auth logic

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login"); // replace is safer
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // prevent rendering Dashboard
  }

  return (
    <SocketProvider>
      
      <Dashboard />
      <NotificationButton />
    </SocketProvider>
  );
};

export default Page;
