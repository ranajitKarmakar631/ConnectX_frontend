"use client";

import Dashboard from "@/app/components/dashboard/Dashboard";
import NotificationButton from "@/app/components/dashboard/notification/NotificationButton";
import SocketProvider from "@/app/SocketProvider";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  return (
    <SocketProvider>
      
      <Dashboard />
      <NotificationButton />
    </SocketProvider>
  );
};

export default Page;
