'use client'
import ProtectedRoute from "@/app/components/protectedRoute";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>{children}</ProtectedRoute>
  );
};

export default Layout;
