"use client";

import axiosConfig from "@/libs/axiosConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export default function AppInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  useEffect(() => {
    axiosConfig();
  }, []);

return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
