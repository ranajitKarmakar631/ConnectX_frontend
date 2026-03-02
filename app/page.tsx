'use client'
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {
  const userId = useSelector((state: any) => state.auth?._id);
  redirect(`chat/${userId}`);
}